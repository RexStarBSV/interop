import { execFileSync, spawnSync } from 'node:child_process';
const [base] = process.argv.slice(2);
if (!base || /^0+$/.test(base)) {
  console.log('No prior revision: initial journal history');
} else if (execFileSync('git', ['rev-list', '--parents', '-n', '1', 'HEAD'], { encoding: 'utf8' }).trim().split(/\s+/).length === 1) {
  // A prelaunch Git reset may retain prior evidence, but cannot rewrite it.
  // Compare trees directly: the new root intentionally has no shared ancestry.
  const prior = spawnSync('git', ['rev-parse', '--verify', '--end-of-options', `${base}^{commit}`], { encoding: 'utf8' });
  if (prior.status === 0) {
    const changed = execFileSync('git', ['diff', '--no-renames', '--name-only', '--diff-filter=DMT', '-z', prior.stdout.trim(), 'HEAD', '--', 'journals/'], { encoding: 'utf8' }).split('\0').filter(p => p && p !== 'journals/README.md');
    if (changed.length) throw new Error(`Retained journal files modified or removed at replacement root: ${changed.join(', ')}`);
    console.log('Replacement root preserves existing journal evidence');
  } else {
    // A fresh clone after the authorized reset contains only the new history.
    // CI verifies every retained bundle separately before establishing this baseline.
    console.log('Initial source baseline: prior Git history unavailable; retained bundles require separate verification');
  }
} else {
  const revision = execFileSync('git', ['rev-parse', '--verify', '--end-of-options', `${base}^{commit}`], { encoding: 'utf8' }).trim();
  execFileSync('git', ['merge-base', '--is-ancestor', revision, 'HEAD']);
  const changed = execFileSync('git', ['diff', '--no-renames', '--name-only', '--diff-filter=DMT', '-z', revision, 'HEAD', '--', 'journals/'], { encoding: 'utf8' }).split('\0').filter(Boolean);
  // README is policy prose. Published evidence files are immutable.
  const evidence = changed.filter(p => p !== 'journals/README.md');
  if (evidence.length) throw new Error(`Published journal files modified or removed: ${evidence.join(', ')}`);
  console.log('Existing published journal evidence preserved');
}
