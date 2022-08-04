const { getUrl } = require('../helpers/urls')
const { getOptions } = require('../helpers/answer-options')
const { getYarValue } = require('../helpers/session')
const { getQuestionByKey, allAnswersSelected } = require('../helpers/utils')

const getPrefixSufixString = (prefixSufix, selectedValueOfLinkedQuestion) => {
  if (prefixSufix.linkedPrefix || prefixSufix.linkedSufix) {
    selectedValueOfLinkedQuestion = prefixSufix.linkedPrefix.concat(selectedValueOfLinkedQuestion)
  }
  if (prefixSufix.linkedSufix) {
    selectedValueOfLinkedQuestion = selectedValueOfLinkedQuestion.concat(prefixSufix.linkedSufix)
  }
  return selectedValueOfLinkedQuestion
}

const answerSelect = (selectedAnswers) => {
  if (selectedAnswers === 'I already have an impermeable cover') {
    return ['Not Needed']
  } else if (selectedAnswers) {
    return [selectedAnswers].flat()
  }
}

const coverNeededCheck = (currentValue, request) => {
  const yarKey = getQuestionByKey('cover').yarKey
  const selectedAnswer = getYarValue(request, yarKey)

  if (selectedAnswer === 'Not needed, the slurry is treated with acidification') {
    return ['Not Needed']
  } else {
    return currentValue
  }
}

const getDependentSideBar = (sidebar, request) => {
  const { values, dependentQuestionKeys } = sidebar
  dependentQuestionKeys.forEach((dependentQuestionKey, index) => {
    const yarKey = getQuestionByKey(dependentQuestionKey).yarKey
    const selectedAnswers = getYarValue(request, yarKey)

    values[index].content[0].items = answerSelect(selectedAnswers)

    if (dependentQuestionKey === 'cover-type') {
      values[index].content[0].items = coverNeededCheck(values[index].content[0].items, request)
    }

    if (sidebar.linkedQuestionkey && index < sidebar.linkedQuestionkey.length && values[index].content[0].items[0] != 'Not Needed') {
      const yarValueOfLinkedQuestion = getQuestionByKey(sidebar.linkedQuestionkey[index]).yarKey
      let selectedValueOfLinkedQuestion = getYarValue(request, yarValueOfLinkedQuestion)

      if (selectedValueOfLinkedQuestion && sidebar.prefixSufix) {
        selectedValueOfLinkedQuestion = getPrefixSufixString(sidebar.prefixSufix[index], selectedValueOfLinkedQuestion)
      }

      if (selectedValueOfLinkedQuestion) {
        values[index].content[0].items.push(selectedValueOfLinkedQuestion)
      }
    }
  })
  return {
    ...sidebar
  }
}

const getBackUrl = (hasScore, backUrlObject, backUrl, request) => {
  const url = getUrl(backUrlObject, backUrl, request)
  return hasScore && (url === 'remaining-costs') ? null : url
}

const showBackToDetailsButton = (key, request) => {
  switch (key) {
    case 'farmer-details':
    case 'business-details':
    case 'applicant-details':
    case 'agent-details':
    case 'score': {
      return !!getYarValue(request, 'reachedCheckDetails')
    }
    default:
      return false
  }
}

const showBackToEvidenceSummaryButton = (key, request) => {
  switch (key) {
    case 'planning-permission':
    case 'planning-permission-evidence':
    case 'grid-reference': {
      return !!getYarValue(request, 'reachedEvidenceSummary')
    }
    default:
      return false
  }
}

const getModel = (data, question, request, conditionalHtml = '') => {
  let { type, backUrl, key, backUrlObject, sidebar, title, hint, score, label, warning, warningCondition } = question
  const hasScore = !!getYarValue(request, 'current-score')

  title = title ?? label?.text

  const sideBarText = (sidebar?.dependentQuestionKeys)
    ? getDependentSideBar(sidebar, request)
    : sidebar

  let warningDetails
  if (warningCondition) {
    const { dependentWarningQuestionKey, dependentWarningAnswerKeysArray } = warningCondition
    if (allAnswersSelected(request, dependentWarningQuestionKey, dependentWarningAnswerKeysArray)) {
      warningDetails = warningCondition.warning
    }
  } else if (warning) {
    warningDetails = warning
  }
  return {
    type,
    key,
    title,
    hint,
    backUrl: getBackUrl(hasScore, backUrlObject, backUrl, request),
    items: getOptions(data, question, conditionalHtml, request),
    sideBarText,
    ...(warningDetails ? ({ warning: warningDetails }) : {}),
    reachedCheckDetails: showBackToDetailsButton(key, request),
    reachedEvidenceSummary: showBackToEvidenceSummaryButton(key, request),
    diaplaySecondryBtn: hasScore && score?.isDisplay
  }
}

module.exports = {
  getModel
}
