const { crumbToken } = require('./test-helper')

const senders = require('../../../../app/messaging/senders')

describe('confirm page', () => {
  const varList = { farmerDetails: 'someValue', contractorsDetails: 'someValue' }

  jest.mock('../../../../app/helpers/session', () => ({
    setYarValue: (request, key, value) => null,
    getYarValue: (request, key) => {
      console.log(key, 'key')
      if (varList[key]) return varList[key]
      else return 'Error'
    }
  }))

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/confirmation`,
      headers: {
        cookie: 'crumb=' + crumbToken,
        referer: 'localhost/check-details'
      }
    }

    jest.spyOn(senders, 'sendDesirabilitySubmitted').mockImplementationOnce(() => Promise.resolve(true))

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Details submitted')
    expect(response.payload).toContain('We have sent you a confirmation email with a record of your answers.')
    expect(response.payload).toContain('If you do not get an email within 72 hours, please call the RPA helpline and follow the options for the Farming Investment Fund scheme:')
    expect(response.payload).toContain('RPA helpline')
    expect(response.payload).toContain('Telephone')
    expect(response.payload).toContain('Telephone: 0300 200 301')
    expect(response.payload).toContain('Monday to Friday, 9am to 5pm (except public holidays)')
    expect(response.payload).toContain('Find out about call charges')
    expect(response.payload).toContain('Email')
    expect(response.payload).toContain('FTF@rpa.gov.uk')
    expect(response.payload).toContain('What happens next')
    expect(response.payload).toContain('RPA will be in touch when the full application period opens to tell you if your project is invited to submit a full application form.')
    expect(response.payload).toContain('If you submit an application, RPA will assess whether it is eligible and meets the rules of the grant.')
    expect(response.payload).toContain('If your application is successful, you’ll be sent a funding agreement and can begin work on the project.')
    expect(response.payload).toContain('You must not start the project')
    expect(response.payload).toContain('Starting the project or committing to any costs (such as placing orders) before you receive a funding agreement will invalidate your application.')
    expect(response.payload).toContain('Before you start the project, you can:')
    expect(response.payload).toContain('get quotes from suppliers')
    expect(response.payload).toContain('apply for planning permission')
    expect(response.payload).toContain('If you farm pigs intensively and need to apply for a variation to your environmental permit, you can get advice from the <a class=\"govuk-link\" href=\"https://www.gov.uk/guidance/get-advice-before-you-apply-for-an-environmental-permit\" target=\"_blank\" rel=\"noopener noreferrer\">Environment Agency’s (EA) pre-application advice service</a> or discuss it with your EA site officer.')
    expect(response.payload).toContain('If you want your landlord to underwrite your project, you will need them to sign a letter of assurance. This letter will say your landlord agrees to take over your project, including conditions in the Grant Funding Agreement, if your tenancy ends. You should discuss and agree this with your landlord before you begin your full application.')
    expect(response.payload).toContain('What do you think of this service?')
  })
})
