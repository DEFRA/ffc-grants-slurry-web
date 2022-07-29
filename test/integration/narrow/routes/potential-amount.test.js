const { crumbToken } = require('./test-helper')

describe('Page: /potential-amount', () => {
  const varList = { itemsTotalValue: '500000' }
  const pageText = 'Based on the standardised costs for each item and the approximate size and quantities you entered, we estimate you could be eligble for a grant of £500,000'

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
      url: `${global.__URLPREFIX__}/potential-amount`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Potential grant funding')
    expect(response.payload).toContain(pageText)
  })

  it('should redirect to /remaining-costs when user press continue', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/potential-amount`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { remainingCosts: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('remaining-costs')
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/potential-amount`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"project-summary\" class=\"govuk-back-link\" id=\"linkBack\">Back</a>')
  })
})
