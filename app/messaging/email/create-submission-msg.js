const emailConfig = require('../config/email')
const spreadsheetConfig = require('../config/spreadsheet')
const { microTurnover, smallTurnover, mediumTurnover, microEmployeesNum, smallEmployeesNum, mediumEmployeesNum } = require('./business-size-constants')

function generateRow (rowNumber, name, value, bold = false) {
  return {
    row: rowNumber,
    values: ['', name, value],
    bold
  }
}

function calculateBusinessSize (employees, turnover) {
  const employeesNum = Number(employees)
  const turnoverNum = Number(turnover)

  if (employeesNum < microEmployeesNum && turnoverNum < microTurnover) { // €2m turnover
    return 'Micro'
  } else if (employeesNum < smallEmployeesNum && turnoverNum < smallTurnover) { // €10m turnover
    return 'Small'
  } else if (employeesNum < mediumEmployeesNum && turnoverNum < mediumTurnover) { // €50m turnover
    return 'Medium'
  } else {
    return 'Large'
  }
}

function addAgentDetails (agentsDetails) {
  return [
    generateRow(26, 'Agent Surname', agentsDetails?.lastName ?? ''),
    generateRow(27, 'Agent Forename', agentsDetails?.firstName ?? ''),
    generateRow(29, 'Agent Address line 1', agentsDetails?.address1 ?? ''),
    generateRow(30, 'Agent Address line 2', agentsDetails?.address2 ?? ''),
    generateRow(31, 'Agent Address line 3', ''),
    generateRow(32, 'Agent Address line 4 (town)', agentsDetails?.town ?? ''),
    generateRow(33, 'Agent Address line 5 (County)', agentsDetails?.county ?? ''),
    generateRow(34, 'Agent Postcode (use capitals)', agentsDetails?.postcode ?? ''),
    generateRow(35, 'Agent Landline number', agentsDetails?.landlineNumber ?? ''),
    generateRow(36, 'Agent Mobile number', agentsDetails?.mobileNumber ?? ''),
    generateRow(37, 'Agent Email', agentsDetails?.emailAddress ?? ''),
    generateRow(28, 'Agent Business Name', agentsDetails?.businessName ?? '')
  ]
}

