const { crumbToken } = require('./test-helper')


describe('Storage Type test', () => {
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

  test('GET /storage-type route returns 200', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/storage-type`
    }


    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('What type of store do you want?')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/storage-type`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { storageType: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Please select an option')
  })

  test('POST /storage-type route returns next page', async () => {
    const optionsone = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-type`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { projectType: 'Replace an existing store that is no longer fit for purpose with a new store', crumb: crumbToken }
    }
    
    const responseOne = await global.__SERVER__.inject(optionsone)
    expect(responseOne.statusCode).toBe(302)

    const options = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/storage-type`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { storageType: 'fake data', crumb: crumbToken }
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('serviceable-capacity-increase-replace')
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/storage-type`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"standardised-cost\" class=\"govuk-back-link\">Back</a>')
  })
})
