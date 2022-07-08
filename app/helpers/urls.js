const urlPrefix = require('../config/server').urlPrefix
const { getYarValue } = require('../helpers/session')
const { ALL_QUESTIONS } = require('../config/question-bank')

const getUrl = (urlObject, url, request, secBtn) => {
  const scorePath = `${urlPrefix}/score`
  const chekDetailsPath = `${urlPrefix}/check-details`
  const evidenceSummaryPath = `${urlPrefix}/evidence-summary`
  const secBtnPath = secBtn === 'Back to score' ? scorePath : chekDetailsPath
  
  if (!urlObject) {
    return secBtn ? secBtnPath : url
  }
  const { dependentQuestionYarKey, dependentAnswerKeysArray, urlOptions } = urlObject
  const { thenUrl, elseUrl, nonDependentUrl } = urlOptions

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
