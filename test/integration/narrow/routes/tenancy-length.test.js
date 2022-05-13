const { crumbToken } = require('./test-helper')

describe('Page: /tenancy-length', () => {
  const varList = { tenancy: 'randomData' }

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
      url: `${global.__URLPREFIX__}/tenancy-length`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Do you have a tenancy agreement until 2028 or after?')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/tenancy-length`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { tenancyLength: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the land has a tenancy agreement in place until 2028 or after')
  })

  it('user selects conditional option: \'No\' -> display conditional page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/tenancy-length`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { tenancyLength: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('tenancy-length-condition')
  })

  it('user selects eligible option: \'Yes\' -> store user response and redirect to /project-items', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/tenancy-length`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { tenancyLength: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('project-items')
  })
})
