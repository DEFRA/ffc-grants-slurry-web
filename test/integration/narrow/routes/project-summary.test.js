const { crumbToken } = require('./test-helper')

describe('Project Summary test', () => {
  const varList = { storageType: 'random', coverType: 'random', otherItems: ['random'], itemSizesQuantities: ['random'] }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  jest.mock('../../../../app/helpers/session', () => ({
    setYarValue: (request, key, value) => null,
    getYarValue: (request, key) => {
      if (varList[key]) return varList[key]
      else return 'Error'
    }
  }))

  test('GET /project-summary route returns 200', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/project-summary`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Your project items')
  })

  test('POST /project-summary route returns next page', async () => {
    const options = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-summary`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { otherItems: 'fake data', crumb: crumbToken }
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('/slurry-infrastructure/potential-amount')
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/project-summary`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"/slurry-infrastructure/item-sizes-quantities\" class=\"govuk-back-link\">Back</a>')
  })
})