function generateExcelFilename (scheme, projectName, businessName, referenceNumber, today) {
  const dateTime = new Intl.DateTimeFormat('en-GB', {
    timeStyle: 'short',
    dateStyle: 'short',
    timeZone: 'Europe/London'
  }).format(today).replace(/\//g, '-')
  return `${scheme}_${projectName}_${businessName}_${referenceNumber}_${dateTime}.xlsx`
}
function getBusinessTypeC53 (businessType) {
  return (typeof businessType === 'string') ? `${businessType} farmer` : 'farmer with livestock'
}

const getPlanningPermissionDoraValue = (planningPermission) => {
  switch (planningPermission) {
    case 'Applied for but not yet approved':
      return 'Applied for'
    case 'Not yet applied for but expected to be in place by 31 December 2023':
      return 'Not yet applied for'
    default:
      return 'Approved'
  }
}

function getProjectItemsFormattedArray (itemSizeQuantities, otherItems, storageType, storageCapacity, coverType, coverSize) {
  const projectItems = []
  if (otherItems[0] !== 'None of the above') {
    let unit
    Object.values(itemSizeQuantities).forEach((itemSizeQuantity, index) => {
      unit = getItemUnit(otherItems[index].toLowerCase())
      projectItems.push(`${otherItems[index]}~${itemSizeQuantity}~${unit}`)
    })
  } else {
    projectItems.push('')
  }

  if (coverType && coverType !== 'Not needed') {
    projectItems.unshift(`${coverType}~${coverSize}`)
  } else {
    projectItems.unshift('')
  }

  projectItems.unshift(`${storageType}~${storageCapacity}`)
  return projectItems.join('|')
}

function getSpreadsheetDetails(submission) {
  const today = new Date()
  const todayStr = today.toLocaleDateString('en-GB')
  const schemeName = 'Slurry Infrastructure'
  const subScheme = `FTF-${schemeName}`

  return {
    filename: generateExcelFilename(
      'FTF-SIG',
      submission.businessDetails.projectName.trim(),
      submission.businessDetails.businessName.trim(),
      submission.confirmationId.trim(),
      today
    ),
    uploadLocation: `Farming Investment Fund/Farming Transformation Fund/${spreadsheetConfig.uploadEnvironment}/Slurry Infrastructure/`,
    worksheets: [
      {
        title: 'DORA DATA',
        ...(spreadsheetConfig.protectEnabled ? { protectPassword: spreadsheetConfig.protectPassword } : {}),
        hideEmptyRows: spreadsheetConfig.hideEmptyRows,
        defaultColumnWidth: 30,
        rows: [
          generateRow(1, 'Field Name', 'Field Value', true),
          generateRow(2, 'FA or OA', 'Outline Application'),
          generateRow(40, 'Scheme', 'Farming Transformation Fund'),
          generateRow(39, 'Sub scheme', subScheme),
          generateRow(43, 'Theme', 'Slurry Infrastructure Grants'),
          generateRow(90, 'Project type', 'Slurry Store and Cover'),
          generateRow(41, 'Owner', 'RD'),
          generateRow(53, 'Business type', getBusinessTypeC53(submission.applicantType)),
          generateRow(341, 'Grant Launch Date', ''),
          generateRow(23, 'Status of applicant', submission.legalStatus),
          generateRow(44, 'Project Items', getProjectItemsFormattedArray(submission.itemSizeQuantities, [submission.otherItems].flat(), submission.storageType, submission.serviceCapacityIncrease, submission.coverType, submission.coverSize)),
          generateRow(45, 'Location of project (postcode)', submission.farmerDetails.projectPostcode),
          generateRow(376, 'Project Started', submission.projectStart),
          generateRow(342, 'Land owned by Farm', submission.tenancy),
          generateRow(343, 'Tenancy for next 5 years', submission.tenancyLength ?? ''),
          generateRow(395, 'System Type', submission.systemType),
          generateRow(396, 'Existing Storage Capacity', submission.existingStorageCapacity),
          generateRow(397, 'Planned Storage Capacity', submission.plannedStorageCapacity),
          generateRow(398, 'Slurry Storage Improvement Method', submission.projectType),
          generateRow(399, 'Impermeable cover', submission.cover),
          generateRow(55, 'Total project expenditure', Number(submission.itemsTotalValue * 2)),
          generateRow(57, 'Grant rate', '50'),
          generateRow(56, 'Grant amount requested', submission.calculatedGrant),
          generateRow(345, 'Remaining Cost to Farmer', submission.remainingCost),
          generateRow(346, 'Planning Permission Status', getPlanningPermissionDoraValue(submission.planningPermission)),
          generateRow(400, 'Planning Authority', submission.PlanningPermissionEvidence?.planningAuthority.toUpperCase() ?? ''),
          generateRow(401, 'Planning Reference No', submission.PlanningPermissionEvidence?.planningReferenceNumber.toUpperCase() ?? ''),
          generateRow(402, 'OS Grid Reference', submission.gridReference.toUpperCase()),
          generateRow(366, 'Date of OA decision', ''),
          generateRow(42, 'Project name', submission.businessDetails.projectName),
          generateRow(4, 'Single business identifier (SBI)', submission.businessDetails.sbi || '000000000'), // sbi is '' if not set so use || instead of ??
          generateRow(7, 'Business name', submission.businessDetails.businessName),
          generateRow(367, 'Annual Turnover', submission.businessDetails.businessTurnover),
          generateRow(22, 'Employees', submission.businessDetails.numberEmployees),
          generateRow(20, 'Business size', calculateBusinessSize(submission.businessDetails.numberEmployees, submission.businessDetails.businessTurnover)),
          generateRow(91, 'Are you an AGENT applying on behalf of your customer', submission.applying === 'Agent' ? 'Yes' : 'No'),
          generateRow(5, 'Surname', submission.farmerDetails.lastName),
          generateRow(6, 'Forename', submission.farmerDetails.firstName),
          generateRow(8, 'Address line 1', submission.farmerDetails.address1),
          generateRow(9, 'Address line 2', submission.farmerDetails.address2),
          generateRow(10, 'Address line 3', ''),
          generateRow(11, 'Address line 4 (town)', submission.farmerDetails.town),
          generateRow(12, 'Address line 5 (county)', submission.farmerDetails.county),
          generateRow(13, 'Postcode (use capitals)', submission.farmerDetails.postcode),
          generateRow(16, 'Landline number', submission.farmerDetails.landlineNumber ?? ''),
          generateRow(17, 'Mobile number', submission.farmerDetails.mobileNumber ?? ''),
          generateRow(18, 'Email', submission.farmerDetails.emailAddress),
          generateRow(89, 'Customer Marketing Indicator', submission.consentOptional ? 'Yes' : 'No'),
          generateRow(368, 'Date ready for QC or decision', todayStr),
          generateRow(369, 'Eligibility Reference No.', submission.confirmationId),
          generateRow(94, 'Current location of file', 'NA Automated'),
          generateRow(92, 'RAG rating', 'Green'),
          generateRow(93, 'RAG date reviewed ', todayStr),
          generateRow(54, 'Electronic OA received date ', todayStr),
          generateRow(370, 'Status', 'Pending RPA review'),
          generateRow(85, 'Full Application Submission Date', (new Date(today.setMonth(today.getMonth() + 6))).toLocaleDateString('en-GB')),
          generateRow(375, 'OA percent', 0),
          generateRow(365, 'OA score', 0),
          ...addAgentDetails(submission.agentsDetails)
        ]
      }
    ]
  }
}

function getCurrencyFormat (amount) {
  return Number(amount).toLocaleString('en-US', { minimumFractionDigits: 0, style: 'currency', currency: 'GBP' })
}

const getItemUnit = (otherItem) => {
  if (otherItem.includes('pump') || otherItem.includes('slurry store')) {
    return 'item(s)'
  } else if (otherItem.includes('pipework') || otherItem.includes('channels') || otherItem.includes('below ground')) {
    return 'm'
  } else {
    return 'm³'
  }
}

function displayObject (itemSizeQuantities, otherItems) {
  let unit
  const projectItems = Object.values(itemSizeQuantities).map((itemSizeQuantity, index) => {
    unit = getItemUnit(otherItems[index].toLowerCase())
    return `${otherItems[index]}: ${itemSizeQuantity} ${unit}`
  })
  console.log(projectItems)
  return projectItems
}

function getPersonsDetails (isAgentEmail, submission) {
  const email = isAgentEmail ? submission.agentsDetails.emailAddress : submission.farmerDetails.emailAddress
  const firstName = isAgentEmail ? submission.agentsDetails.firstName : submission.farmerDetails.firstName
  const lastName = isAgentEmail ? submission.agentsDetails.lastName : submission.farmerDetails.lastName

  return {
    email,
    firstName,
    lastName
  }
}

function getEmailDetails (submission, rpaEmail, isAgentEmail = false) {
  const {
    confirmationId,
    applicantType,
    legalStatus,
    inEngland,
    systemType,
    existingStorageCapacity,
    plannedStorageCapacity,
    cover,
    coverSize,
    itemSizeQuantities,
    otherItems,
    coverType,
    storageType,
    PlanningPermissionEvidence,
    planningPermission,
    projectStart,
    serviceCapacityIncrease,
    tenancy,
    tenancyLength,
    itemsTotalValue,
    calculatedGrant,
    remainingCosts,
    gridReference,
    projectType,
    applicantBusiness,
    consentOptional,
    agentsDetails,
    farmerDetails: {
      firstName: farmerName,
      lastName: farmerSurname,
      emailAddress: farmerEmail,
      projectPostcode
    },
    businessDetails
  } = submission

  const {
    email,
    firstName,
    lastName
  } = getPersonsDetails(isAgentEmail, submission)

  return {
    notifyTemplate: emailConfig.notifyTemplate,
    emailAddress: rpaEmail || email,
    details: {
      firstName,
      lastName,
      referenceNumber: confirmationId,
      legalStatus,
      applicantType: applicantType ? [applicantType].flat().join(', ') : ' ',
      location: inEngland,
      systemType,
      existingStorageCapacity: existingStorageCapacity,
      plannedStorageCapacity: plannedStorageCapacity,
      cover: cover ?? ' ',
      coverSize: coverSize ? coverSize.concat(' m²') : 'N/A',
      itemSizeQuantities: itemSizeQuantities ? displayObject(itemSizeQuantities, [otherItems].flat()).join('\n') : 'None selected',
      coverType: coverType || 'Not needed',
      storageType,
      planningAuthority: PlanningPermissionEvidence ? PlanningPermissionEvidence.planningAuthority.toUpperCase() : 'N/A',
      planningReferenceNumber: PlanningPermissionEvidence ? PlanningPermissionEvidence.planningReferenceNumber : 'N/a',
      planningPermission,
      projectPostcode,
      projectStart: projectStart,
      serviceCapacityIncrease: serviceCapacityIncrease,
      tenancy: tenancy,
      isTenancyLength: tenancyLength ? 'Yes' : 'No',
      tenancyLength: tenancyLength ?? ' ',
      projectCost: getCurrencyFormat(itemsTotalValue),
      potentialFunding: getCurrencyFormat(calculatedGrant),
      remainingCost: remainingCosts,
      gridReference: gridReference.toUpperCase(),
      projectName: businessDetails.projectName,
      projectType,
      businessName: businessDetails.businessName,
      farmerName,
      farmerSurname,
      farmerEmail,
      isAgent: agentsDetails ? 'Yes' : 'No',
      agentName: agentsDetails?.firstName ?? ' ',
      agentSurname: agentsDetails?.lastName ?? ' ',
      agentEmail: agentsDetails?.emailAddress ?? ' ',
      contactConsent: consentOptional ? 'Yes' : 'No',
      scoreDate: new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }),
      businessType: applicantBusiness
    }
  }
}

module.exports = function (submission) {
  return {
    applicantEmail: getEmailDetails(submission, false),
    agentEmail: submission.applying === 'Agent' ? getEmailDetails(submission, false, true) : null,
    rpaEmail: spreadsheetConfig.sendEmailToRpa ? getEmailDetails(submission, spreadsheetConfig.rpaEmail) : null,
    spreadsheet: getSpreadsheetDetails(submission)
  }
}
