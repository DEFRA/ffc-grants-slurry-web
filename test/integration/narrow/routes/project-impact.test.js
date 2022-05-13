const { crumbToken } = require('./test-helper')

describe('Page: /project-impact', () => {
  const varList = { howAddingValue: 'randomData' }

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
      url: `${global.__URLPREFIX__}/project-impact`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('What impact will the project have?')
    expect(response.payload).toContain('Creating added-value products for the first time')
    expect(response.payload).toContain('Increasing volume of added-value products')
    expect(response.payload).toContain('Increasing range of added-value products')
    expect(response.payload).toContain('Allow selling direct to consumer')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-impact`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { projectImpact: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select the impact your project will have')
  })

  it('user selects option 1 together with option 2 -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-impact`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        projectImpact: ['Creating added-value products for the first time', 'Increasing volume of added-value products'],
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot select that combination of options')
  })

  it('user selects option 1 together with option 3 -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-impact`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        projectImpact: ['Creating added-value products for the first time', 'Increasing range of added-value products'],
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot select that combination of options')
  })

  it('user selects an acceptable combination of options -> store user response and redirect to /future-customers', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-impact`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        projectImpact: ['Increasing volume of added-value products', 'Allow selling direct to consumer'],
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('future-customers')
  })
})
