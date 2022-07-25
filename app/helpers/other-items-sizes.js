const {
  WHOLE_NUMBER_REGEX
} = require('./regex')

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

function errorGenerator (catagory) {
  // add volume/quantity based on catagory (for validation)
  if (['cat-reception-pit-type', 'cat-pipework', 'cat-transfer-channels'].indexOf(catagory) >= 0) {
    return 'Volume'
  } else {
    return 'Quantity'
  }
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
            const errorType = errorGenerator(listOfCatagories[catagory])

            // format object
            const tempObject = {
              yarKey: item.item.replace(/[- ,)(]/g, ''), // Could add key to db list, to be used for populating yar?
              type: 'number',
              suffix: { text: suffixValue },
              hint: {
                text: 'Grant amount: £' + item.amount + ' ' + item.unit
              },
              classes: 'govuk-input--width-10',
              label: {
                text: item.item, // needs to be bold
                classes: 'govuk-label--m'
              },
              validate: [ // these aren't triggering, but are all properly formatted
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter ' + keyTitle + ' ' + errorType.toLowerCase()
                },
                {
                  type: 'REGEX',
                  regex: WHOLE_NUMBER_REGEX,
                  error: errorType + ' must be a whole number'
                },
                {
                  type: 'MIN_MAX',
                  min: 1,
                  max: 9999999999,
                  error: errorType + ' must be between 1-9999999999'
                }
              ]
            }

            returnArray.push(tempObject)
          }
        })
      }
    })
  }

  console.log(returnArray, 'JDBFSBFES')
  return returnArray
}

module.exports = {
  formatOtherItems
}
