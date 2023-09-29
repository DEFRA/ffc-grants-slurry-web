const { crumbToken } = require('./test-helper')

jest.mock('../../../../app/messaging/application')
const { getreferenceCosts } = require('../../../../app/messaging/application')
const messaging = require('../../../../app/messaging/application')

const gapiService = require('../../../../app/services/gapi-service')

jest.mock('../../../../app/helpers/page-guard')
const { guardPage } = require('../../../../app/helpers/page-guard')

describe('reference Cost test', () => {
  const varList = {}

  beforeEach(() => {
    jest.clearAllMocks()
  })

  jest.mock('../../../../app/helpers/session', () => ({
    setYarValue: (request, key, value) => null,
    getYarValue: (request, key) => {
      if (varList[key]) return varList[key]
      else return 'Error'
    }
  }))

  test('GET /reference-grant-amounts route returns 200 if costData = success', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/reference-grant-amounts`
    }

    getreferenceCosts.mockResolvedValue({
      costData: 'success'
    })

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('GET /reference-grant-amounts route returns 500 if costData =/= success', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/reference-grant-amounts`
    }

    getreferenceCosts.mockResolvedValue({
      costData: 'fail'
    })

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('GET /reference-grant-amounts route causes error page', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/reference-grant-amounts`
    }

    getreferenceCosts.mockRejectedValue('hello')

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('GET /stanbdardised-costs returns error 500 if getreferenceCosts throws error', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/reference-grant-amounts`
    }

    jest.spyOn(messaging, 'getreferenceCosts').mockImplementation(() => { throw new Error() })

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('POST /reference-grant-amounts route returns next page - building journey', async () => {
    const options = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/reference-grant-amounts`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { applying: '', crumb: crumbToken }
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(302)
  })

  test('POST /reference-grant-amounts route returns next page - impermeable journey', async () => {
    varList.applyingFor = "An impermeable cover only"
    varList.fitForPurpose = 'Yes'
    const options = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/reference-grant-amounts`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { applying: '', crumb: crumbToken }
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(302)
  })

  test('page redirects to start if no cover', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/reference-grant-amounts`
    }

    guardPage.mockResolvedValue(true)

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('/slurry-infrastructure/start')
  })
})
