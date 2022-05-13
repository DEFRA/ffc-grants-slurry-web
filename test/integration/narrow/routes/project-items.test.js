const { crumbToken } = require('./test-helper')

describe('Page: /project-items', () => {
  const varList = { projectStart: 'randomData1', tenancy: 'randomData2' }

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
      url: `${global.__URLPREFIX__}/project-items`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('What eligible items does your project need?')
    expect(response.payload).toContain('Constructing or improving buildings')
    expect(response.payload).toContain('Processing equipment or machinery')
    expect(response.payload).toContain('Retail facilities')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-items`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { projectItems: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select all the items your project needs')
  })

  it('user selects any number of options -> store user response and redirect to /storage', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-items`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { projectItems: ['Constructing or improving buildings', 'Retail facilities'], crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('storage')
  })
})
