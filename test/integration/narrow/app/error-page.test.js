const Hapi = require('@hapi/hapi')
const vision = require('@hapi/vision')

describe('Error Page', () => {
  let mockServer
  const boom = require('@hapi/boom')
  const nunjucks = require('nunjucks')

  beforeEach(async () => {
    mockServer = Hapi.server({
      port: 4000
    })
    await mockServer.register(require('../../../../app/plugins/error-pages'))
    mockServer.route([{
      method: 'GET',
      path: '/',
      handler: (request, h) => {
        throw boom.forbidden()
      }
    }])

    await mockServer.register(vision)

    mockServer.views({
      engines: {
        njk: {
          compile: (src, options) => {
            const template = nunjucks.compile(src, options.environment)
            return context => template.render(context) // .layout.njk not found, unknown path
          }
        }
     },
      relativeTo: __dirname,
      compileOptions: {
        environment: nunjucks.configure([
          'app/templates',
          'app/assets/dist',
          'node_modules/govuk-frontend/'
        ])
      },
      path: '../../../../app/templates',
      context: {
        assetpath: '../../../../app/assets',
        govukAssetpath: '../../../../app/assets',
        serviceName: 'FFC Grants Service',
        pageTitle: 'FFC Grants Service'
      }
    })

    await mockServer.start()
  })

  afterEach(async () => {
    await mockServer.stop()
  })

  test('should return 404', async () => {
    const options = {
      method: 'GET',
      url: '/slurry-infrastructure/somethingnotavailable'
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(404)
    expect(response.payload).toContain('Page not found')
  })

  test('should return 403', async () => {
    const options = {
      method: 'GET',
      url: '/'
    }

    const response = await mockServer.inject(options)
    expect(response.statusCode).toBe(403)
    expect(response.payload).toContain('Sorry, the requested URL was rejected')
  })

})
