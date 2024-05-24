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
    expect(response.payload).toContain('Existing store OS grid reference')
    expect(response.payload).toContain('New store OS grid reference')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/grid-reference`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { 
        existingGridReference: '', 
        newGridReference: '',
        crumb: crumbToken 
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter your existing store OS Grid Reference')
    expect(postResponse.payload).toContain('Enter your new store OS Grid Reference')
  })

  it('user came from \'PLANNING PERMISSION SUMMARY\' page -> display <Back to evidence summary> button', async () => {
    varList.reachedEvidenceSummary = true

    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/grid-reference`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Back to evidence summary')
  })

  it('should validate Existing store OS grid reference number - Existing store OS grid reference must be 2 letters followed by 10 digits', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/grid-reference`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { 
        existingGridReference: 'ds123456', 
        newGridReference: 'SP1234567890',
        crumb: crumbToken 
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Existing store OS Grid Reference must be 2 letters followed by 10 numbers')
  })

  it('should validate Existing store OS grid reference number - First two characters should be letter following ten characters must be numbers', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/grid-reference`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { 
        existingGridReference: 'SP-12478975', 
        newGridReference: 'SP1234567890',
        crumb: crumbToken 
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Existing store OS Grid Reference must be 2 letters followed by 10 numbers')
  })

  it('should validate New store OS grid reference number - New store OS grid reference must be 2 letters followed by 10 digits', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/grid-reference`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { 
        existingGridReference: 'SP1234567890', 
        newGridReference: 'ds123456',
        crumb: crumbToken 
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('New store OS Grid Reference must be 2 letters followed by 10 numbers')
  })

  it('should validate New store OS grid reference number - First two characters should be letter following ten characters must be numbers', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/grid-reference`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { 
        existingGridReference: 'SP1234567890', 
        newGridReference: 'SP-12478975',
        crumb: crumbToken 
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('New store OS Grid Reference must be 2 letters followed by 10 numbers')
  })

  // it('should validate OS grid reference number - First two characters should be letter following ten characters must be numbers', async () => {
  //   const postOptions = {
  //     method: 'POST',
  //     url: `${global.__URLPREFIX__}/grid-reference`,
  //     headers: { cookie: 'crumb=' + crumbToken },
  //     payload: {
  //       gridReference: 'AB-12478975',
  //       crumb: crumbToken
  //     }
  //   }

  //   const postResponse = await global.__SERVER__.inject(postOptions)
  //   expect(postResponse.statusCode).toBe(200)
  //   expect(postResponse.payload).toContain('First 2 characters should be letter following 10 characters must be numbers')
  // })

  it('should validate Existing store OS grid reference number - Existing store OS grid reference number must be a letter combination for England', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/grid-reference`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { 
        existingGridReference: 'AB1234567890', 
        newGridReference: 'SP1234567890',
        crumb: crumbToken 
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('The existing store OS grid reference number must be a letter combination for England')
  })

  it('should validate New store OS grid reference number - New store OS grid reference number must be a letter combination for England', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/grid-reference`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { 
        existingGridReference: 'SP1234567890', 
        newGridReference: 'AB1234567890',
        crumb: crumbToken 
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('The new store store OS grid reference number must be a letter combination for England')
  })

  it('store user response and redirect to planning-permission-summary: /planning-permission-summary', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/grid-reference`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { 
        existingGridReference: 'SP1234567890', 
        newGridReference: 'SK1234567890',
        crumb: crumbToken 
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('planning-permission-summary')
  })
})
