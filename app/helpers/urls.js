const urlPrefix = require('../config/server').urlPrefix
const { getYarValue } = require('../helpers/session')
const { ALL_QUESTIONS } = require('../config/question-bank')

const getUrl = (urlObject, url, request, secBtn, currentUrl) => {
  const scorePath = `${urlPrefix}/score`
  const chekDetailsPath = `${urlPrefix}/check-details`

  let secBtnPath
  if (secBtn === 'Back to score') {
    secBtnPath = scorePath
  } else {
    switch (currentUrl) {
      case 'planning-permission':
      case 'planning-permission-evidence':
      case 'grid-reference': {
        secBtnPath = `${urlPrefix}/planning-permission-summary`
        break
      }
      default:
        secBtnPath = chekDetailsPath
    }
  }

  if (!urlObject) {
    return secBtn ? secBtnPath : url
  }
  const { dependentQuestionYarKey, dependentAnswerKeysArray, urlOptions } = urlObject
  const { thenUrl, elseUrl, nonDependentUrl } = urlOptions

  if (Array.isArray(dependentQuestionYarKey) == true) {

    const dependentAnswerOne = getYarValue(request, dependentQuestionYarKey[0])

    const dependentAnswerTwo = getYarValue(request, dependentQuestionYarKey[1])

    if (dependentAnswerOne == 'Not needed, the slurry is treated with acidification') {
      return nonDependentUrl
    } else if (dependentAnswerTwo == 'I already have an impermeable cover') {
      return thenUrl
    }

    return elseUrl

  }

  const dependentAnswer = getYarValue(request, dependentQuestionYarKey)

  const selectThenUrl = ALL_QUESTIONS.find(thisQuestion => (
    thisQuestion.yarKey === dependentQuestionYarKey &&
    thisQuestion.answers &&
    thisQuestion.answers.some(answer => (
      !!dependentAnswer &&
      dependentAnswerKeysArray.includes(answer.key) &&
      dependentAnswer.includes(answer.value)
    ))
  ))
  const selectedElseUrl = dependentAnswer ? elseUrl : nonDependentUrl

  return selectThenUrl ? thenUrl : selectedElseUrl
}

module.exports = {
  getUrl
}
