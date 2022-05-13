const { crumbToken } = require('./test-helper')

describe('Page: /planning-permission', () => {
  const varList = { inEngland: 'randomData' }

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
      url: `${global.__URLPREFIX__}/planning-permission`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Does the project have planning permission?')
    expect(response.payload).toContain('Not needed')
    expect(response.payload).toContain('Secured')
    expect(response.payload).toContain('Should be in place by 31 January 2024')
    expect(response.payload).toContain('Will not be in place by 31 January 2024')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/planning-permission`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { planningPermission: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select when the project will have planning permission')
  })

  it('user selects ineligible option: \'Will not be in place by 31 January 2024\' -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/planning-permission`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { planningPermission: 'Will not be in place by 31 January 2024', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
  })

  it('user selects conditional option: \'Should be in place by 31 January 2024\' -> display conditional page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/planning-permission`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { planningPermission: 'Should be in place by 31 January 2024', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('planning-required-condition')
  })

  it('user selects eligible option [Not needed | Secured]-> store user response and redirect to /project-start', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/planning-permission`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { planningPermission: 'Secured', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('project-start')
  })
})
