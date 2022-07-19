const { crumbToken } = require('./test-helper')

// jest.mock('../../../../app/helpers/standardised-cost-array')
// const { formatAnswerArray } = require('../../../../app/helpers/standardised-cost-array')

// const standardisedCostArray = require('../../../../app/helpers/standardised-cost-array')

describe('Storage Type test', () => {
    const varList = {}

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

    test('GET /storage-type route returns 200', async () => {
        const options = {
            method: 'GET',
            url: `${global.__URLPREFIX__}/storage-type`
        }

        // formatAnswerArray.mockReturnValue([
        //     {
        //         value: 'test-answers-A1',
        //         text: 'Above-ground steel tank',
        //         hint: {
        //             text: 'Grant amount: £22 per cubic metre'
        //         }
        //     },
        //     {
        //         value: 'test-answers-A2',
        //         text: 'Above-ground concrete tank',
        //         hint: {
        //             text: 'Grant amount: £17 per cubic metre'
        //         }
        //     },
        //     {
        //         value: 'test-answers-A3',
        //         text: 'Below-ground in-situ cast-reinforced concrete tank',
        //         hint: {
        //             text: 'Grant amount: £15 per cubic metre'
        //         }
        //     },
        //     {
        //         value: 'test-answers-A4',
        //         text: 'Earth-bank lagoon (unlined)',
        //         hint: {
        //             text: 'Grant amount: £8 per cubic metre'
        //         }
        //     },
        //     {
        //         value: 'test-answers-A5',
        //         text: 'Earth-bank lagoon (lined)',
        //         hint: {
        //             text: 'Grant amount: £12 per cubic metre'
        //         }
        //     },
        //     {
        //         value: 'test-answers-A6',
        //         text: 'Stores using pre-cast rectangular concrete panels',
        //         hint: {
        //             text: 'Grant amount: £14 per cubic metre'
        //         }
        //     },
        //     {
        //         value: 'test-answers-A7',
        //         text: 'Large-volume supported slurry bag',
        //         hint: {
        //             text: 'Grant amount: £20 per cubic metre'
        //         }
        //     },
        //     {
        //         value: 'test-answers-A8',
        //         text: 'Slatted-floor stores',
        //         hint: {
        //             text: 'Grant amount: £14 per cubic metre'
        //         }
        //     }
        // ])
        
        const response = await global.__SERVER__.inject(options)
        expect(response.statusCode).toBe(200)
    })

    test('POST /storage-type route returns next page', async () => {
        const options = {
            method: 'POST',
            url: `${global.__URLPREFIX__}/planning-permission`,
            headers: { cookie: 'crumb=' + crumbToken },
            payload: { applying: '', crumb: crumbToken }
        }

        const response = await global.__SERVER__.inject(options)
        expect(response.statusCode).toBe(200)
    })
})
