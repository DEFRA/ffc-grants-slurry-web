const { getYarValue, setYarValue } = require('../helpers/session')
const { getModel } = require('../helpers/models')
const { checkErrors } = require('../helpers/errorSummaryHandlers')
const { getGrantValues } = require('../helpers/grants-info')
const { formatUKCurrency } = require('../helpers/data-formats')
const {
  SELECT_VARIABLE_TO_REPLACE,
  DELETE_POSTCODE_CHARS_REGEX
} = require('../helpers/regex')
const { getUrl } = require('../helpers/urls')
const { guardPage } = require('../helpers/page-guard')
const senders = require('../messaging/senders')
const createMsg = require('../messaging/create-msg')
const gapiService = require('../services/gapi-service')
const { startPageUrl, urlPrefix } = require('../config/server')
const { ALL_QUESTIONS } = require('../config/question-bank')
const { formatOtherItems } = require('./../helpers/other-items-sizes')
const emailFormatting = require('./../messaging/email/process-submission')
const { getQuestionAnswer } = require('../../app/helpers/utils.js')
const {
  getConfirmationId,
  getCheckDetailsModel,
  getEvidenceSummaryModel,
  getDataFromYarValue,
  getConsentOptionalData,
  handleConditinalHtmlData
} = require('./pageHelpers')
const { validateAnswerField } = require('./errorHelpers')

const setGrantsData = (question, request) => {
  if (question.grantInfo) {
    const { calculatedGrant, remainingCost } = getGrantValues(
      getYarValue(request, 'itemsTotalValue'),
      question.grantInfo
    )
    setYarValue(request, 'calculatedGrant', calculatedGrant)
    setYarValue(request, 'remainingCost', remainingCost)
  }
}

const sendContactDetailsToSenders = async (request, confirmationId) => {
  try {
    const emailData = await emailFormatting({
      body: createMsg.getAllDetails(request, confirmationId),
      correlationId: request.yar.id
    })
    await senders.sendDesirabilitySubmitted(emailData, request.yar.id)

    console.log('[CONFIRMATION EVENT SENT]')
  } catch (err) {
    console.log('ERROR: ', err)
  }
}

const setTitle = async (title, question, request) => {
  if (title) {
    return {
      ...question,
      title: title.replace(
        SELECT_VARIABLE_TO_REPLACE,
        (_ignore, additionalYarKeyName) =>
          formatUKCurrency(getYarValue(request, additionalYarKeyName) || 0)
      )
    }
  }
}
const processGA = async (question, request) => {
  if (question.ga) {
    if (question.ga.journeyStart) {
      setYarValue(request, 'journey-start-time', Date.now())
      console.log('[JOURNEY STARTED] ')
    } else {
      await gapiService.sendGAEvent(request, question.ga)
    }
  }
}

const addConsentOptionalData = async (url, request) => {
  if (url === 'confirm') {
    const consentOptional = getYarValue(request, 'consentOptional')
    return getConsentOptionalData(consentOptional)
  }
}

const addConditionalLabelData = async (
  question,
  yarKey,
  type,
  request,
  condHTML
) => {
  if (question?.conditionalKey && question?.conditionalLabelData) {
    const conditional =
      yarKey === 'businessDetails' ? yarKey : question.conditionalKey
    condHTML = handleConditinalHtmlData(
      type,
      question.conditionalLabelData,
      conditional,
      request
    )
  }
  return condHTML
}
const isImperableCover = getQuestionAnswer('applying-for', 'applying-for-A2')
const isPig = getQuestionAnswer('applicant-type', 'applicant-type-A1')
const isReplaceStore = getQuestionAnswer('project-type', 'project-type-A1')
const isExistingCover = getQuestionAnswer('existing-cover', 'existing-cover-A1')


