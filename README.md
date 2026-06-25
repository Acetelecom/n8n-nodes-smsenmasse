# n8n-nodes-smsenmasse

Official [SMS en Masse](https://www.smsenmasse.fr) community node for [n8n](https://n8n.io).

Send SMS campaigns, check your credit balance, and list your campaigns directly from your n8n workflows — no code required.

---

## Features

- **Send SMS Campaign** — Create and send an SMS to one or more recipients instantly or on a schedule
- **Get Balance** — Retrieve the number of SMS credits available on your account
- **List Campaigns** — List your SMS campaigns with pagination

---

## Prerequisites

- An [n8n](https://n8n.io) instance (self-hosted or n8n Cloud)
- An **SMS en Masse** account with an API key → [Sign up free](https://www.smsenmasse.fr/v1/public/register/) (20 free SMS included)

---

## Installation

### In n8n (recommended)

1. Go to **Settings → Community Nodes**
2. Click **Install**
3. Enter the package name: `n8n-nodes-smsenmasse`
4. Click **Install** and restart n8n if prompted

### Self-hosted (CLI)

```bash
npm install n8n-nodes-smsenmasse
```

---

## Authentication

This node uses API Key authentication via the `X-API-KEY` header.

1. In your workflow, add the **SMS en Masse** node
2. Click **Create new credential**
3. Paste your API key (available in your account under **Settings → Authentication**)

---

## Operations

### Send SMS Campaign

| Field | Required | Description |
|---|---|---|
| Recipients | ✅ | Phone numbers in international format, comma-separated (e.g. `33645332637,33667656608`) |
| Message | ✅ | SMS content. Messages longer than 160 characters are split automatically |
| Campaign Name | | Internal label to identify the campaign in your account |
| Sender Name | | 3–11 characters, must start with a letter. Leave empty for the default short number |
| Scheduled Send Date | | Leave empty for immediate sending |
| Country | | ISO 3166-1 alpha-2 code (default: `FR`) |
| Custom Identifier | | Your internal reference to find this campaign in your systems |
| Webhook URL (DLR) | | URL to receive delivery status updates (one call per SMS) |

### Get Balance

Returns the number of SMS credits available on your account.

### List Campaigns

| Field | Description |
|---|---|
| Page | Page number, starting at 1 |
| Limit | Number of campaigns returned (max 100) |

---

## Workflow examples

- **Google Sheets → SMS en Masse** — Send an SMS for each new row added to a spreadsheet
- **Typeform → SMS en Masse** — Send a confirmation SMS when a form is submitted
- **Google Calendar → SMS en Masse** — Send an SMS reminder before an event
- **HubSpot → SMS en Masse** — Send a welcome SMS when a new lead is created
- **Webhook → SMS en Masse** — Trigger an SMS from any external service

---

## Links

- Website: [smsenmasse.fr](https://www.smsenmasse.fr)
- API documentation: [api.smsenmasse.fr/docs](https://api.smsenmasse.fr/docs#description/introduction)
- Integration guide: [smsenmasse.fr/api-connecteurs](https://www.smsenmasse.fr/api-connecteurs)
- Support: [smsenmasse.fr/v1/public/help](https://www.smsenmasse.fr/v1/public/help)

---

## License

MIT
