import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
} from 'n8n-workflow'

const API_BASE = 'https://api.smsenmasse.fr/api/v1'
const SETTINGS_URL = 'https://www.smsenmasse.fr/v1/account-settings'

const STATE_LABEL: Record<string, string> = {
  '-1': 'Draft',
  '0':  'Scheduled',
  '1':  'In Progress',
  '2':  'Completed',
  '3':  'Sender Error',
  '4':  'Network Error',
  '5':  'Unknown Error',
  '6':  'Excluded (STOP)',
  '7':  'Filtered',
}

export class SmsEnMasse implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'SMS en Masse',
    name: 'smsEnMasse',
    icon: 'file:smsenmasse.png',
    group: ['output'],
    version: 1,
    subtitle: '={{$parameter["operation"]}}',
    description: 'Send SMS campaigns and manage your SMS en Masse account.',
    defaults: {
      name: 'SMS en Masse',
    },
    codex: {
      categories: ['Communication'],
      subcategories: {
        Communication: ['SMS'],
      },
      alias: ['sms', 'sms en masse', 'smsenmasse', 'text message', 'envoi sms', 'campagne sms', 'marketing sms'],
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'smsEnMasseApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Send SMS Campaign',
            value: 'sendCampaignSms',
            description: 'Create and send an SMS campaign to one or more recipients',
            action: 'Send an SMS campaign',
          },
          {
            name: 'Get Balance',
            value: 'getBalance',
            description: 'Retrieve the number of SMS credits available on your account',
            action: 'Get account balance',
          },
          {
            name: 'List Campaigns',
            value: 'listCampaigns',
            description: 'List SMS campaigns with optional pagination',
            action: 'List campaigns',
          },
        ],
        default: 'sendCampaignSms',
      },

      // ── sendCampaignSms fields ──────────────────────────────────────
      {
        displayName: 'Recipients',
        name: 'recipients',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { operation: ['sendCampaignSms'] } },
        description: 'Phone numbers in international format, comma-separated. Example: 33645332637,33667656608.',
      },
      {
        displayName: 'Message',
        name: 'message',
        type: 'string',
        typeOptions: { rows: 4 },
        required: true,
        default: '',
        displayOptions: { show: { operation: ['sendCampaignSms'] } },
        description: 'SMS content. Max 160 characters per SMS; longer messages are split automatically.',
      },
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: { show: { operation: ['sendCampaignSms'] } },
        options: [
          {
            displayName: 'Campaign Name',
            name: 'name',
            type: 'string',
            default: '',
            description: 'Internal name to identify the campaign in your SMS en Masse account',
          },
          {
            displayName: 'Country',
            name: 'country',
            type: 'string',
            default: 'FR',
            description: 'ISO 3166-1 alpha-2 country code. Example: FR, BE, CH.',
          },
          {
            displayName: 'Custom Identifier',
            name: 'identifier',
            type: 'string',
            default: '',
            description: 'Your internal reference to find this campaign in your systems',
          },
          {
            displayName: 'Scheduled Send Date',
            name: 'sendAt',
            type: 'dateTime',
            default: '',
            description: 'Leave empty for immediate sending',
          },
          {
            displayName: 'Sender Name',
            name: 'sender',
            type: 'string',
            default: '',
            description: '3 to 11 characters, must start with a letter. Leave empty to use the default short number.',
          },
          {
            displayName: 'Webhook URL (DLR)',
            name: 'webhookUrl',
            type: 'string',
            default: '',
            description: 'URL to receive delivery status updates for each SMS',
          },
        ],
      },

      // ── listCampaigns fields ───────────────────────────────────────
      {
        displayName: 'Page',
        name: 'page',
        type: 'number',
        default: 1,
        displayOptions: { show: { operation: ['listCampaigns'] } },
        description: 'Page number, starting at 1',
      },
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
								typeOptions: {
									minValue: 1,
								},
        default: 50,
        displayOptions: { show: { operation: ['listCampaigns'] } },
        description: 'Max number of results to return',
      },
    ],
  }

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData()
    const credentials = await this.getCredentials('smsEnMasseApi')
    const apiKey = credentials.apiKey as string
    const returnData: INodeExecutionData[] = []

    for (let i = 0; i < items.length; i++) {
      const operation = this.getNodeParameter('operation', i) as string

      const headers: Record<string, string> = {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json',
      }

      if (operation === 'sendCampaignSms') {
        const recipients = this.getNodeParameter('recipients', i) as string
        const message    = this.getNodeParameter('message', i) as string
        const extra      = this.getNodeParameter('additionalFields', i) as Record<string, unknown>

        const body: Record<string, unknown> = { recipients, message }
        if (extra.name)       body.name       = extra.name
        if (extra.sender)     body.sender     = extra.sender
        if (extra.sendAt)     body.sendAt     = extra.sendAt
        if (extra.country)    body.country    = extra.country
        if (extra.identifier) body.identifier = extra.identifier
        if (extra.webhookUrl) body.webhookUrl = extra.webhookUrl

        const response = await this.helpers.httpRequest({
          method: 'POST',
          url: `${API_BASE}/sms`,
          headers,
          body: JSON.stringify(body),
          returnFullResponse: true,
          ignoreHttpStatusErrors: true,
        })

        if (response.statusCode === 422) {
          throw new NodeOperationError(
            this.getNode(),
            `Invalid SMS or insufficient credits. Check your message, recipients and balance at ${SETTINGS_URL}`,
          )
        }
        if ([400, 401, 403].includes(response.statusCode)) {
          throw new NodeOperationError(
            this.getNode(),
            `Invalid or missing API key. Check your key at ${SETTINGS_URL}`,
          )
        }
        if (response.statusCode < 200 || response.statusCode >= 300) {
          throw new NodeOperationError(this.getNode(), `Error ${response.statusCode} while sending the campaign.`)
        }

        const data = typeof response.body === 'string' ? JSON.parse(response.body) : response.body
        returnData.push({ json: { id: data.campagneId, campagneId: data.campagneId, ...data } })
      }

      else if (operation === 'getBalance') {
        const response = await this.helpers.httpRequest({
          method: 'GET',
          url: `${API_BASE}/sms/balance`,
          headers,
          returnFullResponse: true,
          ignoreHttpStatusErrors: true,
        })

        if (response.statusCode < 200 || response.statusCode >= 300) {
          throw new NodeOperationError(this.getNode(), `Error ${response.statusCode} while retrieving balance.`)
        }

        const data    = typeof response.body === 'string' ? JSON.parse(response.body) : response.body
        const balance = data.balance ?? data.credits ?? data.amount ?? data
        returnData.push({ json: { balance } })
      }

      else if (operation === 'listCampaigns') {
        const page  = this.getNodeParameter('page', i) as number
        const limit = this.getNodeParameter('limit', i) as number

        const response = await this.helpers.httpRequest({
          method: 'GET',
          url: `${API_BASE}/sms`,
          qs: { page, limit },
          headers,
          returnFullResponse: true,
          ignoreHttpStatusErrors: true,
        })

        if (response.statusCode < 200 || response.statusCode >= 300) {
          throw new NodeOperationError(this.getNode(), `Error ${response.statusCode} while fetching campaigns.`)
        }

        const data = typeof response.body === 'string' ? JSON.parse(response.body) : response.body
        const list: Record<string, unknown>[] = Array.isArray(data) ? data : (data.data ?? [])

        for (const c of list) {
          returnData.push({
            json: {
              ...c,
              id: c.id ?? `${c.name}-${c.sendAt}`,
              stateLabel: STATE_LABEL[String(c.state)] ?? String(c.state),
            },
          })
        }
      }
    }

    return [returnData]
  }
}
