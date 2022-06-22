describe('App Insights', () => {
    test('setup', () => {
      let mockAppInsights = jest.mock('applicationinsights').fn(() => ({
        defaultClient: {
					context: {
						keys: {
          		cloudRole: 'MOCK_CLOUDROLE',
						},
						tags: {}
					}
				},
				setup: jest.fn(() => ({ start: jest.mock().fn() }))
      }))

			let mockConfig = jest.mock('../../../../app/config/server').fn(() => ({
				appInsights: {
					key: 'MOCK_KEY',
					role: 'MOCK_ROLE'
				}
			}))

			let appInsights = mockAppInsights()
			let config = mockConfig()

      expect(require('../../../../app/services/app-insights').setup).toBeDefined()
			require('../../../../app/services/app-insights').setup()

			expect(appInsights).toBeDefined()
			expect(config).toBeDefined()
			expect(appInsights.setup).toBeDefined()
			expect(appInsights.setup().start).toBeDefined()
			expect (appInsights.defaultClient.context.keys.cloudRole).toBe('MOCK_CLOUDROLE')
			expect (config.appInsights.key).toBe('MOCK_KEY')
			expect (config.appInsights.role).toBe('MOCK_ROLE')

			mockAppInsights.mockRestore()
			mockConfig.mockRestore()

    })

    test('logException', () => {
			expect(require('../../../../app/services/app-insights').logException).toBeDefined()
    })
})
  