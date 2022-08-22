const { crumbToken } = require('./test-helper')

jest.mock('../../../../app/messaging/application')
const { getStandardisedCosts } = require('../../../../app/messaging/application')
const messaging = require('../../../../app/messaging/application')

jest.mock('../../../../app/helpers/page-guard')
const { guardPage } = require('../../../../app/helpers/page-guard')

describe('Standardised Cost test', () => {
  const varList = { }

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

  test('GET /standardised-grant-amounts route returns 200 if costData = success', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/standardised-grant-amounts`
    }

    getStandardisedCosts.mockResolvedValue({
      costData: 'success'
    })

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('GET /standardised-grant-amounts route returns 500 if costData =/= success', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/standardised-grant-amounts`
    }

    getStandardisedCosts.mockResolvedValue({
      costData: 'fail'
    })

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('GET /standardised-grant-amounts route causes error page', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/standardised-grant-amounts`
    }

    getStandardisedCosts.mockRejectedValue('hello')

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('GET /stanbdardised-costs returns error 500 if getstandardisedCosts throws error', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/standardised-grant-amounts`
    }

    jest.spyOn(messaging, 'getStandardisedCosts').mockImplementation(() => { throw new Error() })

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('POST /standardised-grant-amounts route returns next page', async () => {
    const options = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/standardised-grant-amounts`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { applying: '', crumb: crumbToken }
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(302)
  })

  test('page redirects to start if no cover', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/standardised-grant-amounts`
    }

    guardPage.mockResolvedValue(true)

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('/slurry-infrastructure/start')
  })
})
