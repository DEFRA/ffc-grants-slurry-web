const { crumbToken } = require('./test-helper')

describe('Page: /storage-capacity-increase', () => {
  const varList = { storageCapacityIncrease: 'randomData' }
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
      url: `${global.__URLPREFIX__}/storage-capacity-increase`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('What estimated additional volume do you need to have 6 months’ serviceable storage?')
  })

  it('no value entered -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/storage-capacity-increase`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { storageCapacityIncrease: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter the estimated additional volume')
  })

  it('user enter estimated additional volume -> redirect to /project-cost', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/storage-capacity-increase`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { storageCapacityIncrease: 123, crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('project-cost')
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/storage-capacity-increase`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain(`<a href=\"standard-costs" class=\"govuk-back-link\">Back</a>`)
  })
})
