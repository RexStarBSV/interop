# Evidence, journals, and retention

A run envelope binds UTC start and end timestamps, laboratory revision, workspace state, ISI/ITCVE/profile identifiers and versions, SUT manifests and digests, platform matrix, dependency closure, initial state and seed identifiers, plan, adapter, oracle, schema, vector corpus, logical schedule, observations, outcomes, and limitations. Timestamp metadata is separate from the deterministic semantic-result digest.

Raw observations are retained before normalization. Evidence includes protocol requests and responses, transaction bytes and proofs, state commitments, installation and provisioning records, device logs, relevant screenshots, cleanup status, and denied external requests. Every observation identifies its adapter and execution step. Official signing keys are separate from disposable fixture identities.

## Integrity and verification

The offline core stores blobs at `objects/<sha256>`, hashes canonical JSON, and links journal entries through `previous`. Entry hashes bind sequence, timestamp, run record, and predecessor. Verification checks every link and referenced object. Replay recomputes outcomes from stored inputs and compares them with the recorded report.

A single-writer lock serializes appends. The journal entry is the commit point; unreferenced staging objects are excluded from published evidence. Interrupted writes require inspected recovery under the [operator procedure](operator-quickstart.md). Missing or modified content fails verification.

These mechanisms detect changes relative to a trusted checkpoint. Independent checkpoints, mirrors and signatures can strengthen verification beyond a repository administrator's control. Reports identify the checks actually performed. Independent observation and reproduction establish confidence in recorded inputs. [Repository controls](repository-controls.md) records the available controls; future certification requirements are separately published.

## Storage and retention

Accepted journal entries and small evidence objects are retained in the repository. Public-result binaries and reproduction bundles use publicly accessible, content-addressed archives. Anyone may retain, run and mirror accepted artifacts solely to reproduce TPNIL evaluations and verify their results, with the same continuing reproduction permissions. This limited submission grant excludes resale and unrelated use or redistribution; broader rights available under other licenses remain intact. Preserve exact installation materials, configurations, dependency inventories, fixtures, criteria and evidence needed to reproduce the result. Digests and vendor download links alone are insufficient.

Public-result admission requires verified public reproduction permissions and an accessible reproduction bundle under the [intake process](intake.md#public-result-admission). Unresolved rights or essential replay dependencies keep a result outside public admission. Internal observations may precede that admission.

Public requirements and adjudication history have permanent retention by default. Artifact retention, redistribution, result-publication and participation-publicity permissions are recorded separately under the [intake process](intake.md). Corrections and certification withdrawals are appended as new records referencing the original digest; original results and failed attempts remain retained.

Evidence classification occurs before publication. Public evidence uses synthetic identities and fixture funds. Restricted evidence is encrypted and separately access-controlled under recorded terms. Applicable confidentiality or erasure obligations are addressed through that separation, with a public tombstone recording any later retention change.
