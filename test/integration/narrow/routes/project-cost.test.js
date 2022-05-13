const { crumbToken } = require('./test-helper')

describe('Page: /project-cost', () => {
  const varList = { storage: 'randomData' }

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
      url: `${global.__URLPREFIX__}/project-cost`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('What is the total estimated cost of the items?')
  })

  it('no value is typed in -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-cost`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { projectCost: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter the estimated cost for the items')
  })

  it('user types in any amount less than £62500 -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-cost`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { projectCost: '62499', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
  })

  it('user types in an invalid value -> display error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-cost`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { projectCost: '62500q', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('Enter a whole number in correct format')
  })

  it('user types in a value with more than 10 digits -> display error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-cost`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { projectCost: '11111111111', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('Enter a whole number with a maximum of 10 digits')
  })

  it('user types in a valid value (eg £62500) -> store user response and redirect to /potential-amount', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-cost`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { projectCost: '62500', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('potential-amount')
  })
})
