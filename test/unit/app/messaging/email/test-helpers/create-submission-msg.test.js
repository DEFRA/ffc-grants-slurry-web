const agentSubmission = require('./submission-agent.json')
const farmerSubmission = require('./submission-farmer.json')
const desirabilityScore = require('./desirability-score.json')
const spreadsheetConfig = require('../../../../../../app/messaging/config/spreadsheet')
describe('Create submission message', () => {
  const mockPassword = 'mock-pwd'

  jest.mock('./../../../../../../app/messaging/config/email', () => ({
    notifyTemplate: 'mock-template'
  }))
  jest.mock('./../../../../../../app/messaging/config/spreadsheet', () => {
    return {
      hideEmptyRows: true,
      protectEnabled: true,
      sendEmailToRpa: true,
      rpaEmail: 'FTF@rpa.gov.uk',
      protectPassword: mockPassword
    }
  })

  const createMsg = require('../../../../../../app/messaging/email/create-submission-msg')

  beforeEach(() => {
    jest.resetModules()
  })

  test('Farmer submission generates correct message payload', () => {
    const msg = createMsg(farmerSubmission, desirabilityScore)
    console.info('---------MSG DETAILS---------')
    console.table(msg.applicantEmail.details)
    expect(msg).toHaveProperty('agentEmail')
    expect(msg).toHaveProperty('applicantEmail')
    expect(msg).toHaveProperty('rpaEmail')
    expect(msg).toHaveProperty('spreadsheet')
    expect(msg.applicantEmail.emailAddress).toBe(farmerSubmission.farmerDetails.emailAddress)
    // expect(msg.applicantEmail.details.gridReference.existingGridReference).toBe(farmerSubmission.gridReference.existingGridReference.replace(/\s/g, '').toUpperCase())
    expect(msg.rpaEmail.emailAddress).toBe('FTF@rpa.gov.uk')
    expect(msg.agentEmail).toBe(null)
  })

  test('Farmer submission generates message payload without RPA email when config is Flase', () => {
    jest.mock('../../../../../../app/messaging/config/spreadsheet', () => ({
      hideEmptyRows: true,
      protectEnabled: false,
      sendEmailToRpa: false,
      protectPassword: mockPassword
    }))

    farmerSubmission.applicantType = ['Beef (including calf rearing)', 'Dairy (including calf rearing)']

    const msg = createMsg(farmerSubmission, desirabilityScore)
    expect(msg).toHaveProperty('agentEmail')
    expect(msg).toHaveProperty('applicantEmail')
    expect(msg).toHaveProperty('rpaEmail')
    expect(msg).toHaveProperty('spreadsheet')
    // expect(msg).toHaveProperty('gridReference')
    expect(msg.applicantEmail.emailAddress).toBe(farmerSubmission.farmerDetails.emailAddress)
    expect(msg.rpaEmail.emailAddress).toBeFalsy
    expect(msg.agentEmail).toBe(null)
  })
  test('Email part of message should have correct properties', () => {
    farmerSubmission.applicantType = 'Dairy (including calf rearing)'

    const msg = createMsg(farmerSubmission, desirabilityScore)

    expect(msg.applicantEmail).toHaveProperty('notifyTemplate')
    expect(msg.applicantEmail).toHaveProperty('emailAddress')
    expect(msg.applicantEmail).toHaveProperty('details')
    expect(msg.applicantEmail.details).toHaveProperty(
      'firstName', 'lastName', 'referenceNumber', 'overallRating', 'legalStatus',
      'location', 'landOwnership', 'tenancyAgreement', 'project',
      'technology', 'itemsCost', 'potentialFunding', 'remainingCost',
      'projectStarted', 'planningPermission', 'projectName', 'businessName',
      'farmerName', 'farmerSurname', 'agentName', 'agentSurname', 'farmerEmail', 'agentEmail',
      'contactConsent', 'scoreDate', 'introducingInnovation', 'sustainableMaterials', 'environmentalImpact',
      'permanentSickPen', 'moistureControl', 'calfGroupSize', 'housing', 'calvingSystem', 'calvesNumber',
      'housingScore', 'calfGroupSizeScore', 'moistureControlScore', 'permanentSickPenScore', 'structureEligibility',
      'environmentalImpactScore', 'sustainableMaterialsScore', 'introducingInnovationScore',
      'projectCost', 'roofSolarPV', 'additionalItems', 'drainageSlope', 'structure', 'enrichment',
      'concreteFlooring', 'strawBedding', 'isolateCalves', 'housedIndividually', 'minimumFloorArea', 'intensiveFarming',
      'projectResponsibility', 'applyingFor', 'projectType', 'impermeableCover', 'storageType', 'estimatedVolumeToSixMonths',
      'estimatedVolumeToEightMonths', 'grantFundedStoreCoverType', 'existingStoreCoverType', 'grantFundedCoverSize', 'existingStoreCoverSize',
      'slurrySeparator', 'separatorType', 'gantry', 'solidFractionStorage', 'concreteBunkerSize'
    )
  })
  test('Under 10 employees results in micro business definition', () => {
    farmerSubmission.businessDetails.numberEmployees = 1
    farmerSubmission.businessDetails.businessTurnover = 1
    const msg = createMsg(farmerSubmission, desirabilityScore)

    expect(msg.spreadsheet.worksheets[0].rows.find(r => r.row === 20).values[2]).toBe('Micro')
  })

  test('Under 50 employees results in small business definition', () => {
    farmerSubmission.businessDetails.numberEmployees = 10
    farmerSubmission.businessDetails.businessTurnover = 1
    const msg = createMsg(farmerSubmission, desirabilityScore)

    expect(msg.spreadsheet.worksheets[0].rows.find(r => r.row === 20).values[2]).toBe('Small')
  })

  test('Under 250 employees results in medium business definition', () => {
    farmerSubmission.businessDetails.numberEmployees = 50
    farmerSubmission.businessDetails.businessTurnover = 1
    const msg = createMsg(farmerSubmission, desirabilityScore)

    expect(msg.spreadsheet.worksheets[0].rows.find(r => r.row === 20).values[2]).toBe('Medium')
  })

  test('Over 250 employees results in large business definition', () => {
    farmerSubmission.businessDetails.numberEmployees = 250
    farmerSubmission.businessDetails.businessTurnover = 1
    const msg = createMsg(farmerSubmission, desirabilityScore)

    expect(msg.spreadsheet.worksheets[0].rows.find(r => r.row === 20).values[2]).toBe('Large')
  })

  test('Agent submission generates correct message payload', () => {
    jest.mock('../../../../../../app/messaging/config/spreadsheet', () => ({
      hideEmptyRows: true,
      protectEnabled: true,
      sendEmailToRpa: true,
      protectPassword: mockPassword
    }))
    const msg = createMsg(agentSubmission, desirabilityScore)

    expect(msg).toHaveProperty('agentEmail')
    expect(msg).toHaveProperty('applicantEmail')
    expect(msg).toHaveProperty('rpaEmail')
    expect(msg).toHaveProperty('spreadsheet')
    expect(msg.agentEmail.emailAddress).toBe(agentSubmission.agentsDetails.emailAddress)
    expect(msg.applicantEmail.emailAddress).toBe(agentSubmission.farmerDetails.emailAddress)
    expect(msg.rpaEmail.emailAddress).toBe('FTF@rpa.gov.uk')
  })

  test('Spreadsheet part of message should have correct properties', () => {
    agentSubmission.environmentalImpact = 'None of the above'
    const msg = createMsg(agentSubmission, desirabilityScore)

    expect(msg.spreadsheet).toHaveProperty('filename')
    expect(msg.spreadsheet).toHaveProperty('uploadLocation')
    expect(msg.spreadsheet).toHaveProperty('worksheets')
    expect(msg.spreadsheet.worksheets.length).toBe(1)
    expect(msg.spreadsheet.worksheets[0]).toHaveProperty('title')
    expect(msg.spreadsheet.worksheets[0]).toHaveProperty('hideEmptyRows')
    expect(msg.spreadsheet.worksheets[0]).toHaveProperty('defaultColumnWidth')
    expect(msg.spreadsheet.worksheets[0]).toHaveProperty('protectPassword')
    expect(msg.spreadsheet.worksheets[0]).toHaveProperty('rows')
    expect(msg.spreadsheet.worksheets[0].rows.length).toBe(76)
    expect(msg.spreadsheet.worksheets[0].rows).toEqual(expect.arrayContaining(
      [
        {row: 1, values: expect.arrayContaining(['Field Name', 'Field Value', '']), bold: true},
        {row: 2, values: expect.arrayContaining(['FA or OA', 'Outline Application', '']), bold: false},
        {row: 40, values: expect.arrayContaining(['Scheme', 'Farming Transformation Fund', '']), bold: false},
        {row: 39, values: expect.arrayContaining(['Sub scheme', 'FTF-Slurry Infrastructure Round 3', '']), bold: false},
        {row: 43, values: expect.arrayContaining(['Theme', 'Slurry Infrastructure Grants', '']), bold: false},
        {row: 90, values: expect.arrayContaining(['Project type', 'Slurry Store and Cover', '']), bold: false},
        {row: 41, values: expect.arrayContaining(['Owner', 'RD', '']), bold: false},
        {row: 53, values: expect.arrayContaining(['Business type', `${agentSubmission.applicantType} Farmer`, '']), bold: false},
        {row: 341, values: expect.arrayContaining(['Grant Launch Date', `${new Date('2024-07-11').toLocaleDateString('en-GB')}`, '']), bold: false},
        {row: 23, values: expect.arrayContaining(['Status of applicant', `${agentSubmission.legalStatus}`, '']), bold: false},
        {row: 44, values: expect.arrayContaining(['Project Items', '||Fixed flexible cover~22||', '']), bold: false},
        {row: 45, values: expect.arrayContaining(['Location of project (postcode)', `${agentSubmission.farmerDetails.postcode}`, '']), bold: false},
        {row: 376, values: expect.arrayContaining(['Project Started', `${agentSubmission.projectStart}`, '']), bold: false},
        {row: 342, values: expect.arrayContaining(['Land owned by Farm', `${agentSubmission.tenancy}`, '']), bold: false},
        {row: 343, values: expect.arrayContaining(['Tenancy for next 5 years', '', '']), bold: false},
        {row: 395, values: expect.arrayContaining(['System Type', `${agentSubmission.systemType}`, '']), bold: false},

        //slurry journey details
        {row: 396, values: expect.arrayContaining(['Existing Storage Capacity', `${agentSubmission.existingStorageCapacity}`, '']), bold: false},
        {row: 397, values: expect.arrayContaining(['Planned Storage Capacity', `${agentSubmission.plannedStorageCapacity}`, '']), bold: false},
        {row: 398, values: expect.arrayContaining(['Slurry Storage Improvement Method', `${agentSubmission.projectType}`, '']), bold: false},
        {row: 399, values: expect.arrayContaining(['Impermeable Cover', 'No grant funded cover selected', '']), bold: false},
        {row: 55, values: expect.arrayContaining(['Total project expenditure', '100000.00' , '']), bold: false},

        {row: 57, values: expect.arrayContaining(['Grant rate', '50' , '']), bold: false},
        {row: 56, values: expect.arrayContaining(['Grant amount requested', agentSubmission.calculatedGrant , '']), bold: false},
        {row: 345, values: expect.arrayContaining(['Remaining Cost to Farmer', agentSubmission.remainingCost , '']), bold: false},
        {row: 346, values: expect.arrayContaining(['Planning Permission Status', 'Not Needed' , '']), bold: false},
        {row: 400, values: expect.arrayContaining(['Planning Authority', '' , '']), bold: false},
        {row: 401, values: expect.arrayContaining(['Planning Reference No', '' , '']), bold: false},
        {row: 402, values: expect.arrayContaining(['Existing store OS grid reference', agentSubmission.gridReference.existingGridReference , '']), bold: false},
        {row: 521, values: expect.arrayContaining(['New store OS grid reference', agentSubmission.gridReference.newGridReference , '']), bold: false},
        {row: 366, values: expect.arrayContaining(['Date of OA decision', '' , '']), bold: false},
        {row: 42, values: expect.arrayContaining(['Project name', agentSubmission.businessDetails.projectName , '']), bold: false},
        {row: 4, values: expect.arrayContaining(['Single business identifier (SBI)', '000000000' , '']), bold: false},
        {row: 7, values: expect.arrayContaining(['Business name', agentSubmission.businessDetails.businessName, '']), bold: false},
        {row: 367, values: expect.arrayContaining(['Annual Turnover', agentSubmission.businessDetails.businessTurnover, '']), bold: false},
        {row: 22, values: expect.arrayContaining(['Employees', agentSubmission.businessDetails.numberEmployees, '']), bold: false},
        {row: 20, values: expect.arrayContaining(['Business size', 'Small', '']), bold: false},
        {row: 91, values: expect.arrayContaining(['Are you an AGENT applying on behalf of your customer', 'Yes', '']), bold: false},
        {row: 5, values: expect.arrayContaining(['Surname', agentSubmission.farmerDetails.lastName, '']), bold: false},
        {row: 6, values: expect.arrayContaining(['Forename', agentSubmission.farmerDetails.firstName, '']), bold: false},
        {row: 8, values: expect.arrayContaining(['Address line 1', agentSubmission.farmerDetails.address1, '']), bold: false},
        {row: 9, values: expect.arrayContaining(['Address line 2', agentSubmission.farmerDetails.address2, '']), bold: false},
        {row: 10, values: expect.arrayContaining(['Address line 3', '', '']), bold: false},
        {row: 11, values: expect.arrayContaining(['Address line 4 (town)', agentSubmission.farmerDetails.town, '']), bold: false},
        {row: 12, values: expect.arrayContaining(['Address line 5 (county)', agentSubmission.farmerDetails.county, '']), bold: false},
        {row: 13, values: expect.arrayContaining(['Postcode (use capitals)', agentSubmission.farmerDetails.postcode, '']), bold: false},

        // applicant numbers

        {row: 16, values: expect.arrayContaining(['Landline number', agentSubmission.farmerDetails.landlineNumber, '']), bold: false},
        {row: 17, values: expect.arrayContaining(['Mobile number', agentSubmission.farmerDetails.mobileNumber, '']), bold: false},
        {row: 18, values: expect.arrayContaining(['Email', agentSubmission.farmerDetails.emailAddress, '']), bold: false},
        {row: 89, values: expect.arrayContaining(['Customer Marketing Indicator', 'No', '']), bold: false},
        {row: 368, values: expect.arrayContaining(['Date ready for QC or decision', new Date().toLocaleDateString('en-GB'), '']), bold: false},
        {row: 369, values: expect.arrayContaining(['Eligibility Reference No.', agentSubmission.confirmationId, '']), bold: false},
        {row: 94, values: expect.arrayContaining(['Current location of file', 'NA Automated', '']), bold: false},
        {row: 92, values: expect.arrayContaining(['RAG rating', 'Green', '']), bold: false},
        {row: 93, values: expect.arrayContaining(['RAG date reviewed ', new Date().toLocaleDateString('en-GB'), '']), bold: false},
        {row: 54, values: expect.arrayContaining(['Electronic OA received date ', new Date().toLocaleDateString('en-GB'), '']), bold: false},
        {row: 370, values: expect.arrayContaining(['Status', 'Pending RPA review', '']), bold: false},
        {row: 85, values: expect.arrayContaining(['Full Application Submission Date', (new Date('2026-03-31')).toLocaleDateString('en-GB'), '']), bold: false},
        {row: 375, values: expect.arrayContaining(['OA percent', 0, '']), bold: false},
        {row: 365, values: expect.arrayContaining(['OA score', 0, '']), bold: false},
        {row: 463, values: expect.arrayContaining(['Environmental permit', 'Yes', '']), bold: false},
        {row: 464, values: expect.arrayContaining(['Project Responsibility', 'N/A', '']), bold: false},
        {row: 465, values: expect.arrayContaining(['Applying for', 'An impermeable cover only', '']), bold: false},
        {row: 466, values: expect.arrayContaining(['Fit for purpose', agentSubmission.fitForPurpose, '']), bold: false},
        {row: 467, values: expect.arrayContaining(['Existing Store Cover', 'N/A', '']), bold: false},
        
        // agent details
        {row: 26, values: expect.arrayContaining(['Agent Surname', agentSubmission.agentsDetails.lastName, '']), bold: false},
        {row: 27, values: expect.arrayContaining(['Agent Forename', agentSubmission.agentsDetails.firstName, '']), bold: false},
        {row: 29, values: expect.arrayContaining(['Agent Address line 1', agentSubmission.agentsDetails.address1, '']), bold: false},
        {row: 30, values: expect.arrayContaining(['Agent Address line 2', agentSubmission.agentsDetails.address2, '']), bold: false},
        {row: 31, values: expect.arrayContaining(['Agent Address line 3', '', '']), bold: false},
        {row: 32, values: expect.arrayContaining(['Agent Address line 4 (town)', '', '']), bold: false},
        {row: 33, values: expect.arrayContaining(['Agent Address line 5 (County)', agentSubmission.agentsDetails.county, '']), bold: false},
        {row: 34, values: expect.arrayContaining(['Agent Postcode (use capitals)', agentSubmission.agentsDetails.postcode, '']), bold: false},
        {row: 35, values: expect.arrayContaining(['Agent Landline number', agentSubmission.agentsDetails.landlineNumber, '']), bold: false},
        {row: 36, values: expect.arrayContaining(['Agent Mobile number', agentSubmission.agentsDetails.mobileNumber, '']), bold: false},
        {row: 37, values: expect.arrayContaining(['Agent Email', agentSubmission.agentsDetails.emailAddress, '']), bold: false},
        {row: 28, values: expect.arrayContaining(['Agent Business Name', agentSubmission.agentsDetails.businessName, '']), bold: false},
      ]
    ))
  })

  test('Protect password property should not be set if config is false', () => {
    jest.mock('../../../../../../app/messaging/config/spreadsheet', () => ({
      hideEmptyRows: true,
      protectEnabled: false,
      sendEmailToRpa: false,
      protectPassword: mockPassword
    }))
    const createSubmissionMsg = require('../../../../../../app/messaging/email/create-submission-msg')
    const msg = createSubmissionMsg(agentSubmission, desirabilityScore)
    expect(msg.spreadsheet.worksheets[0]).not.toHaveProperty('protectPassword')
  })
})
