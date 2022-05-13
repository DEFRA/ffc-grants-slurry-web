const { crumbToken } = require('./test-helper')

describe('Page: /how-adding-value', () => {
  const varList = { productsProcessed: 'randomData' }

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
      url: `${global.__URLPREFIX__}/how-adding-value`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('How will your project add value to the produce?')
    expect(response.payload).toContain('Creating a new product')
    expect(response.payload).toContain('Grading or sorting produce')
    expect(response.payload).toContain('Packing produce')
    expect(response.payload).toContain('New retail facility to sell direct to consumers')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/how-adding-value`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { howAddingValue: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select how you will add value to the produce')
  })

  it('user selects an option -> store user response and redirect to /project-impact', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/how-adding-value`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { howAddingValue: 'Grading or sorting produce', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('project-impact')
  })
})
