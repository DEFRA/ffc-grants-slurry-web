const { formatAnswerArray } = require('./../helpers/reference-grant-amounts-array')
const { formatOtherItems } = require('./../helpers/other-items-sizes')
const { formatUKCurrency } = require('../helpers/data-formats')
const { setYarValue, getYarValue } = require('./session')
const { getQuestionAnswer } = require('../helpers/utils.js')

function isChecked (data, option) {
  return typeof data === 'string' ? !!data && data === option : !!data && data.includes(option)
}

function setOptionsLabel (data, answers, conditionalHtml) {
  return answers.map((answer) => {
    const { value, hint, text, conditional } = answer

    if (value === 'divider') {
      return { divider: 'or' }
    }

    if (!answer.text) {
      return {
        value,
        text: value,
        ...conditional ? { conditional: { html: conditionalHtml } } : {},
        hint,
        checked: isChecked(data, value),
        selected: data === value
      }
    }

    return {
      value,
      text,
      conditional,
      hint,
      checked: isChecked(data, value),
      selected: data === value
    }
  })
}

function setSelectLabels (data, selectList) {
  return [
    { text: 'Select an option', value: '' },
    ...selectList.map((selectValue) => {
      return {
        value: selectValue,
        text: selectValue,
        selected: data === selectValue
      }
    })

  ]
}

const inputOptions = (data, question, conditionalHtml) => {
  const { yarKey, title, hint, answers, classes = 'govuk-fieldset__legend--l' } = question
  return {
    classes,
    id: yarKey,
    name: yarKey,
    fieldset: {
      legend: {
        text: title,
        isPageHeading: true,
        classes
      }
    },
    hint,
    items: setOptionsLabel(data, answers, conditionalHtml)
  }
}

const selectField = (data, question) => {
  const { yarKey, label, hint, answers, classes = 'govuk-fieldset__legend--l' } = question

  return {
    classes,
    id: yarKey,
    name: yarKey,
    label,
    hint,
    items: setSelectLabels(data, answers)
  }
}

const textField = (data, question, _request = null) => {
  const { yarKey, prefix, suffix, label, classes, inputmode, pattern } = question
  return {
    id: yarKey,
    name: yarKey,
    inputmode,
    pattern,
    classes,
    prefix,
    suffix,
    label,
    hint: question.hint,
    value: data || ''
  }
}

const getAllInputs = (data, question, conditionalHtml, request) => {
  if (question?.costDataKey) {
    question.allFields = formatOtherItems(request)
  }

  const { allFields } = question
  let dataObject
  if (!data) {
    allFields.forEach(field => {
      dataObject = {
        ...dataObject,
        [field.yarKey]: ''
      }
    })
    data = dataObject
  }
  return allFields.map((field) => {
    const { type, endFieldset } = field
    let fieldItems
    switch (type) {
      case 'sub-heading':
        fieldItems = { text: field.text }
        break
      case 'text':
        fieldItems = textField(data[field.yarKey], field, request)
        break
      case 'number':
        fieldItems = textField(data[field.yarKey], field, request)
        break
      case 'email':
        fieldItems = textField(data[field.yarKey], field, request)
        break
      case 'tel':
        fieldItems = textField(data[field.yarKey], field, request)
        break
      case 'select':
        fieldItems = selectField(data[field.yarKey], field)
        break
      default:
        fieldItems = inputOptions(data[field.yarKey], field, conditionalHtml)
        break
    }

    return {
      type,
      endFieldset,
      ...fieldItems
    }
  })
}

const getSolidFractionList = (answersList, request) => {
  answersList.splice(2, 3)
  const concreteBunkerStorageOption = answersList.filter(answer => answer.value === 'Concrete bunker')[0]
  // set concrete bunker to be a conditional field answer
  const concreteBunkerStorageOptionIndex = answersList.indexOf(concreteBunkerStorageOption)
  concreteBunkerStorageOption.conditional = true
  answersList[concreteBunkerStorageOptionIndex] = concreteBunkerStorageOption
  // add brakcets around hint text
  answersList.forEach(answer => {
    answer.hint.html = '(' + answer.hint.html + ')'
    if (answer.value === 'Concrete bunker') {
      const cappedAmount = formatUKCurrency(answer.numericalValue * 100)
      setYarValue(request, 'cappedAmount', cappedAmount)
      // add concrete bunker unique hint text before grant amount hint
      answer.hint.html = answer.hint.html + `</br> You can apply for a maximum of 100m² (£${cappedAmount})`
    }
  })

  return answersList
}

