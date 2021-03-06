const { getYarValue, setYarValue } = require('../helpers/session')
const { getModel } = require('../helpers/models')
const { checkErrors } = require('../helpers/errorSummaryHandlers')
const { getGrantValues } = require('../helpers/grants-info')
const { formatUKCurrency } = require('../helpers/data-formats')
const { SELECT_VARIABLE_TO_REPLACE, DELETE_POSTCODE_CHARS_REGEX } = require('../helpers/regex')
const { getHtml } = require('../helpers/conditionalHTML')
const { getUrl } = require('../helpers/urls')
const { guardPage } = require('../helpers/page-guard')
const { setOptionsLabel } = require('../helpers/answer-options')
const { notUniqueSelection, uniqueSelection } = require('../helpers/utils')
const senders = require('../messaging/senders')
const createMsg = require('../messaging/create-msg')
const gapiService = require('../services/gapi-service')
const { startPageUrl } = require('../config/server')
const { ALL_QUESTIONS } = require('../config/question-bank')
const { formatOtherItems } = require('./../helpers/other-items-sizes')

const getConfirmationId = (guid) => {
  const prefix = 'SI'
  return `${prefix}-${guid.substr(0, 3)}-${guid.substr(3, 3)}`.toUpperCase()
}

const handleConditinalHtmlData = (type, labelData, yarKey, request) => {
  const isMultiInput = type === 'multi-input'
  const label = isMultiInput ? 'sbi' : yarKey
  const fieldValue = isMultiInput ? getYarValue(request, yarKey)?.sbi : getYarValue(request, yarKey)
  return getHtml(label, labelData, fieldValue)
}

const saveValuesToArray = (yarKey, fields) => {
  const result = []

  if (yarKey) {
    fields.forEach(field => {
      if (yarKey[field]) {
        result.push(yarKey[field])
      }
    })
  }

  return result
}

const getCheckDetailsModel = (request, question, backUrl, nextUrl) => {
  setYarValue(request, 'reachedCheckDetails', true)

  const applying = getYarValue(request, 'applying')
  const businessDetails = getYarValue(request, 'businessDetails')
  const agentDetails = getYarValue(request, 'agentsDetails')
  const farmerDetails = getYarValue(request, 'farmerDetails')

  const agentContact = saveValuesToArray(agentDetails, ['emailAddress', 'mobileNumber', 'landlineNumber'])
  const agentAddress = saveValuesToArray(agentDetails, ['address1', 'address2', 'town', 'county', 'postcode'])

  const farmerContact = saveValuesToArray(farmerDetails, ['emailAddress', 'mobileNumber', 'landlineNumber'])
  const farmerAddress = saveValuesToArray(farmerDetails, ['address1', 'address2', 'town', 'county', 'postcode'])

  return ({
    ...question.pageData,
    backUrl,
    nextUrl,
    applying,
    businessDetails,
    farmerDetails: {
      ...farmerDetails,
      ...(farmerDetails
        ? {
            name: `${farmerDetails.firstName} ${farmerDetails.lastName}`,
            contact: farmerContact.join('<br/>'),
            address: farmerAddress.join('<br/>')
          }
        : {}
      )
    },
    agentDetails: {
      ...agentDetails,
      ...(agentDetails
        ? {
            name: `${agentDetails.firstName} ${agentDetails.lastName}`,
            contact: agentContact.join('<br/>'),
            address: agentAddress.join('<br/>')
          }
        : {}
      )
    }

  })
}

const getEvidenceSummaryModel = (request, question, backUrl, nextUrl) => {
  setYarValue(request, 'reachedEvidenceSummary', true)

  const planningPermission = getYarValue(request, 'planningPermission')
  const gridReference = getYarValue(request, 'gridReference').gridReferenceNumber

  const hasEvidence = !planningPermission.startsWith('Not yet')

  return ({
    ...question.pageData,
    backUrl,
    nextUrl,
    planningPermission,
    gridReference,
    ...(hasEvidence
      ? {
          evidence: {
            planningAuthority: getYarValue(request, 'PlanningPermissionEvidence').planningAuthority,
            planningReferenceNumber: getYarValue(request, 'PlanningPermissionEvidence').planningReferenceNumber
          }
        }
      : {}
    )
  })
}

