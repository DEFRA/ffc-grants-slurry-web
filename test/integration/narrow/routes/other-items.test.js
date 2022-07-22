const { crumbToken } = require('./test-helper')

describe('Other Items test', () => {
  const varList = { storageType: 'random', coverType: 'random' }

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

  test('GET /other-items route returns 200', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/other-items`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('What other items do you need?')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/other-items`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { storageType: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Please select an option')
  })

  test('POST /other-items route returns next page', async () => {
    const options = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/other-items`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { otherItems: 'fake data', crumb: crumbToken }
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('remaining-costs')
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/other-items`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"cover-size\" class=\"govuk-back-link\">Back</a>')
  })
})
