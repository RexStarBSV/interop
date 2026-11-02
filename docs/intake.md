# Production SUT intake

Version 2.0.0. Used for new ISI-4 1.0.0 intake reviews.

Intake establishes what the laboratory can faithfully observe in a production implementation and under which conditions. It preserves the submitted artifact and accommodates its ordinary configuration. Laboratory integration capability is assessed separately from software conformance.

## Procedure

1. **Identify the subject.** Record publisher, exact release, artifact digest and size, platform, signatures, and source revision where available. Preserve release metadata and distinguish claimed provenance from verified bytes. Existing user wallets are outside the intake environment.
2. **Inventory ordinary behavior.** Record first-run configuration, authentication, permission prompts, storage choices, transaction submission, proof and header acquisition, discovery, updates, telemetry, and other observed dependencies. Source observations identify candidate routes; runtime traces confirm them.
3. **Select the configuration.** Prefer normal UI or documented configuration. Record every changed setting, its purpose, supported configuration evidence, and potential effect on measured behavior. Keep local and remote storage results distinct. Custom builds and semantic patches are separate SUTs.
4. **Qualify the environment.** Verify a clean runner, artifact installation, isolated identity and state, reset and teardown, and egress controls. Explicitly configured endpoints use operator-controlled or owner-authorized identities. Destination authentication and application trust controls remain active.
5. **Establish the service boundary.** Inventory renderer, background, storage, and subprocess traffic independently. For each relevant service, record the configured endpoint, observed destination, request/response visibility, event control, and evidence. Uncontrolled mandatory dependencies block the affected controlled-service vectors. Optional limitations remain visible in coverage.
6. **Define the initial state.** Pin the fixture transactions, headers, proofs, storage records, funding provenance, and wallet import sequence. State which properties are validated independently and which are supplied by the fixture model. A mainnet-formatted fixture is not a public-mainnet UTXO or proof of network acceptance.
7. **Map assertions.** Bind each vector to its observable evidence and independent oracle. Record timing barriers, permitted randomness, exact semantic comparison, and failure classification before execution. Instrumentation effects and unresolved interpretations remain explicit.
8. **Reproduce and review.** Verify reset and repeat the initial state. Preserve all observations and attempts. Review configuration fidelity, known differences, coverage, and retention permissions before admitting the configuration for scored evaluation.

## Qualitative criteria

| Criterion | Required evidence |
| --- | --- |
| `artifact-identity` | Verified artifact bytes and publisher/release binding |
| `production-fidelity` | Original installation, supported settings, and recorded intervention effects |
| `runner-isolation` | Clean guest identity, egress policy, state separation, and teardown |
| `service-coverage` | Runtime routing and observations for every required service and process |
| `initial-state` | Funding, header, proof, storage, and wallet-state provenance |
| `observation-coverage` | Requirement-to-evidence mapping and independent predicates |
| `repeatability` | Clean reset and repeated baseline observations |


Each criterion has a finding, evidence references, and one of `verified`, `source-observed`, `unresolved`, or `not-supported`. Source observations do not satisfy runtime criteria. A `not-supported` integration capability limits coverage without assigning a SUT conformance failure. There is no weighted score that can compensate for a missing mandatory observation.

## Permissions

Record five permissions separately, each with a finding, evidence references and `granted`, `unresolved` or `denied` status:

| Permission | Scope |
| --- | --- |
| `evaluate` | Install, execute and test the identified artifact in the declared environment |
| `retain` | Keep and host the artifact for continued evaluation and reproduction |
| `redistribute` | Deliver artifact copies to others under the recorded access terms |
| `publishResults` | Publish findings and the necessary identified evidence |
| `announceParticipation` | Identify the vendor as a participant in TPNIL communications |

Every `granted` permission requires supporting `rights-record` evidence, such as applicable license text or an authorized acceptance of the [submission terms](../legal/ARTIFACT-SUBMISSION-AGREEMENT.md). A public download URL, technical success or source observation alone does not establish additional rights or vendor participation. Reviewers check the evidence, dependencies and scope; the validator checks structure and digests, not legal authority.

`technicalReadiness` depends on the seven technical criteria. Overall `readiness` additionally requires `evaluate` and `retain` permission. Redistribution, result publication and participation announcements require their respective grants before those actions, but a missing grant does not change a technical verdict. Keep restricted artifacts outside public Git. Hosting and publication claims reflect the actual permissions and platform limits.

An independent evaluation under existing permissions does not make the vendor a participant. Vendor participation requires the authorized acceptance described in the submission terms, including public hosting, evaluator sharing, findings publication and truthful participation announcements. Source disclosure, a broad contributor IP pledge and a separate governance agreement are unnecessary.

## Review command

```sh
node bin/tpnil.mjs review-intake suts/intake/bsv-desktop-2.8.5.json out/artifacts/BSV-Desktop-2.8.5-arm64-mac.dmg
```

The command validates the record, checks referenced evidence digests, streams and verifies the candidate artifact, and reports every unmet criterion. `INTAKE_REVIEW_ONLY` identifies the output. `READY_FOR_EXECUTION` means the technical criteria and evaluation/retention permissions have supporting evidence and the structural checks pass; reviewers remain responsible for validating the observations and permissions. It is not a SUT verdict. `BLOCKED` exits 1; malformed records or integrity failures exit 2.

This command performs no installation, networking, wallet calls, or transaction broadcast. Actual execution requires the admitted adapter and environment.

The current review records apply this process to [BSV Desktop 2.8.5](../suts/intake/bsv-desktop-2.8.5.md), [Yours Wallet 5.1.0](../suts/intake/yours-wallet-5.1.0.md), and [Metanet Explorer 1.1.10 for Android](../suts/intake/metanet-explorer-1.1.10-android.md).

The first retained [intake review](../journals/intake/2026-09-18/bsv-desktop-2.8.5-macos-arm64.json) records BLOCKED readiness. It binds the evidence and artifact digests available at that time and remains preserved when later reviews are added. Native qualification now supplies installation and bridge evidence; service coverage, fixture state, observation coverage, and retention terms still prevent a replacement `READY_FOR_EXECUTION` review.

## Retained reviews

Version 1.0.0 intake files and archived reports retain their original eight criteria, including `retention-rights`. `schemas/intake-v1.schema.json` and the verifier preserve their original interpretation and report shape. Current prelaunch intake files use version 2.0.0, preserving their technical findings and explicitly marking unrecorded permissions unresolved. Archived reviews retain their original bytes and interpretation. A new permission or review creates a successor record; it does not rewrite an archived result or imply retrospective acceptance of current submission terms.
