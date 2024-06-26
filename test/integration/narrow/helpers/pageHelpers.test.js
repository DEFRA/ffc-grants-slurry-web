describe('Page Helpers', () => {
  const varList = {
    planningPermission: 'some fake value',
    gridReference: {
      existingGridReference: "SE 123 456",
      newGridReference: "SE 123 456"
  },
    businessDetails: 'fake business',
    applying: true
  }

  jest.mock('../../../../app/helpers/session', () => ({
    setYarValue: (request, key, value) => null,
    getYarValue: (request, key) => {
      if (varList[key]) return varList[key]
      else return null
    }
  }))

  const {
    handleConditinalHtmlData,
    getCheckDetailsModel,
    getEvidenceSummaryModel
  } = require('../../../../app/helpers/pageHelpers')

  test('check getEvidenceSummaryModel() returns the redirect object if planning permission is missing', () => {
    expect(getEvidenceSummaryModel({}, {}, 'back-url', 'next-url')).toEqual({ redirect: true })
  })

  test('check getEvidenceSummaryModel() loads correct value WITH planning permission evidence', () => {
    varList.PlanningPermissionEvidence = {
      planningAuthority: 'planning-auth',
      planningReferenceNumber: 'PLANNING-REF-NUM'
    }

    expect(getEvidenceSummaryModel({}, {}, 'back-url', 'next-url')).toEqual({
      backUrl: 'back-url',
      nextUrl: 'next-url',
      planningPermission: 'some fake value',
      existingGridReference: "SE 123 456",
      newGridReference: "SE 123 456",
      evidence: {
        planningAuthority: 'planning-auth',
        planningReferenceNumber: 'PLANNING-REF-NUM'
      }
    })
  })

  test('check getEvidenceSummaryModel loads correct value with no planning permission evidence', () => {
    varList.planningPermission = 'Not yet applied'

    expect(getEvidenceSummaryModel({}, {}, 'back-url', 'next-url')).toEqual({
      backUrl: 'back-url',
      nextUrl: 'next-url',
      planningPermission: 'Not yet applied',
      existingGridReference: "SE 123 456",
      newGridReference: "SE 123 456"
    })
  })

  test('check handleConditinalHtmlData()', () => {
    let result

    varList.mockYarKey = {
      sbi: 'mock-sbi-value'
    }
    result = handleConditinalHtmlData('multi-input', 'mock-label-data', 'mockYarKey', {})
    expect(result).toContain('<label class="govuk-label" for="sbi">')
    expect(result).toContain('<input class="govuk-input govuk-!-width-one-third" id="sbi" name="sbi" value="mock-sbi-value">')

    varList.mockYarKey = 'mock-yarValue'
    result = handleConditinalHtmlData('input', 'mock-label-data', 'mockYarKey', {})
    expect(result).toContain('<label class="govuk-label" for="mockYarKey">')
    expect(result).toContain('<input class="govuk-input govuk-!-width-one-third" id="mockYarKey" name="mockYarKey" value="mock-yarValue">')
  })

  test('check getCheckDetailsModel() returns correct applying value', () => {
    expect(getCheckDetailsModel({}, {}, 'backUrl', 'nextUrl')).toEqual({
      backUrl: 'backUrl',
      nextUrl: 'nextUrl',
      applying: true,
      businessDetails: 'fake business',
      farmerDetails: {},
      agentDetails: {}
    })
  })

  test('check getCheckDetailsModel() returns correct farmer and agent details', () => {
    varList.farmerDetails = {
      firstName: 'Farmer',
      lastName: 'FLastName',
      emailAddress: 'farmer-email',
      landlineNumber: 'farmer-landline',
      address1: 'farmer-address1',
      address2: 'farmer-address2',
      town: 'farmer-town',
      county: 'farmer-county',
      postcode: 'farmer-postcode'
    }
    varList.agentsDetails = {
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
    expect(getCheckDetailsModel({}, {}, 'backUrl', 'nextUrl')).toEqual({
      backUrl: 'backUrl',
      nextUrl: 'nextUrl',
      businessDetails: 'fake business',
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
})