shiftAnswersListDefault = (question, answersList) => {
  for (const answer in answersList) {
    question.answers.unshift(answersList[answer])
  } 
  
  return question.answers
}

const shiftSafetyValue = (answersList, request, question) => {
  
  question.answers = [
    {
      value: 'divider'
    },
    {
      key: 'other-items-A15',
      value: 'None of the above',
      redirectUrl: 'project-summary'
    }
  ]

  for (const answer in answersList) {
    // above ground and precast circular are inpsetcion platform only (1 and 2)
    // eart banks and large bvolume are safety only (4, 5 and 7)
    // rest are both (3 and 6)

    if (answersList[answer].value.startsWith('Safety fencing') && (getYarValue(request, 'storageType') === getQuestionAnswer('storage-type', 'storage-type-A1') || getYarValue(request, 'storageType') === getQuestionAnswer('storage-type', 'storage-type-A2'))) {
      console.log('Not needed Safe')
    } else if (answersList[answer].value.startsWith('Inspection platform') && (getYarValue(request, 'storageType') === getQuestionAnswer('storage-type', 'storage-type-A4') || getYarValue(request, 'storageType') === getQuestionAnswer('storage-type', 'storage-type-A5') || getYarValue(request, 'storageType') === getQuestionAnswer('storage-type', 'storage-type-A7') )) {
      console.log('Not needed Inspect')
    } else {
      question.answers.unshift(answersList[answer])
    }
  }

  return question.answers
}

const switchCaseReturns = (data, question, conditionalHtml, request) => {
  switch (question.type) {
    case 'input':
      return textField(data, question)
    case 'email':
      return textField(data, question)
    case 'tel':
      return textField(data, question)
    case 'multi-input':
      return getAllInputs(data, question, conditionalHtml, request)
    case 'select':
      return selectField(data, question)
    default:
      return inputOptions(data, question, conditionalHtml)
  }
}

const getOptions = (data, question, conditionalHtml, request) => {
  if (question?.costDataType) {
    let answersList = formatAnswerArray(request, question.key, question.costDataType, question.hintArray).reverse()
    if (question.yarKey === 'solidFractionStorage' && question.answers.length === 4) {
      question.answers.shift()
      question.answers.shift()
    }

    if (question.answers.length <= 2 && question.key != 'other-items') {
      switch (question.yarKey) {
        case 'coverType':
        case 'exixtsingCoverType':
          question.answers = []
          question.answers = shiftAnswersListDefault(question, answersList)

          break

        case 'separatorType':
          question.answers = []
          answersList.splice(0, 3)
          question.answers = shiftAnswersListDefault(question, answersList)

          break

        case 'solidFractionStorage':
          answersList = getSolidFractionList(answersList, request)
          question.answers = shiftAnswersListDefault(question, answersList)

          break

        case 'gantry':
          let gantryHint = answersList.filter(answer => answer.value === 'Gantry')
          gantryHint = gantryHint[0]
          // add brackets around hint text
          gantryHint.hint.html = '(' + gantryHint.hint.html + ')'
          question.hint = gantryHint.hint

          // answer list not needed here, as gantry page uses yes/no
          break
          
        default:
          question.answers = shiftAnswersListDefault(question, answersList)
          break

      }
      // if (question.yarKey === 'coverType' || question.yarKey === 'existingCoverType') {
      //   question.answers = []
      // }

      // if (question.yarKey === 'separatorType') {
      //   question.answers = []
      //   answersList.splice(0, 3)
      // }

      // if (question.yarKey === 'solidFractionStorage') {
      //   answersList = getSolidFractionList(answersList, request)
      // }

      // if (question.yarKey === 'gantry') {
      //   let gantryHint = answersList.filter(answer => answer.value === 'Gantry')
      //   gantryHint = gantryHint[0]
      //   // add brackets around hint text
      //   gantryHint.hint.html = '(' + gantryHint.hint.html + ')'
      //   question.hint = gantryHint.hint

      //   // answer list not needed here, as gantry page uses yes/no
      // } else {
      //   question.answers = shiftAnswersListDefault(question, answersList)
      // }
    } else if (question.key === 'other-items') {
      // other items has to be generated each time just in case

      question.answers = shiftSafetyValue(answersList, request, question)
    }
  }

  return switchCaseReturns(data, question, conditionalHtml, request)
}

module.exports = {
  getOptions,
  setOptionsLabel
}