const existingCoverUrlSwitch = (request, question) => {
  if (getYarValue(request, 'applyingFor') === isImperableCover) {
    setYarValue(request, 'planningPermission', null)
    question.backUrl = `${urlPrefix}/reference-cost`
    question.sidebar.showSidebar = false
  } else if (getYarValue(request, 'coverType')) {
    question.backUrl = `${urlPrefix}/cover-type`
    question.sidebar.showSidebar = true
  } else if (getYarValue(request, 'projectType') === isReplaceStore) {
    if (getYarValue(request, 'applicantType') === isPig) {
      question.backUrl = `${urlPrefix}/pig-capacity-increase-replace`
      question.sidebar.showSidebar = true
    } else {
      question.backUrl = `${urlPrefix}/capacity-increase-replace`
      question.sidebar.showSidebar = true
    }
  } else if (getYarValue(request, 'applicantType') === isPig) {
    question.backUrl = `${urlPrefix}/pig-capacity-increase-additional`
    question.sidebar.showSidebar = true
  } else {
    question.backUrl = `${urlPrefix}/capacity-increase-additional`
    question.sidebar.showSidebar = true
  }

  return question
}

const getCoverTypeUrl = (request) => {
  if (getYarValue(request, 'existingCover') && getYarValue(request, 'existingCover') === isExistingCover) {
    return `${urlPrefix}/existing-grant-funded-cover-size`
  } else {
    return `${urlPrefix}/cover-size`
  }
}

const getPigCapBackUrl = (request) => {
  if (getYarValue(request, 'projectType') === isReplaceStore) {
    return `${urlPrefix}/pig-capacity-increase-replace`
  } else {
    return `${urlPrefix}/pig-capacity-increase-additional`
  }
}

const getNormalCapBackUrl = (request) => {
  if (getYarValue(request, 'projectType') === isReplaceStore) {
    return `${urlPrefix}/capacity-increase-replace`
  } else {
    return `${urlPrefix}/capacity-increase-additional`
  }
}

const separatorUrlSwitch = (request, question) => {
  if (getYarValue(request, 'coverType')) {
    question.backUrl = getCoverTypeUrl(request)
  } else if (getYarValue(request, 'existingCoverSize')) {
    question.backUrl = `${urlPrefix}/existing-cover-size`
  } else if (getYarValue(request, 'applicantType') === isPig) {
    question.backUrl = getPigCapBackUrl(request)
  } else {
    question.backUrl = getNormalCapBackUrl(request)
  }
  

  return question
}

const estimatedGrantUrlSwitch = (request, backUrl) => {
  setYarValue(request, 'estimatedGrant', 'reached')
  if (getYarValue(request, 'applyingFor') === isImperableCover && getYarValue(request, 'fitForPurpose') === 'No') {
    backUrl = `${urlPrefix}/grant-funded-cover`
  }

  return backUrl
}

const fitForPurposeConditonalUrlCase = (request, question) => {
  if (getYarValue(request, 'applyingFor') === isImperableCover) {
    question.maybeEligibleContent.isImpermeableCoverOnly = true
    question.nextUrl = `${urlPrefix}/project-type`
  } else {
    question.maybeEligibleContent.isImpermeableCoverOnly = false
  }

  return question
}

const maybeEligibleGet = async (request, confirmationId, question, url, nextUrl, backUrl, h) => {
  let { maybeEligibleContent } = question
  maybeEligibleContent.title = question.title
  let consentOptionalData

  if ('conditionalText' in maybeEligibleContent) {
    const value = getYarValue(request, maybeEligibleContent.conditionalText.dependantYarKey)
    const validationType = maybeEligibleContent.conditionalText.validationType
    const details = maybeEligibleContent.conditionalText.details
    if (getYarValue(request, 'solidFractionStorage') != 'Concrete bunker') {
      maybeEligibleContent.conditionalText.condition = false
    } else {
      let payload = ''
      maybeEligibleContent.conditionalText.condition = !validateAnswerField(value, validationType, details, payload)
    }
    maybeEligibleContent = {
      ...maybeEligibleContent,
      conditionalText: {
        ...maybeEligibleContent.conditionalText,
        conditionalPara: maybeEligibleContent.conditionalText.conditionalPara.replace(
          SELECT_VARIABLE_TO_REPLACE,
          (_ignore, additionalYarKeyName) =>
            formatUKCurrency(getYarValue(request, additionalYarKeyName) || 0)
        )
      }
    }
  }

  if (maybeEligibleContent.reference) {
    if (!getYarValue(request, 'consentMain')) {
      return h.redirect(startPageUrl)
    }
    confirmationId = getConfirmationId(request.yar.id)

    // Send Contact details to GAPI
    await sendContactDetailsToSenders(request, confirmationId)

    maybeEligibleContent = {
      ...maybeEligibleContent,
      reference: {
        ...maybeEligibleContent.reference,
        html: maybeEligibleContent.reference.html.replace(
          SELECT_VARIABLE_TO_REPLACE,
          (_ignore, _confirmatnId) => confirmationId
        )
      }
    }
    request.yar.reset()
  }

  maybeEligibleContent = {
    ...maybeEligibleContent,
    messageContent: maybeEligibleContent.messageContent.replace(
      SELECT_VARIABLE_TO_REPLACE,
      (_ignore, additionalYarKeyName) =>
        formatUKCurrency(getYarValue(request, additionalYarKeyName) || 0)
    )
  }

  consentOptionalData = await addConsentOptionalData(url, request)

  const MAYBE_ELIGIBLE = {
    ...maybeEligibleContent,
    consentOptionalData,
    url,
    nextUrl,
    backUrl
  }
  return h.view('maybe-eligible', MAYBE_ELIGIBLE)
}

