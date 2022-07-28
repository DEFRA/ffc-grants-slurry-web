// format table for proejct-summary

/* [
    {
        item: item,
        amount: £34,
        quantity: 145m^3, //alternatively m^2 or no units
        total: £4321
    }
] */

// need to pull all details from standardised cost array (again)
// Pull storage-type and multiply by storage-size
// pull cover-type and multiply by cover size
// pull all other items and multiply by each individual other item size
// get relevant units for quantity and amounts per unit based on array (again)
// calculate and format into list as above

function suffixGenerator (unit) {
  // add correct suffix value to input field
  if (unit === 'per cubic metre') {
    return 'm³'
  } else if (unit === 'per metre') {
    return 'm'
  } else {
    return '' // per pump, per tank and per item
  }
}

function formatSummaryTable (request) {
  const object = request.yar.get('standardisedCostObject')
  const storageType = request.yar.get('storageType')
  const storageSize = request.yar.get('serviceCapacityIncrease')
  const coverType = request.yar.get('coverType')
  const coverSize = request.yar.get('coverSize')
  const otherItemsArray = [request.yar.get('otherItems')].flat()

  const listOfCatagories = ['cat-reception-pit-type', 'cat-pump-type', 'cat-pipework', 'cat-transfer-channels', 'cat-agitator', 'cat-safety-equipment']

  const returnArray = []

  let totalCalculator = 0
  let total

  if (object?.data && otherItemsArray.length > 0 && otherItemsArray[0] != 'None of the above') {
    // pull otherItemsSizes object. Can only be done after checking if other items has data
    const otherItemSizes = [request.yar.get('itemSizeQuantities')].flat()

    // create storage object
    const storageKey = object.data.desirability.catagories.find(({ key }) => key === 'cat-storage')

    const storageData = storageKey.items.find(({ item }) => item === storageType)

    total = (storageSize * storageData.amount)

    returnArray.push({
      item: storageType,
      amount: '£' + storageData.amount,
      quantity: storageSize + 'm³',
      total: '£' + total
    })

    totalCalculator += total

    // create cover object
    const coverKey = object.data.desirability.catagories.find(({ key }) => key === 'cat-cover-type')

    const coverData = coverKey.items.find(({ item }) => item === coverType)

    total = (coverSize * coverData.amount)

    returnArray.push({
      item: coverType,
      amount: '£' + coverData.amount,
      quantity: coverSize + 'm²',
      total: '£' + total
    })

    totalCalculator += total

    // create all objects needed for other items
    otherItemsArray.forEach((otherItem, _index) => {
      const createdKey = otherItem.replace(/[- ,)(]/g, '')

      const correctSize = otherItemSizes[0][createdKey]

      for (const catagory in listOfCatagories) {
        const selectedCatagory = object.data.desirability.catagories.find(({ key }) => key === listOfCatagories[catagory])

        selectedCatagory.items.forEach((item) => {
          if (item.item === otherItem) {
            const unit = suffixGenerator(item.unit)

            total = (correctSize * item.amount)

            returnArray.push({
              item: otherItem,
              amount: '£' + item.amount,
              quantity: correctSize + unit,
              total: '£' + total
            })

            totalCalculator += total
          }
        })
      }
    })
  }

  request.yar.set('itemsTotalValue', totalCalculator)

  return returnArray
}

module.exports = {
  formatSummaryTable
}
