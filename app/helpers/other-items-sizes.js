const {
  WHOLE_NUMBER_REGEX
} = require('./regex')

function formatOtherItems (request) {
  const object = request.yar.get('standardisedCostObject')
  const otherItemsArray = request.yar.get('otherItems')

  const listOfCatagories = ['cat-reception-pit-type', 'cat-pump-type', 'cat-pipework', 'cat-transfer-channels', 'cat-agitator', 'cat-safety-equipment']

  const returnArray = []

  if (object?.data && otherItemsArray.length > 0) {
    otherItemsArray.forEach((otherItem, index) => {
      for (const catagory in listOfCatagories) {
        const keyToFind = object.data.desirability.catagories.find(({ key }) => key == listOfCatagories[catagory])

        keyToFind.items.forEach((item) => {
          if (item.item == otherItem) {
            let suffixValue
            let errorType
            let keyTitle

            // add correct suffix value to input field
            if (item.unit == 'per cubic metre') {
              suffixValue = 'm³'
            } else if (item.unit == 'per metre') {
              suffixValue = 'metre(s)'
            } else {
              suffixValue = 'item (s)' // per pump, per tank and per item
            }

            // format key name for NOT_EMPTY validation
            if (keyToFind.title == 'Reception pit type') {
              keyTitle = 'plastic reception pit'
            } else if (keyToFind.title == 'Pump type') {
              keyTitle = 'pump'
            } else {
              keytitle = keyToFind.title.toLowerCase()
            }

            // add volume/quantity based on catagory (for validation)
            if (listOfCatagories[catagory] in ['cat-reception-pit-type', 'cat-pipework', 'cat-transfer-channels']) {
              errorType = 'Volume'
            } else {
              errorType = 'Quantity'
            }

            // format object
            const tempObject = {
              yarKey: item.item.replace(/[- )(]/g, ''), // Could add key to db list, to be used for populating yar?
              type: 'number',
              suffix: { text: suffixValue },
              hint: {
                text: 'Enter ' + errorType.toLowerCase() + ' (grant amount: £' + item.amount + ' ' + item.unit + ')'
              },
              classes: 'govuk-input--width-10',
              label: {
                text: item.item, // needs to be bold
                classes: 'govuk-label'
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
                  max: 999999999,
                  error: errorType + ' must be between 1-9999999999'
                }
              ]
            }

            returnArray.push(tempObject)
          }
        })
      }
    })

    console.log(returnArray, 'JDBFSBFES')

    return returnArray
  }
}

module.exports = {
  formatOtherItems
}
