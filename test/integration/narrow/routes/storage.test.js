const { crumbToken } = require('./test-helper')

describe('Page: /storage', () => {
  const varList = { projectItems: 'randomData' }

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
      url: `${global.__URLPREFIX__}/storage`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Does your project also need storage facilities?')
    expect(response.payload).toContain('Yes, we will need storage facilities')
    expect(response.payload).toContain('No, we don’t need it')
    expect(response.payload).toContain('Storage facilities cannot be more than 50% of the total grant funding.')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/storage`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { storage: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if you will need storage facilities')
  })

  it('user selects first option -> store user response and redirect to /project-cost', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/storage`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { storage: 'Yes, we will need storage facilities', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('project-cost')
  })

  it('user selects second option -> store user response and redirect to /project-cost', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/storage`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { storage: 'No, we don’t need it', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('project-cost')
  })
})
