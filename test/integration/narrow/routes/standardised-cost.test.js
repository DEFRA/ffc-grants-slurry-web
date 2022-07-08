const { crumbToken } = require('./test-helper')

jest.mock('../../../../app/messaging/application')
const { getStandardisedCosts } = require('../../../../app/messaging/application')

describe('Standardised Cost test', () => {
    const varList = {  }

    jest.mock('../../../../app/helpers/session', () => ({
        setYarValue: (request, key, value) => null,
        getYarValue: (request, key) => {
            if (varList[key]) return varList[key]
            else return 'Error'
        }
    }))

    test('GET /standardised-cost route returns 200', async () => {
        const options = {
            method: 'GET',
            url: `${global.__URLPREFIX__}/standardised-cost`
        }

        // getStandardisedCosts.mockResolvedValue({})

        const response = await global.__SERVER__.inject(options)
        expect(response.statusCode).toBe(200)
    })
})
