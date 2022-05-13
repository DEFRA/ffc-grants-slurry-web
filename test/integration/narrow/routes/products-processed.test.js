const { crumbToken } = require('./test-helper')

describe('Page: /produce-processed', () => {
  const varList = { canPayRemainingCost: 'randomData' }

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
      url: `${global.__URLPREFIX__}/produce-processed`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('What type of produce is being processed?')
    expect(response.payload).toContain('Arable produce')
    expect(response.payload).toContain('Horticultural produce')
    expect(response.payload).toContain('Dairy or meat produce')
    expect(response.payload).toContain('Fodder produce')
    expect(response.payload).toContain('Non-edible produce')
    expect(response.payload).toContain('Fibre produce')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/produce-processed`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { productsProcessed: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select the type of produce being processed')
  })

  it('user selects an option -> store user response and redirect to /how-adding-value', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/produce-processed`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { productsProcessed: 'Horticultural produce', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('how-adding-value')
  })
})
