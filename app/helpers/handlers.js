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

const {
  getConfirmationId,
  getCheckDetailsModel,
  getEvidenceSummaryModel,
  getDataFromYarValue,
  getConsentOptionalData,
  handleConditinalHtmlData,
} = require('./pageHelpers')

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
      correlationId: request.yar.id,
    })
    await senders.sendDesirabilitySubmitted(emailData, request.yar.id)
    // TODO: update Gapi calls to use new format
    // await gapiService.sendDimensionOrMetrics(request, [ {
    //   dimensionOrMetric: gapiService.dimensions.CONFIRMATION,
    //   value: confirmationId
    // }, {
    //   dimensionOrMetric: gapiService.dimensions.FINALSCORE,
    //   value: getYarValue(request, 'current-score')
    // },
    // {
    //   dimensionOrMetric: gapiService.metrics.CONFIRMATION,
    //   value: 'TIME'
    // }
    // ])
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
      ),
    }
  }
}
const processGA = async (question, request, confirmationId) => {
  //TODO: update Gapi calls to use new format
  // if (question.ga) {
  //   await gapiService.processGA(request, question.ga, confirmationId)
  // }
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
    case 'applying-for':
      setYarValue(request, 'projectType', null)
      setYarValue(request, 'grantFundedCover', null)
      setYarValue(request, 'existingCover', null)
      break
    case 'grant-funded-cover' :
      setYarValue(request, 'serviceCapacityIncrease', null)
      setYarValue(request, 'existingCoverSize', null)
      setYarValue(request, 'coverSize', null)
      if (getYarValue(request, 'applyingFor') === 'An impermeable cover only' && getYarValue(request, 'fitForPurpose') === 'No'){
        question.nextUrl = `${urlPrefix}/estimated-grant`
      }else{
        if (getYarValue(request, 'applicantType') === 'Pig') {
            question.nextUrl = `${urlPrefix}/existing-cover-pig`
        } else {
            question.nextUrl = `${urlPrefix}/existing-cover`
        }
      }
      break
    case 'existing-cover' :
      setYarValue(request, 'serviceCapacityIncrease', null)
      setYarValue(request, 'existingCoverSize', null)
      setYarValue(request, 'coverSize', null)
      break
    case 'existing-cover-pig' :
      setYarValue(request, 'serviceCapacityIncrease', null)
      setYarValue(request, 'existingCoverSize', null)
      setYarValue(request, 'coverSize', null)
      break
    case 'applicant-type' :
      setYarValue(request, 'intensiveFarming', null)
      break
    case 'existing-cover-type' :
      if (getYarValue(request, 'applyingFor') === 'An impermeable cover only') {
        setYarValue(request, 'planningPermission', null)
        question.backUrl = `${urlPrefix}/standardised-grant-amounts`
        question.sidebar.showSidebar = false
      } else if (getYarValue(request, 'coverType')) {
        question.backUrl = `${urlPrefix}/cover-type`
        question.sidebar.showSidebar = true
      } else if (getYarValue(request, 'projectType') === 'Replace an existing store that is no longer fit for purpose with a new store') {
        if (getYarValue(request, 'applicantType') === 'Pig') {
          question.backUrl = `${urlPrefix}/pig-serviceable-capacity-increase-replace`
          question.sidebar.showSidebar = true
        } else {
          question.backUrl = `${urlPrefix}/serviceable-capacity-increase-replace`
          question.sidebar.showSidebar = true
        }
      } else {
        if (getYarValue(request, 'applicantType') === 'Pig') {
          question.backUrl = `${urlPrefix}/pig-serviceable-capacity-increase-additional`
          question.sidebar.showSidebar = true
        } else {
          question.backUrl = `${urlPrefix}/serviceable-capacity-increase-additional`
          question.sidebar.showSidebar = true
        }
      }
      break
    case 'separator':
      if (getYarValue(request, 'coverType')) { 
        if(getYarValue(request, 'existingCover') && getYarValue(request, 'existingCover') === 'Yes') { 
          question.backUrl = `${urlPrefix}/existing-grant-funded-cover-size`
        }else{
          question.backUrl = `${urlPrefix}/cover-size`
        }
      } else if (getYarValue(request, 'existingCoverSize')) {
        question.backUrl = `${urlPrefix}/existing-cover-size`
      } else {
        if (getYarValue(request, 'applicantType') === 'Pig') {
          if (getYarValue(request, 'projectType') === 'Replace an existing store that is no longer fit for purpose with a new store') {
            question.backUrl = `${urlPrefix}/pig-serviceable-capacity-increase-replace`
          } else {
            question.backUrl = `${urlPrefix}/pig-serviceable-capacity-increase-additional`
          }
        } else {
          if (getYarValue(request, 'projectType') === 'Replace an existing store that is no longer fit for purpose with a new store') {
            question.backUrl = `${urlPrefix}/serviceable-capacity-increase-replace`
          } else {
            question.backUrl = `${urlPrefix}/serviceable-capacity-increase-additional`
          }
        }
      }
    case 'estimated-grant':
      setYarValue(request, 'estimatedGrant', 'reached')
        if (getYarValue(request, 'applyingFor') === 'An impermeable cover only' && getYarValue(request, 'fitForPurpose') === 'No'){
          backUrl = `${urlPrefix}/grant-funded-cover`
        }
    case 'fit-for-purpose':
      break
    case 'fit-for-purpose-conditional': 
      if(getYarValue(request, 'applyingFor') === 'An impermeable cover only'){
        question.maybeEligibleContent.isimpermeablecoveronly = true
        question.nextUrl = `${urlPrefix}/project-type`
      }else{
          question.maybeEligibleContent.isimpermeablecoveronly = false
      }
    break
    // case "storage-type":
    //   setYarValue(request, "serviceCapacityIncrease", null)
    //   setYarValue(request, "separator", null)
    //   setYarValue(request, "existingCoverType", null)
    //   setYarValue(request, "coverType", null)
    //   setYarValue(request, "coverSize", null)
    //   setYarValue(request, "existingCoverSize", null)
    //   setYarValue(request, "existingGrantFundedCoverSize", null)
    //   break
    default:
      break
  }

  if (
    url === 'potential-amount' &&
    !getGrantValues(getYarValue(request, 'itemsTotalValue'), question.grantInfo)
      .isEligible
  ) {
    const NOT_ELIGIBLE = { ...question.ineligibleContent, backUrl }
    //TODO update Gapi calls to use new format
    // gapiService.sendEligibilityEvent(request, "true")
    return h.view('not-eligible', NOT_ELIGIBLE)
  }

  if (question.maybeEligible) {
    let { maybeEligibleContent } = question
    maybeEligibleContent.title = question.title
    let consentOptionalData

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
          ),
        },
      }
      request.yar.reset()
    }

    maybeEligibleContent = {
      ...maybeEligibleContent,
      messageContent: maybeEligibleContent.messageContent.replace(
        SELECT_VARIABLE_TO_REPLACE,
        (_ignore, additionalYarKeyName) =>
          formatUKCurrency(getYarValue(request, additionalYarKeyName) || 0)
      ),
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

  await processGA(question, request, confirmationId)

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
const createAnswerObj = (payload, yarKey, type, request, answers) => {
  let thisAnswer
  for (let [key, value] of Object.entries(payload)) {
    thisAnswer = answers?.find((answer) => answer.value === value)

    if (key === 'gridReference') value = value.replace(/\s/g, '')

    if (yarKey === 'grantFundedCover' && value !== 'Yes, I need a cover') {
      setYarValue(request, 'coverType', null)
      setYarValue(request, 'coverSize', null)

    }
    else if (yarKey === 'applyingFor' && value === 'An impermeable cover only') {
      setYarValue(request, 'fitForPurpose', null)
      setYarValue(request, 'projectType', null)
      setYarValue(request, 'grantFundedCover', null)
      setYarValue(request, 'existingCover', null)
      setYarValue(request, 'storageType', null)
      setYarValue(request, 'serviceCapacityIncrease', null)
      setYarValue(request, 'coverType', null)
      setYarValue(request, 'coverSize', null)
    }
    else if (yarKey === 'applyingFor' && value !== 'An impermeable cover only') {
      setYarValue(request, 'fitForPurpose', null)
      setYarValue(request, 'existingCoverType', null)
      setYarValue(request, 'existingCoverSize', null)
      setYarValue(request, 'projectType', null)
      setYarValue(request, 'grantFundedCover', null)
    }
    else if (yarKey === 'existingCover' && value !== 'Yes') {
      setYarValue(request, 'existingCoverType', null)
      setYarValue(request, 'existingCoverSize', null)

    } 
    else if (yarKey === 'separator' && value === 'No') {
      setYarValue(request, 'separatorType', null)
      setYarValue(request, 'separatorOptions', null)
      setYarValue(request, 'gantry', null)
    } 
    else if (yarKey === 'separatorType') {
      setYarValue(request, 'separatorOptions', value)

    } 
    else if (yarKey === 'gantry' && value === 'Yes') {
      let tempSeparatorVal = [getYarValue(request, 'separatorOptions')].flat()

      tempSeparatorVal.push('Gantry')

      setYarValue(request, 'separatorOptions', tempSeparatorVal)
    } 
    else if (yarKey === 'gantry' && value === 'No') {
      let tempSeparatorVal = [getYarValue(request, 'separatorOptions')].flat()

      setYarValue(request, 'separatorOptions', tempSeparatorVal)

    } else if (yarKey === 'solidFractionStorage' && value === 'Concrete pad') {

      let tempSeparatorVal = [getYarValue(request, 'separatorOptions')].flat()

      // push user entered value
      tempSeparatorVal.push(value)

      setYarValue(request, 'separatorOptions', tempSeparatorVal)

    } else if (yarKey === 'solidFractionStorage' && value === 'Concrete bunker') {
      let tempSeparatorVal = [getYarValue(request, 'separatorOptions')].flat()

      // push user entered value
      tempSeparatorVal.push('Concrete bunker')

      setYarValue(request, 'separatorOptions', tempSeparatorVal)
    } else if (yarKey === 'solidFractionStorage' && Number(value)) {
      setYarValue(request, 'concreteBunkerSize', value)
      
      let tempSeparatorVal = [getYarValue(request, 'separatorOptions')].flat()
      tempSeparatorVal.push('Size: ' + value + 'm²')
      setYarValue(request, 'separatorOptions', tempSeparatorVal)

    } 

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

const showPostPage = (currentQuestion, request, h) => {
  const {
    yarKey,
    answers,
    baseUrl,
    ineligibleContent,
    nextUrl,
    nextUrlObject,
    title,
    type,
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


  const errors = checkErrors(payload, currentQuestion, h, request)
  if (errors) {
    // TODO: update Gapi calls to use new format
    // gapiService.sendValidationDimension(request)
    return errors
  }

  if (thisAnswer?.notEligible) {
    //TODO update Gapi calls to use new format
    // gapiService.sendEligibilityEvent(request, !!thisAnswer?.notEligible)
    return h.view('not-eligible', NOT_ELIGIBLE)
  } else if (thisAnswer?.redirectUrl) {
    return h.redirect(thisAnswer?.redirectUrl)
  }

  if (yarKey === 'serviceCapacityIncrease') {
    if (getYarValue(request, 'grantFundedCover') === 'Yes, I need a cover') {
      return h.redirect(`${urlPrefix}/cover-type`)
    } else if (getYarValue(request, 'existingCover') && getYarValue(request, 'existingCover') === 'Yes') {
      return h.redirect(`${urlPrefix}/existing-cover-type`)
    } else {
      return h.redirect(`${urlPrefix}/separator`)
    }
  }

  return h.redirect(
    getUrl(nextUrlObject, nextUrl, request, payload.secBtn, currentQuestion.url)
  )
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