const getDataFromYarValue = (request, yarKey, type) => {
  let data = getYarValue(request, yarKey) || null
  if (type === 'multi-answer' && !!data) {
    data = [data].flat()
  }

  return data
}

const getConsentOptionalData = (consentOptional) => {
  return {
    hiddenInput: {
      id: 'consentMain',
      name: 'consentMain',
      value: 'true',
      type: 'hidden'
    },
    idPrefix: 'consentOptional',
    name: 'consentOptional',
    items: setOptionsLabel(consentOptional,
      [{
        value: 'CONSENT_OPTIONAL',
        text: '(Optional) I confirm'
      }]
    )
  }
}

const getPage = async (question, request, h) => {
  const { url, backUrl, nextUrlObject, type, title, yarKey, preValidationKeys, preValidationKeysRule } = question
  const nextUrl = getUrl(nextUrlObject, question.nextUrl, request)
  const isRedirect = guardPage(request, preValidationKeys, preValidationKeysRule)
  if (isRedirect) {
    return h.redirect(startPageUrl)
  }
  let confirmationId = ''

  if (url === 'potential-amount' && (!getGrantValues(getYarValue(request, 'itemsTotalValue'), question.grantInfo).isEligible)) {
    const NOT_ELIGIBLE = { ...question.ineligibleContent, backUrl }
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
      // try {
      //   await senders.sendContactDetails(createMsg.getAllDetails(request, confirmationId), request.yar.id)
      //   await gapiService.sendDimensionOrMetrics(request, [{
      //     dimensionOrMetric: gapiService.dimensions.CONFIRMATION,
      //     value: confirmationId
      //   }, {
      //     dimensionOrMetric: gapiService.dimensions.FINALSCORE,
      //     value: getYarValue(request, 'current-score')
      //   },
      //   {
      //     dimensionOrMetric: gapiService.metrics.CONFIRMATION,
      //     value: 'TIME'
      //   }
      //   ])
      //   console.log('Confirmation event sent')
      // } catch (err) {
      //   console.log('ERROR: ', err)
      // }
      maybeEligibleContent = {
        ...maybeEligibleContent,
        reference: {
          ...maybeEligibleContent.reference,
          html: maybeEligibleContent.reference.html.replace(
            SELECT_VARIABLE_TO_REPLACE, (_ignore, _confirmatnId) => (
              confirmationId
            )
          )
        }
      }
      request.yar.reset()
    }

    maybeEligibleContent = {
      ...maybeEligibleContent,
      messageContent: maybeEligibleContent.messageContent.replace(
        SELECT_VARIABLE_TO_REPLACE, (_ignore, additionalYarKeyName) => (
          formatUKCurrency(getYarValue(request, additionalYarKeyName) || 0)
        )
      )
    }

    if (url === 'confirm') {
      const consentOptional = getYarValue(request, 'consentOptional')
      consentOptionalData = getConsentOptionalData(consentOptional)
    }

    const MAYBE_ELIGIBLE = { ...maybeEligibleContent, consentOptionalData, url, nextUrl, backUrl }
    return h.view('maybe-eligible', MAYBE_ELIGIBLE)
  }

  if (title) {
    question = {
      ...question,
      title: title.replace(SELECT_VARIABLE_TO_REPLACE, (_ignore, additionalYarKeyName) => (
        formatUKCurrency(getYarValue(request, additionalYarKeyName) || 0)
      ))
    }
  }

  const data = getDataFromYarValue(request, yarKey, type)

  let conditionalHtml
  if (question?.conditionalKey && question?.conditionalLabelData) {
    const conditional = yarKey === 'businessDetails' ? yarKey : question.conditionalKey
    conditionalHtml = handleConditinalHtmlData(
      type,
      question.conditionalLabelData,
      conditional,
      request
    )
  }
  if (question.ga) {
    await gapiService.processGA(request, question.ga, confirmationId)
  }

  switch (url) {
    case 'check-details': {
      return h.view('check-details', getCheckDetailsModel(request, question, backUrl, nextUrl))
    }
    case 'planning-permission-summary': {
      return h.view('evidence-summary', getEvidenceSummaryModel(request, question, backUrl, nextUrl))
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

const showPostPage = (currentQuestion, request, h) => {
  const { yarKey, answers, baseUrl, ineligibleContent, nextUrl, nextUrlObject, title, type } = currentQuestion
  const NOT_ELIGIBLE = { ...ineligibleContent, backUrl: baseUrl }
  const payload = request.payload

  let thisAnswer
  let dataObject
  if (yarKey === 'consentOptional' && !Object.keys(payload).includes(yarKey)) {
    setYarValue(request, yarKey, '')
  }
  for (const [key, value] of Object.entries(payload)) {
    thisAnswer = answers?.find(answer => (answer.value === value))

    if (type !== 'multi-input' && key !== 'secBtn') {
      setYarValue(request, key, key === 'projectPostcode' ? value.replace(DELETE_POSTCODE_CHARS_REGEX, '').split(/(?=.{3}$)/).join(' ').toUpperCase() : value)
    }
  }
  if (type === 'multi-input') {
    let allFields = currentQuestion.allFields
    if (currentQuestion.costDataKey) {
      allFields = formatOtherItems(request)
    }
    allFields.forEach(field => {
      const payloadYarVal = payload[field.yarKey]
        ? payload[field.yarKey].replace(DELETE_POSTCODE_CHARS_REGEX, '').split(/(?=.{3}$)/).join(' ').toUpperCase()
        : ''
      dataObject = {
        ...dataObject,
        [field.yarKey]: (
          (field.yarKey === 'postcode' || field.yarKey === 'projectPostcode')
            ? payloadYarVal
            : payload[field.yarKey] || ''
        ),
        ...field.conditionalKey ? { [field.conditionalKey]: payload[field.conditionalKey] } : {}
      }
    })
    setYarValue(request, yarKey, dataObject)
  }

  if (title) {
    currentQuestion = {
      ...currentQuestion,
      title: title.replace(SELECT_VARIABLE_TO_REPLACE, (_ignore, additionalYarKeyName) => (
        formatUKCurrency(getYarValue(request, additionalYarKeyName) || 0)
      ))
    }
  }

  const errors = checkErrors(payload, currentQuestion, h, request)
  if (errors) {
    gapiService.sendValidationDimension(request)
    return errors
  }

  if (thisAnswer?.notEligible ||
    (yarKey === 'projectCost' ? !getGrantValues(payload[Object.keys(payload)[0]], currentQuestion.grantInfo).isEligible : null)
  ) {
    gapiService.sendEligibilityEvent(request, !!thisAnswer?.notEligible)
    if (thisAnswer?.alsoMaybeEligible) {
      const {
        dependentQuestionKey,
        dependentQuestionYarKey,
        uniqueAnswer,
        notUniqueAnswer,
        maybeEligibleContent
      } = thisAnswer.alsoMaybeEligible

      const prevAnswer = getYarValue(request, dependentQuestionYarKey)

      const dependentQuestion = ALL_QUESTIONS.find(thisQuestion => (
        thisQuestion.key === dependentQuestionKey &&
        thisQuestion.yarKey === dependentQuestionYarKey
      ))

      let dependentAnswer
      let openMaybeEligible

      if (notUniqueAnswer) {
        dependentAnswer = dependentQuestion.answers.find(({ key }) => (key === notUniqueAnswer)).value
        openMaybeEligible = notUniqueSelection(prevAnswer, dependentAnswer)
      } else if (uniqueAnswer) {
        dependentAnswer = dependentQuestion.answers.find(({ key }) => (key === uniqueAnswer)).value
        openMaybeEligible = uniqueSelection(prevAnswer, dependentAnswer)
      }

      if (openMaybeEligible) {
        maybeEligibleContent.title = currentQuestion.title
        const { url } = currentQuestion
        const MAYBE_ELIGIBLE = { ...maybeEligibleContent, url, backUrl: baseUrl }
        return h.view('maybe-eligible', MAYBE_ELIGIBLE)
      }
    }

    return h.view('not-eligible', NOT_ELIGIBLE)
  } else if (thisAnswer?.redirectUrl) {
    return h.redirect(thisAnswer?.redirectUrl)
  }

  if (yarKey === 'projectCost') {
    const { calculatedGrant, remainingCost } = getGrantValues(payload[Object.keys(payload)[0]], currentQuestion.grantInfo)

    setYarValue(request, 'calculatedGrant', calculatedGrant)
    setYarValue(request, 'remainingCost', remainingCost)
  }

  return h.redirect(getUrl(nextUrlObject, nextUrl, request, payload.secBtn, currentQuestion.url))
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
