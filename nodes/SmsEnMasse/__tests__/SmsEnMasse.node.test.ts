import { SmsEnMasse } from '../SmsEnMasse.node'

describe('SmsEnMasse Node', () => {
  const node = new SmsEnMasse()

  it('has the correct internal name', () => {
    expect(node.description.name).toBe('smsEnMasse')
  })

  it('belongs to the output group', () => {
    expect(node.description.group).toContain('output')
  })

  it('requires the smsEnMasseApi credential', () => {
    expect(node.description.credentials).toHaveLength(1)
    expect(node.description.credentials![0].name).toBe('smsEnMasseApi')
    expect(node.description.credentials![0].required).toBe(true)
  })

  it('exposes the three expected operations', () => {
    const operationProp = node.description.properties.find(
      (p) => p.name === 'operation',
    )
    expect(operationProp).toBeDefined()
    const values = (operationProp!.options as Array<{ value: string }>).map(
      (o) => o.value,
    )
    expect(values).toContain('sendCampaignSms')
    expect(values).toContain('getBalance')
    expect(values).toContain('listCampaigns')
  })

  it('has at least one input and one output', () => {
    expect(node.description.inputs).toHaveLength(1)
    expect(node.description.outputs).toHaveLength(1)
  })
})
