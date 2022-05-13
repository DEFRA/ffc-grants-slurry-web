const { getUrl } = require('../helpers/urls')
const { getOptions } = require('../helpers/answer-options')
const { getYarValue } = require('../helpers/session')
const { getQuestionByKey, allAnswersSelected } = require('../helpers/utils')

const getDependentSideBar = (sidebar, request) => {
  // sidebar contains values of a previous page

  const { values, dependentYarKeys, dependentQuestionKeys } = sidebar
  // for each dependentQuestionKeys
  const updatedValues = []
  let addUpdatedValue
  let updatedContent
  dependentQuestionKeys.forEach((dependentQuestionKey, index) => {
    const questionAnswers = getQuestionByKey(dependentQuestionKey).answers
    const yarValue = getYarValue(request, dependentYarKeys[index]) || []

    values.forEach((thisValue) => {
      addUpdatedValue = false
      updatedContent = thisValue.content.map(thisContent => {
        let formattedSidebarValues = []
        let formattedValue = ''

        if (thisContent?.dependentAnswerExceptThese?.length) {
          const avoidThese = thisContent.dependentAnswerExceptThese

          questionAnswers.forEach(({ key, value, sidebarFormattedValue }) => {
            formattedValue = value

            if (sidebarFormattedValue) {
              formattedValue = sidebarFormattedValue
            }

            if (!avoidThese.includes(key) && yarValue?.includes(value)) {
              if (updatedValues.length && updatedValues[0].heading === thisValue.heading) {
                updatedValues[0].content[0].items.push(formattedValue)
              } else {
                addUpdatedValue = true
                formattedSidebarValues.push(formattedValue)
              }
            }
          })
        } else if (thisContent?.dependentAnswerOnlyThese?.length) {
          const addThese = thisContent.dependentAnswerOnlyThese

          questionAnswers.forEach(({ key, value, sidebarFormattedValue }) => {
            formattedValue = value

            if (sidebarFormattedValue) {
              formattedValue = sidebarFormattedValue
            }

            if (addThese.includes(key) && yarValue?.includes(value)) {
              addUpdatedValue = true
              formattedSidebarValues.push(formattedValue)
            }
          })
        } else {
          formattedSidebarValues = [].concat(yarValue)
        }
        return {
          ...thisContent,
          items: formattedSidebarValues
        }
      })
      if (addUpdatedValue) {
        updatedValues.push({
          ...thisValue,
          content: updatedContent
        })
      }
    })
  })

  return {
    ...sidebar,
    values: updatedValues
  }
}

const getBackUrl = (hasScore, backUrlObject, backUrl, request) => {
  const url = getUrl(backUrlObject, backUrl, request)
  return hasScore && (url === 'remaining-costs') ? null : url
}

const getModel = (data, question, request, conditionalHtml = '') => {
  let { type, backUrl, key, backUrlObject, sidebar, title, score, label, warning, warningCondition } = question
  const hasScore = !!getYarValue(request, 'current-score')

  title = title ?? label?.text

  const sideBarText = (sidebar?.dependentYarKeys)
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
    backUrl: getBackUrl(hasScore, backUrlObject, backUrl, request),
    items: getOptions(data, question, conditionalHtml, request),
    sideBarText,
    ...(warningDetails ? ({ warning: warningDetails }) : {}),
    diaplaySecondryBtn: hasScore && score?.isDisplay
  }
}

module.exports = {
  getModel
}
