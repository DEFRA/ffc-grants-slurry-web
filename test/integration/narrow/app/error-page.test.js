const Hapi = require('@hapi/hapi')

describe('Error Page', () => {
  let mockServer
  const boom = require('@hapi/boom')
  const nunjucks = require('nunjucks')
  const path = require('path')

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
        //return h.response('ok').code(403)
      }
    }])
    mockServer.views({
      engines: {
        njk: {
          compile: (src, options) => {
            const template = nunjucks.compile(src, options.environment)
            return context => template.render(context)
          }
        }
     },
      relativeTo: __dirname,
      compileOptions: {
        environment: nunjucks.configure([
          path.join(__dirname, 'templates'),
          path.join(__dirname, 'assets', 'dist'),
          'node_modules/govuk-frontend/'
        ])
      },
      path: '../../../../aap/templates',
      context: {
        assetpath: '../../../../aap/assets',
        govukAssetpath: '../../../../aap/assets',
        serviceName: 'FFC Grants Service',
        pageTitle: 'FFC Grants Service'
      }
    })

    await mockServer.start()
  })



  // test('should return 404', async () => {
  //   const options = {
  //     method: 'GET',
  //     url: '/slurry-infrastructure/somethingnotavailable'
  //   }

  //   const response = await global.__SERVER__.inject(options)
  //   expect(response.statusCode).toBe(404)
  //   expect(response.payload).toContain('Page not found')
  // })

  test('should return 403', async () => {
    const options = {
      method: 'GET',
      url: '/'
    }

    const response = await mockServer.inject(options)
    expect(response.statusCode).toBe(403)
    expect(response.payload).toContain('Sorry, the requested URL was rejected')
  })

  //   const apiResponseBody = `{
  //     "status": "Dummy Request sent to API"
  //   }`

//   const https = require('https')
//   jest.mock('https', () => ({
//     ...jest.requireActual('https'), // import and retain the original functionalities
//     request: (postOption, cb) => cb({
//       on: (data, cb) => cb(Buffer.from(apiResponseBody, 'utf8')),
//       statusCode: 200,
//       statusMessage: 'API Success'
//     }),
//     on: jest.fn(),
//     write: jest.fn(),
//     end: jest.fn()
//   }))
})
