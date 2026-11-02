import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { ROOT, readJson } from '../src/core.mjs';
import { digest } from '../src/json.mjs';
import { reviewIntake } from '../src/intake.mjs';

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'tpnil-intake-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const record = structuredClone(readJson(path.join(ROOT, 'test/fixtures/intake-v1.json')));
  record.artifact.sha256 = digest('fixture'); record.artifact.size = 7;
  fs.writeFileSync(path.join(root, 'artifact'), 'fixture');
  for (const e of record.evidence) {
    const file = path.join(root, e.path); fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, 'evidence'); e.sha256 = digest('evidence');
  }
  return { root, record, artifact: path.join(root, 'artifact') };
}

test('source-only intake remains blocked and cannot issue a conformance claim', async t => {
  const {root,record,artifact}=fixture(t);
  const result=await reviewIntake(record,artifact,root);
  assert.equal(result.claim,'INTAKE_REVIEW_ONLY');
  assert.equal(result.readiness,'BLOCKED');
  assert.equal(result.unmet.length,7);
  assert.deepEqual(await reviewIntake(record,artifact,root),result);
});
test('verified runtime criteria require runtime evidence, not source inspection', async t => {
  const {root,record,artifact}=fixture(t);
  record.criteria.find(c=>c.id==='production-fidelity').status='verified';
  await assert.rejects(reviewIntake(record,artifact,root),/requires runtime-observation/);
});
test('intake rejects omitted criteria, live-broadcast scope changes, and unknown references', async t => {
  const {root,record,artifact}=fixture(t);
  const missing=structuredClone(record);missing.criteria.pop();
  await assert.rejects(reviewIntake(missing,artifact,root),/Incomplete/);
  const live=structuredClone(record);live.publicMainnetBroadcast=true;
  await assert.rejects(reviewIntake(live,artifact,root));
  record.criteria[0].evidenceIds=['missing'];
  await assert.rejects(reviewIntake(record,artifact,root),/Unknown evidence/);
});
test('intake detects altered artifacts and altered referenced evidence', async t => {
  const {root,record,artifact}=fixture(t);
  fs.writeFileSync(artifact,'changed');
  await assert.rejects(reviewIntake(record,artifact,root),/artifact digest/);
  fs.writeFileSync(artifact,'fixture');fs.writeFileSync(path.join(root,record.evidence[0].path),'changed');
  await assert.rejects(reviewIntake(record,artifact,root),/Evidence digest/);
});
test('intake rejects evidence traversal and symlink substitution', async t => {
  const {root,record,artifact}=fixture(t);
  const bad=structuredClone(record);bad.evidence[0].path='../outside';
  await assert.rejects(reviewIntake(bad,artifact,root),/Unsafe/);
  const file=path.join(root,record.evidence[0].path);fs.unlinkSync(file);fs.symlinkSync(artifact,file);
  await assert.rejects(reviewIntake(record,artifact,root),/Symlink/);
});

test('retained intake review verifies from archived objects and detects changes', async t => {
  const { verifyIntakeReview } = await import('../src/intake.mjs');
  const { canonical, hashJson } = await import('../src/json.mjs');
  const { root, record, artifact } = fixture(t);
  const report = await reviewIntake(record, artifact, root);
  const objects = path.join(root, 'objects'); fs.mkdirSync(objects);
  fs.writeFileSync(path.join(objects, hashJson(record)), canonical(record));
  for (const e of record.evidence) fs.copyFileSync(path.join(root, e.path), path.join(objects, e.sha256));
  const file = path.join(root, 'report.json');fs.writeFileSync(file, JSON.stringify(report));
  assert.deepEqual(verifyIntakeReview(file, objects), { verified: true, claim: 'INTAKE_REVIEW_ONLY', artifactBytesRehashed: false });
  report.readiness = 'READY_FOR_EXECUTION'; fs.writeFileSync(file, JSON.stringify(report));
  assert.throws(() => verifyIntakeReview(file, objects), /differs/);
  fs.writeFileSync(path.join(objects, record.evidence[0].sha256), 'altered');
  assert.throws(() => verifyIntakeReview(file, objects), /digest/);
});

