const {
  WHOLE_NUMBER_REGEX
} = require('./regex')

const formatTempObject = (item, keyTitle, suffixValue, catagoryData) => {
  if (item.item === 'Inspection platform with ladder for above-ground concrete and steel slurry store') {
    catagoryData.inputLength = 4
  }

  const maxValue = catagoryData.inputLength === 4 ? 9999 : 9999999999

  return {
    yarKey: item.item.replace(/[- ,)(]/g, ''), // Could add key to db list, to be used for populating yar?
    type: 'number',
    suffix: { text: suffixValue },
    hint: {
      text: `Grant amount: £${item.amount} ${item.unit}`
    },
    classes: `govuk-input--width-${catagoryData.inputLength}`,
    label: {
      text: item.item,
      classes: 'govuk-label--m'
    },
    validate: [
      {
        type: 'NOT_EMPTY',
        error: `Enter ${keyTitle} ${catagoryData.errorType.toLowerCase()}`
      },
      {
        type: 'REGEX',
        regex: WHOLE_NUMBER_REGEX,
        error: `${catagoryData.errorType} must be a whole number`
      },
      {
        type: 'MIN_MAX',
        min: 1,
        max: maxValue,
        error: `${catagoryData.errorType} must be between 1-${maxValue}`
      }
    ]
  }
}

function suffixGenerator (unit) {
  // add correct suffix value to input field
  if (unit === 'per cubic metre') {
    return 'm³'
  } else if (unit === 'per metre') {
    return 'metre(s)'
  } else {
    return 'item (s)' // per pump, per tank and per item
  }
}

function keyGenerator (title) {
  // format key name for NOT_EMPTY validation
  if (title === 'Reception pit type') {
    return 'plastic reception pit'
  } else if (title === 'Pump type') {
    return 'pump'
  } else {
    return title.toLowerCase()
  }
}

function getErrorUnitAndLength (catagory) {
  const volumeArray = ['cat-reception-pit-type', 'cat-pipework', 'cat-transfer-channels']
  const inputLengthFour = ['cat-pump-type', 'cat-agitator']
  const errorType = volumeArray.includes(catagory) ? 'Volume' : 'Quantity'
  const inputLength = inputLengthFour.includes(catagory) ? 4 : 10

  return { errorType: errorType, inputLength: inputLength }
}

function formatOtherItems (request) {
  const object = request.yar.get('standardisedCostObject')
  const otherItemsArray = [request.yar.get('otherItems')].flat()
  const listOfCatagories = ['cat-reception-pit-type', 'cat-pump-type', 'cat-pipework', 'cat-transfer-channels', 'cat-agitator', 'cat-safety-equipment']

  const returnArray = []

  if (object?.data && otherItemsArray.length > 0) {
    otherItemsArray.forEach((otherItem, _index) => {
      for (const catagory in listOfCatagories) {
        const selectedCatagory = object.data.desirability.catagories.find(({ key }) => key === listOfCatagories[catagory])

        selectedCatagory.items.forEach((item) => {
          if (item.item === otherItem) {
            const suffixValue = suffixGenerator(item.unit)
            const keyTitle = keyGenerator(selectedCatagory.title)
            const catagoryData = getErrorUnitAndLength(listOfCatagories[catagory])

            const tempObject = formatTempObject(item, keyTitle, suffixValue, catagoryData)

            returnArray.push(tempObject)
          }
        })
      }
    })
  }

  return returnArray
}

module.exports = {
  formatOtherItems
}