const getPage = async (question, request, h) => {
  const {
    url,
    nextUrlObject,
    type,
    title,
    yarKey,
    preValidationKeys,
    preValidationKeysRule,
    backUrlObject
  } = question
  let nextUrl = getUrl(nextUrlObject, question.nextUrl, request)
  let backUrl = getUrl(backUrlObject, question.backUrl, request)
  const isRedirect = guardPage(
    request,
    preValidationKeys,
    preValidationKeysRule
  )
  if (isRedirect) {
    return h.redirect(startPageUrl)
  }
  let confirmationId = ''
  setGrantsData(question, request)

  switch (url) {
    case 'existing-cover-type':
      question = existingCoverUrlSwitch(request, question)
      break
    case 'separator':
      question = separatorUrlSwitch(request, question)
      break

    case 'estimated-grant':
      backUrl = estimatedGrantUrlSwitch(request, backUrl)
      break
    case 'fit-for-purpose':
      break
    case 'fit-for-purpose-conditional':
      question = fitForPurposeConditonalUrlCase(request, question)
      nextUrl = getUrl(nextUrlObject, question.nextUrl, request)
      break
    default:
      break
  }

  if (
    url === 'potential-amount' &&
    !getGrantValues(getYarValue(request, 'itemsTotalValue'), question.grantInfo)
      .isEligible
  ) {
    const NOT_ELIGIBLE = { ...question.ineligibleContent, backUrl }
    gapiService.sendGAEvent(request, { name: gapiService.eventTypes.ELIMINATION, params: {} })
    return h.view('not-eligible', NOT_ELIGIBLE)
  }

  await processGA(question, request)

  if (question.maybeEligible) {
    return await maybeEligibleGet(request, confirmationId, question, url, nextUrl, backUrl, h)
  }

  await setTitle(title, question, request)

  const data = getDataFromYarValue(request, yarKey, type)

  let conditionalHtml
  conditionalHtml = await addConditionalLabelData(
    question,
    yarKey,
    type,
    request,
    conditionalHtml
  )

  switch (url) {
    case 'check-details': {
      return h.view(
        'check-details',
        getCheckDetailsModel(request, question, backUrl, nextUrl)
      )
    }
    case 'planning-permission-summary': {
      const evidenceSummaryModel = getEvidenceSummaryModel(
        request,
        question,
        backUrl,
        nextUrl
      )
      if (evidenceSummaryModel.redirect) {
        return h.redirect(startPageUrl)
      }
      return h.view('evidence-summary', evidenceSummaryModel)
    }
    case 'score':
    case 'business-details':
    case 'agent-details':
    case 'applicant-details': {
      return h.view('page', getModel(data, question, request, conditionalHtml))
    }
    default:
      break
  }

  return h.view('page', getModel(data, question, request, conditionalHtml))
}

const clearYarValue = (yarKey, payload, request) => {
  if (yarKey === 'consentOptional' && !Object.keys(payload).includes(yarKey)) {
    setYarValue(request, yarKey, '')
  }
}