function currentFixture(t) {
  const fixtureData = fixture(t);
  const { root, record } = fixtureData;
  record.schemaVersion = '2.0.0';
  record.criteria = record.criteria.filter(c => c.id !== 'retention-rights');
  record.evidence = ['release-metadata', 'runtime-observation', 'rights-record'].map(kind => {
    fs.writeFileSync(path.join(root, kind), kind);
    return { id: kind, path: kind, sha256: digest(kind), kind };
  });
  for (const criterion of record.criteria) {
    criterion.status = 'verified';
    criterion.evidenceIds = [criterion.id === 'artifact-identity' ? 'release-metadata' : 'runtime-observation'];
  }
  record.permissions = Object.fromEntries(['evaluate', 'retain', 'redistribute', 'publishResults', 'announceParticipation'].map(action => [action, {
    status: ['evaluate', 'retain'].includes(action) ? 'granted' : 'unresolved',
    finding: `Fixture permission: ${action}`,
    evidenceIds: ['rights-record']
  }]));
  return fixtureData;
}

test('current intake permits authorized evaluation without redistribution or participation publicity', async t => {
  const { root, record, artifact } = currentFixture(t);
  const report = await reviewIntake(record, artifact, root);
  assert.equal(report.schemaVersion, '2.0.0');
  assert.equal(report.technicalReadiness, 'READY_FOR_EXECUTION');
  assert.equal(report.readiness, 'READY_FOR_EXECUTION');
  assert.deepEqual(report.permittedActions, ['evaluate', 'retain']);
  assert.equal(report.permissions.announceParticipation.status, 'unresolved');
  assert.equal(report.claim, 'INTAKE_REVIEW_ONLY');
});

test('evaluation and retention authorization independently gate execution without changing technical readiness', async t => {
  const { root, record, artifact } = currentFixture(t);
  for (const action of ['evaluate', 'retain']) {
    for (const status of ['unresolved', 'denied']) {
      const changed = structuredClone(record);
      changed.permissions[action].status = status;
      const report = await reviewIntake(changed, artifact, root);
      assert.equal(report.technicalReadiness, 'READY_FOR_EXECUTION');
      assert.equal(report.readiness, 'BLOCKED');
      assert.deepEqual(report.unmet.map(item => item.id), [`permission:${action}`]);
      assert.ok(!report.permittedActions.includes(action));
    }
  }
});

test('every granted permission needs rights evidence; malformed and unknown permissions fail closed', async t => {
  const { root, record, artifact } = currentFixture(t);
  for (const action of Object.keys(record.permissions)) {
    const changed = structuredClone(record);
    changed.permissions[action].status = 'granted';
    changed.permissions[action].evidenceIds = ['runtime-observation'];
    await assert.rejects(reviewIntake(changed, artifact, root), /requires rights-record/);
  }
  const changed = structuredClone(record);
  changed.permissions.evaluate.evidenceIds = ['unknown'];
  await assert.rejects(reviewIntake(changed, artifact, root), /Unknown permission evidence/);
  changed.permissions.evaluate.evidenceIds = ['rights-record', 'rights-record'];
  await assert.rejects(reviewIntake(changed, artifact, root), /Duplicate permission evidence/);
  delete record.permissions.announceParticipation;
  await assert.rejects(reviewIntake(record, artifact, root), /missing announceParticipation/);
});

test('current archived reviews retain permission scope and detect permission tampering', async t => {
  const { verifyIntakeReview } = await import('../src/intake.mjs');
  const { canonical, hashJson } = await import('../src/json.mjs');
  const { root, record, artifact } = currentFixture(t);
  const report = await reviewIntake(record, artifact, root);
  const objects = path.join(root, 'objects'); fs.mkdirSync(objects);
  fs.writeFileSync(path.join(objects, hashJson(record)), canonical(record));
  for (const evidence of record.evidence) fs.copyFileSync(path.join(root, evidence.path), path.join(objects, evidence.sha256));
  const file = path.join(root, 'report.json'); fs.writeFileSync(file, JSON.stringify(report));
  assert.equal(verifyIntakeReview(file, objects).verified, true);
  report.permissions.announceParticipation.status = 'granted';
  fs.writeFileSync(file, JSON.stringify(report));
  assert.throws(() => verifyIntakeReview(file, objects), /differs/);
});
