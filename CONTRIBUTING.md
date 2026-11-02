# Contributing

## Project contributions

Intentionally submitted original contributions are provided under the [Apache License, Version 2.0](LICENSE), unless explicitly identified otherwise before submission. Contributors retain ownership. There is no separate contributor agreement, IP pledge, membership requirement or mandatory sign-off.

Submit only material you have authority to contribute. Identify third-party material and preserve its license and attribution. Maintainers resolve incompatible or uncertain permissions before incorporating it as Apache-licensed project material. Exclude production credentials, personal user records and unrelated confidential information.

## Technical proposals

Use an issue or pull request to explain the affected semantics, vectors, infrastructure or presentation. Normative changes precede evaluations that rely on them. Vectors identify their pinned requirement, independent expected outcome, applicability, setup, teardown and evidence. Review follows [governance](GOVERNANCE.md) and the editorial guidance in [AGENTS.md](AGENTS.md).

Run `npm test`, `npm run check` and the Python packaging tests in the [operator guide](docs/operator-quickstart.md). Changes to synthesis also require its typecheck and tests. Check documentation links after structural edits.

## Software submitted for evaluation

Evaluation submissions retain their existing licenses and ownership. They use the [submission terms](legal/ARTIFACT-SUBMISSION-AGREEMENT.md), which are separate from Apache-licensed contributions. They authorize TPNIL evaluations and give everyone continuing rights to obtain, run and mirror accepted submissions solely to reproduce TPNIL evaluations and verify their results. They also permit truthful participation announcements. This limited submission grant excludes resale and unrelated use or redistribution. Identify the vendor, authorized contact, exact artifact digests, applicable licenses and dependencies, and any platform or activation limits. An email or pull-request comment explicitly accepting the terms for those artifacts is sufficient; a separate signed schedule is not required.

Ordinary licensed software may also be evaluated without a vendor submission. Such evaluation does not establish vendor participation or additional hosting rights. It supports a public laboratory result only when the public reproduction requirements are also satisfied. The [intake process](docs/intake.md) records the evidence supporting each permission.

## Reports and disputes

Report laboratory security defects through [SECURITY.md](SECURITY.md). For interoperability discrepancies, provide synthetic fixtures, requirement identifiers and supporting evidence through an issue. Result challenges follow the [review process](GOVERNANCE.md#changes-disputes-and-appeals).