const handleSolidFractionStorage = (request, value) => {
  const tempSeparatorVal = [getYarValue(request, 'separatorOptions')].flat()
  if (value === 'Concrete pad') {
    tempSeparatorVal.push(value)
    setYarValue(request, 'separatorOptions', tempSeparatorVal)
    setYarValue(request, 'concreteBunkerSize', null)
  } else if (value === 'Concrete bunker') {
    tempSeparatorVal.push('Concrete bunker')
    setYarValue(request, 'separatorOptions', tempSeparatorVal)
  } else if (Number(value)) {
    setYarValue(request, 'concreteBunkerSize', value)
    if (tempSeparatorVal[tempSeparatorVal.length - 1] === 'Concrete bunker') {
      tempSeparatorVal.push('Size: ' + value + 'm²')
      setYarValue(request, 'separatorOptions', tempSeparatorVal)
    }
  } else if (value === 'I already have short-term storage') {
    setYarValue(request, 'concreteBunkerSize', null)
  }
}

const slurryYarValueSettingBlock = (request, yarKey, value) => {
  let tempSeparatorVal

  switch (yarKey) {
    case 'grantFundedCover':
      if (value !== 'Yes, I need a cover') {
        setYarValue(request, 'coverType', null)
        setYarValue(request, 'coverSize', null)
      }
      break;
    case 'existingCover':
      if (value !== 'Yes') {
        setYarValue(request, 'fitForPurpose', null)
        setYarValue(request, 'existingCoverType', null)
        setYarValue(request, 'existingCoverSize', null)
      }
      break;
    case 'fitForPurpose':
      if (value === 'Yes' && getYarValue(request, 'applyingFor') === isImperableCover) {
        setYarValue(request, 'existingCover', null)
        setYarValue(request, 'projectType', null)
        setYarValue(request, 'grantFundedCover', null)
        setYarValue(request, 'storageType', null)
        setYarValue(request, 'serviceCapacityIncrease', null)
        setYarValue(request, 'coverType', null)
        setYarValue(request, 'coverSize', null)
      }
      break;
    case 'separator':
      if (value === 'No') {
        setYarValue(request, 'separatorType', null)
        setYarValue(request, 'separatorOptions', null)
        setYarValue(request, 'gantry', null)
        setYarValue(request, 'concreteBunkerSize', null)
        setYarValue(request, 'solidFractionStorage', null)
      }
      break;
    case 'separatorType':
      setYarValue(request, 'separatorOptions', value)
      break;
    case 'gantry':
      tempSeparatorVal = [getYarValue(request, 'separatorOptions')].flat()
      if (value === 'Yes') {
        tempSeparatorVal.push('Gantry')
      }
      setYarValue(request, 'separatorOptions', tempSeparatorVal)
      break;
    case 'solidFractionStorage':
      handleSolidFractionStorage(request, value);
      break;
    default:
      break;
  }
}

const createAnswerObj = (payload, yarKey, type, request, answers) => {
  let thisAnswer
  for (let [key, value] of Object.entries(payload)) {
    thisAnswer = answers?.find((answer) => answer.value === value)
   
    if (key === 'existingGridReference' || key === 'newGridReference') value = value.replace(/\s/g, '')

    if (yarKey === 'applicantType' && value !== isPig) setYarValue(request, 'intensiveFarming', null)

    slurryYarValueSettingBlock(request, yarKey, value)

    if (type !== 'multi-input' && key !== 'secBtn') {
      setYarValue(
        request,
        key,
        key === 'projectPostcode'
          ? value
              .replace(DELETE_POSTCODE_CHARS_REGEX, '')
              .split(/(?=.{3}$)/)
              .join(' ')
              .toUpperCase()
          : value
      )
    }
  }
  return thisAnswer
}

