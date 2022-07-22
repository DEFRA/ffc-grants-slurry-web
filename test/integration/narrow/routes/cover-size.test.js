const { crumbToken } = require('./test-helper')

describe('Page: /serviceable-capacity-increase-additional', () => {
const varList = { inEngland: 'randomData' }

jest.mock('../../../../app/helpers/session', () => ({
    setYarValue: (request, key, value) => null,
    getYarValue: (request, key) => {
    if (varList[key]) return varList[key]
    else return 'Error'
    }
}))

it('page loads successfully, with heading ', async () => {
    const options = {
    method: 'GET',
    url: `${global.__URLPREFIX__}/cover-size`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('How big will the cover be?')
})

it('no option selected -> show error message', async () => {
    const postOptions = {
    method: 'POST',
    url: `${global.__URLPREFIX__}/cover-size`,
    headers: { cookie: 'crumb=' + crumbToken },
    payload: { coverSize: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter the size of cover')
})

it('value outside min and max -> show error message', async () => {
    const postOptions = {
    method: 'POST',
    url: `${global.__URLPREFIX__}/cover-size`,
    headers: { cookie: 'crumb=' + crumbToken },
    payload: { coverSize: '10123456789', crumb: crumbToken }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Volume must be between 1-9999999999')
})

it('If decimals used', async () => {
    const postOptions = {
    method: 'POST',
    url: `${global.__URLPREFIX__}/cover-size`,
    headers: { cookie: 'crumb=' + crumbToken },
    payload: { coverSize: '129,232', crumb: crumbToken }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Volume must be a whole number')
})

it('user enter valid value', async () => {
    const postOptions = {
    method: 'POST',
    url: `${global.__URLPREFIX__}/cover-size`,
    headers: { cookie: 'crumb=' + crumbToken },
    payload: { coverSize: '12345', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('other-items')
})

it('page loads with correct back link', async () => {
    const options = {
    method: 'GET',
    url: `${global.__URLPREFIX__}/cover-size`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"cover-type\" class=\"govuk-back-link\">Back</a>')
})
})
