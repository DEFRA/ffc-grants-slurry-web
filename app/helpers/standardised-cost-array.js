function formatAnswerArray (request, questionKey, objectKey) {
  const object = request.yar.get('standardisedCostObject')

  const returnArray = []

  let listOfCatagories

  let counter = 1

  if (object?.data) {
    if (objectKey == 'other') {
      listOfCatagories = ['cat-reception-pit-type', 'cat-pump-type', 'cat-pipework', 'cat-transfer-channels', 'cat-agitator', 'cat-safety-equipment']
    } else {
      listOfCatagories = [objectKey]
    }

    for (const catagory in listOfCatagories) {
      const keyToFind = object.data.desirability.catagories.find(({ key }) => key == listOfCatagories[catagory])

      let tempObject

      for (const answer in keyToFind.items) {
        tempObject = {
          key: questionKey + '-A' + (counter),
          value: keyToFind.items[answer].item,
          sidebarFormattedValue: keyToFind.items[answer].item,
          hint: {
            text: 'Grant amount: £' + keyToFind.items[answer].amount + ' ' + keyToFind.items[answer].unit
          }
        }

        counter += 1

        returnArray.push(tempObject)
      }
    }
  }

  return returnArray
}

module.exports = {
  formatAnswerArray
}
