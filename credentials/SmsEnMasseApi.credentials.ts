import {
  IAuthenticateGeneric,
  ICredentialTestRequest,
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

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        'X-API-KEY': '={{$credentials.apiKey}}',
      },
    },
  }

  test: ICredentialTestRequest = {
    request: {
      baseURL: 'https://api.smsenmasse.fr/api/v1',
      url: '/sms/balance',
      method: 'GET',
    },
  }
}
