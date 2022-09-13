describe('Get & Post Handlers', () => {
  const varList = {
    planningPermission: 'some fake value',
    gridReference: 'grid-ref-num',
    businessDetails: 'fake business',
    applying: true
  }

  jest.mock('../../../../app/helpers/page-guard', () => ({
    guardPage: (a, b, c) => false
  }))

  jest.mock('../../../../app/helpers/urls', () => ({
    getUrl: (a, b, c, d) => 'mock-url'
  }))

  jest.mock('../../../../app/helpers/session', () => ({
    setYarValue: (request, key, value) => null,
    getYarValue: (request, key) => {
      if (varList[ key ]) return varList[ key ]
      else return null
    }
  }))

  let question
  let mockH

  const { getHandler, getPostHandler } = require('../../../../app/helpers/handlers')

  test('will redirect to start page if planning permission evidence is missing', async () => {
    question = {
      url: 'planning-permission-summary',
      title: 'mock-title'
    }
    mockH = { redirect: jest.fn() }

    await getHandler(question)({}, mockH)
    expect(mockH.redirect).toHaveBeenCalledWith('/slurry-infrastructure/start')
  })

  test('is eligible if calculated grant = min grant - whether grant is capped or not', async () => {
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

  test('getPostHandler', async () => {
    question = {
      baseUrl: 'mock-url',
      yarKey: 'cover',
      title: 'mock-title',
      ineligibleContent: true,
      answers: [ { value: 'mock-value', key: 'cover-A2' } ],
      nextUrl: 'mock-next-url',
      type: 'mock-type',
    }
    mockH = { redirect: jest.fn() }
    let mockSet = jest.fn();
    await getPostHandler(question)({ payload: { a: "mock-value" }, yar: { set: mockSet } }, mockH)
    expect(mockH.redirect).toHaveBeenCalledWith('mock-url')
  })
})
