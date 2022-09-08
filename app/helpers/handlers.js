const { getYarValue, setYarValue } = require('../helpers/session')
const { getModel } = require('../helpers/models')
const { checkErrors } = require('../helpers/errorSummaryHandlers')
const { getGrantValues } = require('../helpers/grants-info')
const { formatUKCurrency } = require('../helpers/data-formats')
const { SELECT_VARIABLE_TO_REPLACE, DELETE_POSTCODE_CHARS_REGEX } = require('../helpers/regex')
const { getUrl } = require('../helpers/urls')
const { guardPage } = require('../helpers/page-guard')
const { notUniqueSelection, uniqueSelection } = require('../helpers/utils')
const senders = require('../messaging/senders')
const createMsg = require('../messaging/create-msg')
const gapiService = require('../services/gapi-service')
const { startPageUrl } = require('../config/server')
const { ALL_QUESTIONS } = require('../config/question-bank')
const { formatOtherItems } = require('./../helpers/other-items-sizes')

const {
  getConfirmationId,
  handleConditinalHtmlData,
  getCheckDetailsModel,
  getEvidenceSummaryModel,
  getDataFromYarValue,
  getConsentOptionalData
} = require('./pageHelpers')

const setGrantsData = (question, request) => {
  if (question.grantInfo) {
    const { calculatedGrant, remainingCost } = getGrantValues(getYarValue(request, 'itemsTotalValue'), question.grantInfo)
    setYarValue(request, 'calculatedGrant', calculatedGrant)
    setYarValue(request, 'remainingCost', remainingCost)
  }
};

const sendContactDetails = async (request) => {
  try {
    await senders.sendContactDetails(createMsg.getAllDetails(request, confirmationId), request.yar.id)
    await gapiService.sendDimensionOrMetrics(request, [ {
      dimensionOrMetric: gapiService.dimensions.CONFIRMATION,
      value: confirmationId
    }, {
      dimensionOrMetric: gapiService.dimensions.FINALSCORE,
      value: getYarValue(request, 'current-score')
    },
    {
      dimensionOrMetric: gapiService.metrics.CONFIRMATION,
      value: 'TIME'
    }
    ])
    console.log('Confirmation event sent')
  } catch (err) {
    console.log('ERROR: ', err)
  }
}

const setTitle = async (title, question, request) => {
  if (title) {
    return {
      ...question,
      title: title.replace(SELECT_VARIABLE_TO_REPLACE, (_ignore, additionalYarKeyName) => (
        formatUKCurrency(getYarValue(request, additionalYarKeyName) || 0)
      ))
    }
  }
}
const processGA = async (question, request, confirmationId) => {
  if (question.ga) {
    await gapiService.processGA(request, question.ga, confirmationId)
  }
}

const addConsentOptionalData = async (url, request) => {
  if (url === 'confirm') {
    const consentOptional = getYarValue(request, 'consentOptional')
    return getConsentOptionalData(consentOptional)
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
  setGrantsData(question, request);

  if (url === 'potential-amount' && (!getGrantValues(getYarValue(request, 'itemsTotalValue'), question.grantInfo).isEligible)) {
    const NOT_ELIGIBLE = { ...question.ineligibleContent, backUrl }
    gapiService.sendEligibilityEvent(request, 'true')
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
      await sendContactDetails(request);

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

    consentOptionalData = await addConsentOptionalData(url, request)

    const MAYBE_ELIGIBLE = { ...maybeEligibleContent, consentOptionalData, url, nextUrl, backUrl }
    return h.view('maybe-eligible', MAYBE_ELIGIBLE)
  }

  await setTitle(title, question, request);

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

  await processGA(question, request, confirmationId)

  switch (url) {
    case 'check-details': {
      return h.view('check-details', getCheckDetailsModel(request, question, backUrl, nextUrl))
    }
    case 'planning-permission-summary': {
      const evidenceSummaryModel = getEvidenceSummaryModel(request, question, backUrl, nextUrl)
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

const showPostPage = (currentQuestion, request, h) => {
  const { yarKey, answers, baseUrl, ineligibleContent, nextUrl, nextUrlObject, title, type } = currentQuestion
  const NOT_ELIGIBLE = { ...ineligibleContent, backUrl: baseUrl }
  const payload = request.payload

  let thisAnswer
  let dataObject

  if (yarKey === 'consentOptional' && !Object.keys(payload).includes(yarKey)) {
    setYarValue(request, yarKey, '')
  }
  for (const [ key, value ] of Object.entries(payload)) {
    thisAnswer = answers?.find(answer => (answer.value === value))
    if (yarKey === 'cover' && thisAnswer.key === 'cover-A2') {
      request.yar.set('coverType', '')
      request.yar.set('coverSize', '')
    }

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
      const payloadYarVal = payload[ field.yarKey ]
        ? payload[ field.yarKey ].replace(DELETE_POSTCODE_CHARS_REGEX, '').split(/(?=.{3}$)/).join(' ').toUpperCase()
        : ''
      dataObject = {
        ...dataObject,
        [ field.yarKey ]: (
          (field.yarKey === 'postcode' || field.yarKey === 'projectPostcode')
            ? payloadYarVal
            : payload[ field.yarKey ] || ''
        ),
        ...field.conditionalKey ? { [ field.conditionalKey ]: payload[ field.conditionalKey ] } : {}
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

  if (thisAnswer?.notEligible) {
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
