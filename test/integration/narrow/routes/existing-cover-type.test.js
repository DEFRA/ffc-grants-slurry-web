const { crumbToken } = require('./test-helper')

describe('Existing cover Type test', () => {
const varList = {
    coverType: null,
    applyingFor: null
}

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

test('GET /existing-cover-type route returns 200', async () => {
    const options = {
        method: 'GET',
        url: `${global.__URLPREFIX__}/existing-cover-type`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('What type of cover will you have on your existing store?')
})

it('no option selected -> show error message', async () => {
    const postOptions = {
        method: 'POST',
        url: `${global.__URLPREFIX__}/existing-cover-type`,
        headers: { cookie: 'crumb=' + crumbToken },
        payload: { storageType: '', existingCoverType: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select what type of cover your existing store will have')
})

// test('POST /cover-size route returns next page when existing cover `/Yes/`', async () => {
//     varList.grantFundedCover = "Yes, I already have a cover"
//     varList.existingCover = "Yes"
//     varList.serviceCapacityIncrease = "22"
//     varList.coverType = null

//     const options = {
//         method: 'GET',
//         url: `${global.__URLPREFIX__}/existing-cover-type`
//     }

//     const response = await global.__SERVER__.inject(options)

//     const postOptions = {
//         method: 'POST',
//         url: `${global.__URLPREFIX__}/existing-cover-type`,
//         headers: { cookie: 'crumb=' + crumbToken },
//         payload: { existingCoverType: 'fake data', crumb: crumbToken }
//     }
//     console.log("sds", varList.coverType )
//     const postResponse = await global.__SERVER__.inject(postOptions)
//     expect(postResponse.statusCode).toBe(302)
//     expect(postResponse.headers.location).toBe('existing-cover-size')
// })

// test('POST /existing-grant-funded-cover-size route returns next page when coverType `/Fixed flexible cover/`', async () => {
//     varList.coverType = "Fixed flexible cover"

//     const options = {
//         method: 'GET',
//         url: `${global.__URLPREFIX__}/existing-cover-type`
//     }

//     const response = await global.__SERVER__.inject(options)

//     const postOptions = {
//         method: 'POST',
//         url: `${global.__URLPREFIX__}/existing-cover-type`,
//         headers: { cookie: 'crumb=' + crumbToken },
//         payload: { existingCoverType: 'fake data', crumb: crumbToken }
//     }

//     const postResponse = await global.__SERVER__.inject(postOptions)
//     expect(postResponse.statusCode).toBe(302)
//     expect(postResponse.headers.location).toBe('existing-grant-funded-cover-size')
// })

// test('POST /existing-grant-funded-cover-size route returns next page when coverType `/Floating flexible cover/`', async () => {
//     varList.coverType = "Floating flexible cover"

//     const options = {
//         method: 'GET',
//         url: `${global.__URLPREFIX__}/existing-cover-type`
//     }

//     const response = await global.__SERVER__.inject(options)

//     const postOptions = {
//         method: 'POST',
//         url: `${global.__URLPREFIX__}/existing-cover-type`,
//         headers: { cookie: 'crumb=' + crumbToken },
//         payload: { existingCoverType: 'fake data', crumb: crumbToken }
//     }

//     const postResponse = await global.__SERVER__.inject(postOptions)
//     expect(postResponse.statusCode).toBe(302)
//     expect(postResponse.headers.location).toBe('existing-grant-funded-cover-size')
// })

// it('page loads with correct back link', async () => {
//     varList.applyingFor = "An impermeable cover only"

//     const options = {
//         method: 'GET',
//         url: `${global.__URLPREFIX__}/existing-cover-type`
//     }
//     const response = await global.__SERVER__.inject(options)
//     expect(response.statusCode).toBe(200)
//     expect(response.payload).toContain('<a href=\"/slurry-infrastructure/standardised-grant-amounts\" class=\"govuk-back-link\">Back</a>')
// })

// it('page loads with correct back link', async () => {
//     varList.coverType = "Fake data"
//     const options = {
//         method: 'GET',
//         url: `${global.__URLPREFIX__}/existing-cover-type`
//     }
//     const response = await global.__SERVER__.inject(options)
//     expect(response.statusCode).toBe(200)
//     expect(response.payload).toContain('<a href=\"/slurry-infrastructure/cover-type\" class=\"govuk-back-link\">Back</a>')
// })

// it('page loads with correct back link', async () => {
//     varList.projectType = "Replace an existing store that is no longer fit for purpose with a new store"
//     varList.applicantType = "Pig"

//     const optionCoverType = {
//         method: 'GET',
//         url: `${global.__URLPREFIX__}/existing-cover-type`
//     }
//     const responseCoverType = await global.__SERVER__.inject(optionCoverType)
//     expect(responseCoverType.statusCode).toBe(200)
//     expect(responseCoverType.payload).toContain('<a href=\"/slurry-infrastructure/pig-serviceable-capacity-increase-replace\" class=\"govuk-back-link\">Back</a>')
// })
// it('page loads with correct back link', async () => {
//     varList.projectType = "Replace an existing store that is no longer fit for purpose with a new store"
//     varList.applicantType = "Beef"
    // varList.coverType = null
    // varList.applyingFor = null
//     const options = {
//         method: 'GET',
//         url: `${global.__URLPREFIX__}/existing-cover-type`
//     }
//     const response = await global.__SERVER__.inject(options)
//     expect(response.statusCode).toBe(200)
//     expect(response.payload).toContain('<a href=\"/slurry-infrastructure/serviceable-capacity-increase-replace\" class=\"govuk-back-link\">Back</a>')
// })
// it('page loads with correct back link', async () => {
//     varList.projectType = "Add a new store to increase existing capacity"
//     varList.applicantType = "Pig"
//     const options = {
//         method: 'GET',
//         url: `${global.__URLPREFIX__}/existing-cover-type`
//     }
//     const response = await global.__SERVER__.inject(options)
//     expect(response.statusCode).toBe(200)
//     expect(response.payload).toContain('<a href=\"/slurry-infrastructure/pig-serviceable-capacity-increase-additional\" class=\"govuk-back-link\">Back</a>')
// })
// it('page loads with correct back link', async () => {
//     varList.projectType = "Replace an existing store that is no longer fit for purpose with a new store"
//     varList.applicantType = "Beef"
//     const options = {
//         method: 'GET',
//         url: `${global.__URLPREFIX__}/existing-cover-type`
//     }
//     const response = await global.__SERVER__.inject(options)
//     expect(response.statusCode).toBe(200)
//     expect(response.payload).toContain('<a href=\"/slurry-infrastructure/serviceable-capacity-increase-additional\" class=\"govuk-back-link\">Back</a>')
// })
})
