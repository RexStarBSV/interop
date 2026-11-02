# Laboratory security

## Isolated execution

Submitted binaries and logs are untrusted inputs. Run SUTs in disposable, isolated environments with the selected profile's fixtures and scoped credentials. The guest receives the run inputs; operator home directories, production identities, cloud credentials, signing keys and Docker control sockets remain outside it. SUT networks remain isolated from production infrastructure. Instructions embedded in artifacts or output have no authority over the coordinator.

Pull-request CI uses disposable hosted workers, read-only repository permissions and no secrets. Native execution uses reviewed, authorized workflows. Artifact intake, execution and publication remain separate trust boundaries.

## Private reporting

Use GitHub's private vulnerability-reporting control in this repository's Security tab when available. Otherwise, ask a [listed maintainer](GOVERNANCE.md#stewardship) to establish a confidential channel before sending sensitive details. Public issues may describe ordinary interoperability discrepancies using synthetic fixtures and evidence identifiers.

## Evidence and publication

Public evidence uses isolated fixture identities and the selected profile's declared network and funding boundary. Preserve confidential originals in restricted storage. Publish reviewed derivatives only with the permissions recorded through [intake](docs/intake.md), identifying their relationship to the retained originals. Public-result artifacts and reproduction materials follow the [evidence policy](docs/evidence.md).
