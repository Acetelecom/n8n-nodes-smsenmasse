import {
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow'

export class SmsEnMasseApi implements ICredentialType {
  name = 'smsEnMasseApi'
  displayName = 'SMS en Masse API'
  documentationUrl = 'https://www.smsenmasse.fr/v1/account-settings'
  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      required: true,
      hint: 'Available in your account settings under "Authentication" → apiKeyAuth.',
    },
  ]
}
