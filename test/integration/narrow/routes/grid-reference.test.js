const { crumbToken } = require('./test-helper')

describe('Page: /grid-reference', () => {
  const varList = { 'current-score': 'randomData' }

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
      url: `${global.__URLPREFIX__}/grid-reference`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('What is the OS grid reference for your slurry store?')
    expect(response.payload).toContain('OS grid reference number')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/grid-reference`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { PlanningPermissionEvidence: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter OS Grid reference')
  })

  it('user came from \'PLANNING PERMISSION SUMMARY\' page -> display <Back to evidence summary> button', async () => {
    varList.reachedEvidenceSummary = true

    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/planning-permission`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Back to evidence summary')
  })

  it('should validate OS grid reference number - OS Grid Reference must be two letters followed by 8 digits', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/grid-reference`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        gridReferenceNumber: 'ds123456',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('OS Grid Reference must be two letters followed by 8 digits')
  })

  it('should validate OS grid reference number - First two characters should be letter following eight characters must be numbers', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/grid-reference`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        gridReferenceNumber: 'AB-12478975',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('First two characters should be letter following eight characters must be numbers')
  })

  it('store user response and redirect to planning-permission-summary: /planning-permission-summary', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/grid-reference`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        gridReferenceNumber: 'AB12478975',
        crumb: crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('planning-permission-summary')
  })
})
