describe('Page Helpers', () => {
  jest.mock('../../../../app/helpers/session')
  const { getYarValue, setYarValue } = require('../../../../app/helpers/session')

  const {
    handleConditinalHtmlData,
    getCheckDetailsModel,
    getEvidenceSummaryModel
  } = require('../../../../app/helpers/pageHelpers')

  test('check handleConditinalHtmlData()', () => {
    let result

    getYarValue.mockReturnValue({ sbi: 'mock-sbi-value' })
    result = handleConditinalHtmlData('multi-input', 'mock-label-data', 'mock-yarKey', {})
    expect(result).toContain('<label class="govuk-label" for="sbi">')
    expect(result).toContain('<input class="govuk-input govuk-!-width-one-third" id="sbi" name="sbi" value="mock-sbi-value">')

    getYarValue.mockReturnValue('mock-yarValue')
    result = handleConditinalHtmlData('input', 'mock-label-data', 'mock-yarKey', {})
    expect(result).toContain('<label class="govuk-label" for="mock-yarKey">')
    expect(result).toContain('<input class="govuk-input govuk-!-width-one-third" id="mock-yarKey" name="mock-yarKey" value="mock-yarValue">')
  })

  test('check getCheckDetailsModel()', () => {
    let dict
    getYarValue.mockImplementation((req, key) => (dict[key]))
    setYarValue.mockImplementation((req, key, val) => { dict[key] = val })

    dict = {
      applying: true
    }
    expect(getCheckDetailsModel({}, {}, 'backUrl', 'nextUrl')).toEqual({
      backUrl: 'backUrl',
      nextUrl: 'nextUrl',
      applying: true,
      farmerDetails: {},
      agentDetails: {}
    })

    dict = {
      ...dict,
      farmerDetails: {
        firstName: 'Farmer',
        lastName: 'FLastName',
        emailAddress: 'farmer-email',
        landlineNumber: 'farmer-landline',
        address1: 'farmer-address1',
        address2: 'farmer-address2',
        town: 'farmer-town',
        county: 'farmer-county',
        postcode: 'farmer-postcode'
      },
      agentsDetails: {
        firstName: 'Agent',
        lastName: 'ALastName',
        emailAddress: 'agent-email',
        landlineNumber: 'agent-landline',
        address1: 'agent-address1',
        address2: 'agent-address2',
        town: 'agent-town',
        county: 'agent-county',
        postcode: 'agent-postcode'
      }
    }
    expect(getCheckDetailsModel({}, {}, 'backUrl', 'nextUrl')).toEqual({
      backUrl: 'backUrl',
      nextUrl: 'nextUrl',
      applying: true,
      farmerDetails: {
        firstName: 'Farmer',
        lastName: 'FLastName',
        emailAddress: 'farmer-email',
        landlineNumber: 'farmer-landline',
        address1: 'farmer-address1',
        address2: 'farmer-address2',
        town: 'farmer-town',
        county: 'farmer-county',
        postcode: 'farmer-postcode',
        name: 'Farmer FLastName',
        contact: 'farmer-email<br/>farmer-landline',
        address: 'farmer-address1<br/>farmer-address2<br/>farmer-town<br/>farmer-county<br/>farmer-postcode'
      },
      agentDetails: {
        firstName: 'Agent',
        lastName: 'ALastName',
        emailAddress: 'agent-email',
        landlineNumber: 'agent-landline',
        address1: 'agent-address1',
        address2: 'agent-address2',
        town: 'agent-town',
        county: 'agent-county',
        postcode: 'agent-postcode',
        name: 'Agent ALastName',
        contact: 'agent-email<br/>agent-landline',
        address: 'agent-address1<br/>agent-address2<br/>agent-town<br/>agent-county<br/>agent-postcode'
      }
    })
  })

  test('check getEvidenceSummaryModel()', () => {
    setYarValue.mockImplementation((req, key, val) => {})

    getYarValue.mockImplementation((req, key) => {
      if (key === 'planningPermission') {
        return ('Not yet')
      } else {
        return ({
          gridReferenceNumber: 'grid-ref-num',
          planningAuthority: 'planning-auth',
          planningReferenceNumber: 'planning-ref-num'
        })
      }
    })
    expect(getEvidenceSummaryModel({}, {}, 'back-url', 'next-url')).toEqual({
      backUrl: 'back-url',
      nextUrl: 'next-url',
      planningPermission: 'Not yet',
      gridReference: 'grid-ref-num'
    })

    getYarValue.mockImplementation((req, key) => {
      if (key === 'planningPermission') {
        return ('Planning-permission')
      } else {
        return ({
          gridReferenceNumber: 'grid-ref-num',
          planningAuthority: 'planning-auth',
          planningReferenceNumber: 'planning-ref-num'
        })
      }
    })
    expect(getEvidenceSummaryModel({}, {}, 'back-url', 'next-url')).toEqual({
      backUrl: 'back-url',
      nextUrl: 'next-url',
      planningPermission: 'Planning-permission',
      gridReference: 'grid-ref-num',
      evidence: {
        planningAuthority: 'planning-auth',
        planningReferenceNumber: 'planning-ref-num'
      }
    })
  })
})
