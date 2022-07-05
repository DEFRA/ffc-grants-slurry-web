jest.mock('applicationinsights', () => {
  const original = jest.requireActual('applicationinsights')
  return {
    ...original,
    setup: jest.fn(() => ({ start: jest.fn() })),
    defaultClient: {
      context: {
        keys: { cloudRole: 'mock_cloudrole' },
        tags: {}
      },
      trackException: jest.fn((item) => null)
    }
  }
})

jest.mock('../../../../app/config/server', () => {
  const original = jest.requireActual('../../../../app/config/server')
  return {
    ...original,
    appInsights: {
      role: 'mock_role',
      key: 'mock_key'
    }
  }
})

const appInsights = require('applicationinsights')
const config = require('../../../../app/config/server')
const { setup, logException } = require('../../../../app/services/app-insights')

describe('App Insights', () => {
  test('setup', () => {
    const mockAppInsights = jest.mock('applicationinsights').fn(() => ({
      defaultClient: {
        context: {
          keys: {
          cloudRole: 'MOCK_CLOUDROLE'
          },
          tags: {}
        }
      },
      setup: jest.fn(() => ({ start: jest.mock().fn() }))
    }))

    const mockConfig = jest.mock('../../../../app/config/server').fn(() => ({
      appInsights: {
        key: 'MOCK_KEY',
        role: 'MOCK_ROLE'
      }
    }))

    const appInsights = mockAppInsights()
    const config = mockConfig()

    require('../../../../app/services/app-insights').setup()

    expect(appInsights).toBeDefined()
    expect(config).toBeDefined()
    expect(appInsights.setup).toBeDefined()
    expect(appInsights.setup().start).toBeDefined()
    expect(appInsights.defaultClient.context.keys.cloudRole).toBe('MOCK_CLOUDROLE')
    expect(config.appInsights.key).toBe('MOCK_KEY')
    expect(config.appInsights.role).toBe('MOCK_ROLE')

    mockAppInsights.mockRestore()
    mockConfig.mockRestore()
  })
})
