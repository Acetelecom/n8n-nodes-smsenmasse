# Changelog — SMS en Masse n8n Community Node

## 1.0.9

- Use `httpRequestWithAuthentication` instead of manual `httpRequest` (required by n8n scanner)
- Add `authenticate` and `test` properties to credentials (credential test support)
- Add `peerDependencies: { "n8n-workflow": "*" }` to package.json

## 1.0.8

- Add `author` field in `package.json` (required by n8n Creator Portal)
- Migrate to dedicated public repository for npm provenance support

## 1.0.7

- Add Jest test suite (`npm run test`) required for n8n Creator Portal submission
- Add `package-lock.json` to repository so `npm ci` works in GitHub Actions
- Add `Test` step in `publish-n8n.yml` GitHub Actions workflow (runs before build)

## 1.0.6

- Publish via GitHub Actions with npm provenance statement (required for n8n Creator Portal verification)
- Added `@n8n/node-cli` ≥ 0.23.0 as devDependency for linting (`npm run lint`)

## 1.0.3

Initial release adapted from the Zapier integration v1.0.3.

### Features
- **Operation**: Send SMS Campaign — creates and sends an SMS campaign to one or more recipients
- **Operation**: Get Balance — retrieves available SMS credits on the account
- **Operation**: List Campaigns — lists SMS campaigns with pagination
- API Key authentication via `X-API-KEY` header
