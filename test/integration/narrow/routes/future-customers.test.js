const { crumbToken } = require('./test-helper')

describe('Page: /future-customers', () => {
  const varList = { projectImpact: 'randomData' }

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
      url: `${global.__URLPREFIX__}/future-customers`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Who will your new customers be after the project?')
    expect(response.payload).toContain('Producers or growers')
    expect(response.payload).toContain('Processors')
    expect(response.payload).toContain('Wholesalers')
    expect(response.payload).toContain('Retailers')
    expect(response.payload).toContain('Selling direct to consumers')
    expect(response.payload).toContain('No change')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/future-customers`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { futureCustomers: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select all options that apply')
  })

  it('user selects a valid customer option together with option: \'No change\' -> display error page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/future-customers`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { futureCustomers: ['Processors', 'No change'], crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('You cannot select ‘No change’ and another option')
  })

  it('user selects eligible option -> store user response and redirect to /collaboration', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/future-customers`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { futureCustomers: 'Wholesalers', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('collaboration')
  })
})
