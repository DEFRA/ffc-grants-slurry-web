const scoreDataAddingValue = require('../../../data/score-data')

describe('Score page', () => {
  let crumCookie
  let server
  const { getCookieHeader, getCrumbCookie, crumbToken } = require('./test-helper')
  const createServer = require('../../../../app/server')
  const Wreck = require('@hapi/wreck')
  const senders = require('../../../../app/messaging/senders')
  const createMsg = require('../../../../app/messaging/create-msg')
  const varList = {
    environmentalImpact: ['randomData']
  }

  jest.mock('../../../../app/helpers/session', () => ({
    setYarValue: (request, key, value) => null,
    getYarValue: (request, key) => {
      // console.log(key, 'key')
      if (Object.keys(varList).includes(key)) return varList[key]
      else return 'Error'
    }
  }))

  beforeEach(async () => {
    global.__SERVER__.stop()
    jest.mock('../../../../app/messaging')
    jest.mock('../../../../app/messaging/senders')
    jest.mock('ffc-messaging')
    senders.sendProjectDetails = jest.fn(async function (message, id) {
      return null
    })
    createMsg.getDesirabilityAnswers = jest.fn((request) => {
      return ''
    })

    server = await createServer()
    await server.start()
  })

  it('score cannot get desirability answers --> load page with error', async () => {
    jest.mock('@hapi/wreck')
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/score`,
      headers: {
        referer: `${global.__URLPREFIX__}/environmental-impact`
      }
    }
    createMsg.getDesirabilityAnswers = jest.fn((request) => {
      return null
    })
    const wreckResponse = {
      payload: null,
      res: {
        statusCode: 202
      }
    }
    Wreck.get = jest.fn(async function (url, type) {
      return wreckResponse
    })
    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(2)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
  })

  it('score not received after polling scroing service --> load page with error', async () => {
    jest.mock('@hapi/wreck')
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/score`,
      headers: {
        referer: `${global.__URLPREFIX__}/environmental-impact`
      }
    }
    const wreckResponse = {
      payload: null,
      res: {
        statusCode: 202
      }
    }
    Wreck.get = jest.fn(async function (url, type) {
      return wreckResponse
    })
    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(2)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
  })

  it('unhandled response from scoring service --> load page with error', async () => {
    jest.mock('@hapi/wreck')
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/score`,
      headers: {
        referer: `${global.__URLPREFIX__}/environmental-impact`
      }
    }
    const wreckResponse = {
      payload: null,
      res: {
        statusCode: 500
      }
    }
    Wreck.get = jest.fn(async function (url, type) {
      return wreckResponse
    })
    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(2)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
  })

  it('wrong response from scoring service --> load page with error', async () => {
    jest.mock('@hapi/wreck')
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/score`,
      headers: {
        referer: `${global.__URLPREFIX__}/environmental-impact`
      }
    }
    const wreckResponse = {
      payload: { desirability: null },
      res: {
        statusCode: 500
      }
    }
    Wreck.get = jest.fn(async function (url, type) {
      return wreckResponse
    })
    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(2)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
  })

  it('cannot connect scoring service --> load page with error', async () => {
    jest.mock('@hapi/wreck')
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/score`,
      headers: {
        referer: `${global.__URLPREFIX__}/environmental-impact`
      }
    }
    Wreck.get = jest.fn(async function (url, type) {
      throw new Error('can\'t reach')
    })
    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(2)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
  })

  it('getScore returns null --> load page with error', async () => {
    jest.mock('@hapi/wreck')
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/score`,
      headers: {
        referer: `${global.__URLPREFIX__}/environmental-impact`
      }
    }
    Wreck.get = jest.fn(async function (url, type) {
      return null
    })
    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(2)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
  })

  it('load page successfully => Score: \'Weak\'', async () => {
    jest.mock('@hapi/wreck')
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/score`,
      headers: {
        referer: `${global.__URLPREFIX__}/environmental-impact`
      }
    }
    const wreckResponse = {
      payload: scoreDataAddingValue,
      res: {
        statusCode: 200
      }
    }
    Wreck.get = jest.fn(async function (url, type) {
      return wreckResponse
    })
    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(2)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
    const responseScoreMessage = 'This means your project seems unlikely to be successful.'

    expect(response.payload).toContain('Scoring results')
    expect(response.payload).toContain(responseScoreMessage)
  })

  it('load page successfully => Score: \'Average\'', async () => {
    jest.mock('@hapi/wreck')
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/score`,
      headers: {
        referer: `${global.__URLPREFIX__}/environmental-impact`
      }
    }
    scoreDataAddingValue.desirability.overallRating.band = 'Average'
    const wreckResponse = {
      payload: scoreDataAddingValue,
      res: {
        statusCode: 200
      }
    }
    Wreck.get = jest.fn(async function (url, type) {
      return wreckResponse
    })
    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(2)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
    const responseScoreMessage = 'This means your project might be successful.'

    expect(response.payload).toContain('Scoring results')
    expect(response.payload).toContain(responseScoreMessage)
  })

  it('load page successfully => Score: \'Strong\'', async () => {
    jest.mock('@hapi/wreck')
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/score`,
      headers: {
        referer: `${global.__URLPREFIX__}/environmental-impact`
      }
    }
    scoreDataAddingValue.desirability.overallRating.band = 'Strong'
    const wreckResponse = {
      payload: scoreDataAddingValue,
      res: {
        statusCode: 200
      }
    }
    Wreck.get = jest.fn(async function (url, type) {
      return wreckResponse
    })
    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(2)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
    const responseScoreMessage = 'This means your project seems likely to be successful.'

    expect(response.payload).toContain('Scoring results')
    expect(response.payload).toContain(responseScoreMessage)
  })

  it('redirect to /business-details', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/score`,
      payload: { crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe(`${global.__URLPREFIX__}/business-details`)
  })

  afterEach(async () => {
    await server.stop()
  })
})
