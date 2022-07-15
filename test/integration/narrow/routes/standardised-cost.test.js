const { crumbToken } = require('./test-helper')

jest.mock('../../../../app/messaging/application')
const { getStandardisedCosts } = require('../../../../app/messaging/application')

describe('Standardised Cost test', () => {
    const varList = {  }

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

    test('GET /standardised-cost route returns 200 if costData = success', async () => {
        const options = {
            method: 'GET',
            url: `${global.__URLPREFIX__}/standardised-cost`
        }

        getStandardisedCosts.mockResolvedValue({
            costData: 'success'
        })


        const response = await global.__SERVER__.inject(options)
        expect(response.statusCode).toBe(200)
    })
    
    test('GET /standardised-cost route returns 500 if costData =/= success', async () => {
        const options = {
            method: 'GET',
            url: `${global.__URLPREFIX__}/standardised-cost`
        }

        getStandardisedCosts.mockResolvedValue({
            costData: 'fail'
        })

        const response = await global.__SERVER__.inject(options)
        expect(response.statusCode).toBe(200)
    })

    test('GET /standardised-cost route causes error page', async () => {
        const options = {
            method: 'GET',
            url: `${global.__URLPREFIX__}/standardised-cost`
        }

        getStandardisedCosts.mockRejectedValue('hello')

        const response = await global.__SERVER__.inject(options)
        expect(response.statusCode).toBe(200)
    })

    test('POST /standardised-cost route returns next page', async () => {
        const options = {
            method: 'POST',
            url: `${global.__URLPREFIX__}/standardised-cost`,
            headers: { cookie: 'crumb=' + crumbToken },
            payload: { applying: '', crumb: crumbToken }
        }

        const response = await global.__SERVER__.inject(options)
        expect(response.statusCode).toBe(302)
    })

})