const handleMultiInput = (
  type,
  request,
  dataObject,
  yarKey,
  currentQuestion,
  payload
) => {
  if (type === 'multi-input') {
    let allFields = currentQuestion.allFields
    if (currentQuestion.costDataKey) {
      allFields = formatOtherItems(request)
    }
    allFields.forEach((field) => {
      if (field.yarKey === 'existingCoverSize') {
        setYarValue(request, 'existingCoverSize', payload[field.yarKey])
      } else if (field.yarKey === 'coverSize') {
        setYarValue(request, 'coverSize', payload[field.yarKey])
      }
      const payloadYarVal = payload[field.yarKey]
        ? payload[field.yarKey]
            .replace(DELETE_POSTCODE_CHARS_REGEX, '')
            .split(/(?=.{3}$)/)
            .join(' ')
            .toUpperCase()
        : ''
      dataObject = {
        ...dataObject,
        [field.yarKey]:
          field.yarKey === 'postcode' || field.yarKey === 'projectPostcode'
            ? payloadYarVal
            : payload[field.yarKey] || '',
        ...(field.conditionalKey
          ? { [field.conditionalKey]: payload[field.conditionalKey] }
          : {})
      }
    })
    setYarValue(request, yarKey, dataObject)
  }
}

const redirectReturns = (request, yarKey, nextUrlObject, nextUrl, payload, currentQuestion, h) => {
  if (yarKey === 'serviceCapacityIncrease') {
    if (getYarValue(request, 'grantFundedCover') === getQuestionAnswer('grant-funded-cover', 'grant-funded-cover-A1')) {
      return h.redirect(`${urlPrefix}/cover-type`)
    } else if (getYarValue(request, 'existingCover') && getYarValue(request, 'existingCover') === isExistingCover) {
      return h.redirect(`${urlPrefix}/existing-cover-type`)
    } else {
      return h.redirect(`${urlPrefix}/separator`)
    }
  }

  if (yarKey === 'grantFundedCover') {
    if (getYarValue(request, 'applyingFor') === isImperableCover && getYarValue(request, 'fitForPurpose') === 'No') {
      return h.redirect(`${urlPrefix}/estimated-grant`)
    } else if (getYarValue(request, 'applicantType') === isPig) {
      return h.redirect(`${urlPrefix}/existing-cover-pig`)
    } else {
      return h.redirect(`${urlPrefix}/existing-cover`)
    }
    
  }

  return h.redirect(
    getUrl(nextUrlObject, nextUrl, request, payload.secBtn, currentQuestion.url)
  )
}

const showPostPage = async (currentQuestion, request, h) => {
  const {
    yarKey,
    answers,
    baseUrl,
    ineligibleContent,
    nextUrl,
    nextUrlObject,
    title,
    type
  } = currentQuestion
  const NOT_ELIGIBLE = { ...ineligibleContent, backUrl: baseUrl }
  const payload = request.payload

  let thisAnswer
  let dataObject

  clearYarValue(yarKey, payload, request)
  thisAnswer = createAnswerObj(payload, yarKey, type, request, answers)

  handleMultiInput(type, request, dataObject, yarKey, currentQuestion, payload)

  if (title) {
    currentQuestion = {
      ...currentQuestion,
      title: title.replace(
        SELECT_VARIABLE_TO_REPLACE,
        (_ignore, additionalYarKeyName) =>
          formatUKCurrency(getYarValue(request, additionalYarKeyName) || 0)
      )
    }
  }

  if (yarKey === 'gridReference') {
    setYarValue(request, 'gridReference', {
      existingGridReference: getYarValue(request, 'gridReference').existingGridReference?.toUpperCase().replace(/\s/g, ''),
      newGridReference: getYarValue(request, 'gridReference').newGridReference?.toUpperCase().replace(/\s/g, '')
    })
  }

  const errors = checkErrors(payload, currentQuestion, h, request)
  if (errors) {
    return errors
  }

  if (thisAnswer?.notEligible) {
    await gapiService.sendGAEvent(request, {
      name: gapiService.eventTypes.ELIMINATION,
      params: {
      }
    })
    return h.view('not-eligible', NOT_ELIGIBLE)
  } else if (thisAnswer?.redirectUrl) {
    return h.redirect(thisAnswer?.redirectUrl)
  }

  return redirectReturns(request, yarKey, nextUrlObject, nextUrl, payload, currentQuestion, h)
}

const getHandler = (question) => {
  return (request, h) => {
    return getPage(question, request, h)
  }
}

const getPostHandler = (currentQuestion) => {
  return (request, h) => {
    return showPostPage(currentQuestion, request, h)
  }
}

module.exports = {
  getHandler,
  getPostHandler
}
