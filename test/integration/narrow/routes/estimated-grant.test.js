const { crumbToken } = require('./test-helper')

describe('Page: /estimated-grant', () => {
  const varList = { projectCost: '12345678' }
  const grantText = 'Add some information about the project (for example, type of store and capacity, type of cover and size, approximate size and quantity of other items you need) so we can estimate how much grant you could get.'

  jest.mock('../../../../app/helpers/session', () => ({
    setYarValue: (request, key, value) => null,
    getYarValue: (request, key) => {
      if (varList[key]) return varList[key]
      else return 'Error'
    }
  }))

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/estimated-grant`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Estimate how much grant you could get')
    expect(response.payload).toContain(grantText)
  })

  it('should redirect to /planning-permission when user press continue', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/estimated-grant`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { remainingCosts: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('standardised-cost')
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/estimated-grant`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"cover\" class=\"govuk-back-link\" id=\"linkBack\">Back</a>')
  })
})
