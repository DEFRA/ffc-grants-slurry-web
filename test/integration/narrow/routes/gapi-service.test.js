const appInsights = jest.mock('../../../../app/services/app-insights')
appInsights.logException = jest.fn((req, event) => {
  return null
})

const gapiService = require('../../../../app/services/gapi-service')

const eventSuccess = jest.fn(async (obj) => {
  return null
})

const eventError = jest.fn(async (obj) => {
  throw new Error('Some error')
})

const request = {
  ga: {
    event: eventSuccess
  },
  yar: {
    id: 'Some ID',
    get: jest.fn()
  }
}

const requestError = {
  ga: {
    event: eventError
  },
  yar: {
    id: 'Some ID',
    get: jest.fn()
  }
}

afterEach(() => {
  jest.resetAllMocks()
})

describe('get gapiService setup', () => {
  test('Should be defined', () => {
    expect(gapiService).toBeDefined()
  })

  test('Call sendEvent successfully', async () => {
    const result = await gapiService.sendEvent(request, 'CATEGORY', 'ACTION')
    expect(result).toBe(undefined)
  })

  test('Call sendDimensionOrMetric successfully', async () => {
    let result = await gapiService.sendDimensionOrMetric(request, { dimensionOrMetric: 'cd1', value: 'some value' })
    expect(result).toBe(undefined)

    const item = [
      { dimensionOrMetric: 'cd1', value: 'some value' },
      { dimensionOrMetric: 'cd2', value: 'ITEM' }
    ]
    result = await gapiService.sendDimensionOrMetric(request, item)
    expect(result).toBe(undefined)
  })

  test('Call sendEligibilityEvent successfully', async () => {
    let result = await gapiService.sendEligibilityEvent(request)
    expect(result).toBe(undefined)

    result = await gapiService.sendEligibilityEvent(request, false)
    expect(result).toBe(undefined)
  })

  test('Call sendEvent throw error', async () => {
    let result = await gapiService.sendEvent(requestError, 'CATEGORY', 'ACTION')
    expect(result).toBe(undefined)

    result = await gapiService.sendEvent({}, 'CATEGORY', 'ACTION')
    expect(result).toBe(undefined)
  })

  test('Call sendDimensionOrMetric throw error', async () => {
    const result = await gapiService.sendDimensionOrMetric(requestError, { dimensionOrMetric: 'cd1', value: 'some value' })
    expect(result).toBe(undefined)
  })

  test('Call sendEligibilityEvent throw error', async () => {
    const result = await gapiService.sendEligibilityEvent(requestError)
    expect(result).toBe(undefined)
  })

  test('Call sendJourneyTime', async () => {
    const result = await gapiService.sendJourneyTime(request, '')
    expect(result).toBe(undefined)
  })

  test('Call processGA - no ga', async () => {
    const result = await gapiService.processGA(request)
    expect(result).toBe(undefined)
  })

  test('Call processGA - empty ga', async () => {
    const ga = []
    result = await gapiService.processGA(request, ga)
    expect(result).toBe(undefined)
  })

  // test('Call processGA - populated ga', async () => {
  //   ga = [
  //     { journeyStart: 'mock-journey-start' },
  //     {
  //       dimension: 12,
  //       value: {
  //         type: 'yar',
  //         key: 'key-yar'
  //       }
  //     },
  //     {
  //       dimension: 12,
  //       value: {
  //         type: 'custom',
  //         value: 'value-custom'
  //       }
  //     },
  //     {
  //       dimension: 12,
  //       value: {
  //         type: 'score'
  //       }
  //     },
  //     {
  //       dimension: 12,
  //       value: {
  //         type: 'confirmationId',
  //         key: 'value-confirmationId'
  //       }
  //     },
  //     {
  //       dimension: 12,
  //       value: {
  //         type: 'journey-time'
  //       }
  //     },
  //     {
  //       dimension: 12,
  //       value: {
  //         type: 'mock-switch-default',
  //         value: 'value-mock-switch-default'
  //       }
  //     }
  //   ]

  //   result = await gapiService.processGA(request, ga)

  //   expect(result).toBe(undefined)

  // })
})
