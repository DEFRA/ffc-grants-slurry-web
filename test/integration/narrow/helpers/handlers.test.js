describe('Get & Post Handlers', () => {
  jest.mock('../../../../app/helpers/page-guard', () => ({
    guardPage: (a, b, c) => false
  }))

  jest.mock('../../../../app/helpers/urls', () => ({
    getUrl: (a, b, c, d) => 'mock-url'
  }))

  jest.mock('../../../../app/helpers/session')
  const { getYarValue, setYarValue } = require('../../../../app/helpers/session')

  let question
  let mockH

  const { getHandler } = require('../../../../app/helpers/handlers')

  test('is eligible if calculated grant = min grant - whether grant is capped or not', async () => {
    let dict
    getYarValue.mockImplementation((req, key) => (dict[key]))
    setYarValue.mockImplementation((req, key, val) => { dict[key] = val })

    dict = {}
    question = {
      url: 'mock-url',
      title: 'mock-title',
      maybeEligible: true,
      maybeEligibleContent: { reference: 'mock-reference' }
    }
    mockH = { redirect: jest.fn() }

    await getHandler(question)({}, mockH)
    expect(mockH.redirect).toHaveBeenCalledWith('/slurry-infrastructure/start')
  })
})
