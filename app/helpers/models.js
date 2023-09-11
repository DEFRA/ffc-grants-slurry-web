const { getUrl } = require('../helpers/urls')
const { getOptions } = require('../helpers/answer-options')
const { getYarValue, setYarValue } = require('../helpers/session')
const { getQuestionByKey, allAnswersSelected } = require('../helpers/utils')
const { formatUKCurrency } = require('../helpers/data-formats')

const getPrefixSufixString = (prefixSufix, selectedValueOfLinkedQuestion) => {
  if (prefixSufix.linkedPrefix || prefixSufix.linkedSufix) {
    selectedValueOfLinkedQuestion = prefixSufix.linkedPrefix.concat(selectedValueOfLinkedQuestion)
  }
  if (prefixSufix.linkedSufix) {
    selectedValueOfLinkedQuestion = selectedValueOfLinkedQuestion.concat(prefixSufix.linkedSufix)
  }
  return selectedValueOfLinkedQuestion
}

const getDependentSideBar = (sidebar, request) => {
  const { values, dependentQuestionKeys } = sidebar
  dependentQuestionKeys.forEach((dependentQuestionKey, index) => {
    const yarKey = getQuestionByKey(dependentQuestionKey).yarKey
    const selectedAnswers = getYarValue(request, yarKey)

    if (selectedAnswers === null) {
      
      // dependentQuestionKeys.slice(dependentQuestionKeys[dependentQuestionKey])
      values[index].heading = null
      values[index].content.slice()

    } else {
    
        values[index].content[0].items = [selectedAnswers].flat()
  
        if (sidebar.linkedQuestionyarkey && index < sidebar.linkedQuestionyarkey.length) {
          // const yarValueOfLinkedQuestion = getQuestionByKey(sidebar.linkedQuestionkey[index]).yarKey
          let selectedValueOfLinkedQuestion = getYarValue(request, sidebar.linkedQuestionyarkey[index])
    
          if (selectedValueOfLinkedQuestion && sidebar.prefixSufix) {
            selectedValueOfLinkedQuestion = getPrefixSufixString(sidebar.prefixSufix[index], formatUKCurrency(selectedValueOfLinkedQuestion))

          }

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
  return url
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
