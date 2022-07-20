function formatAnswerArray (request, questionKey, objectKey) {
  const object = request.yar.get('standardisedCostObject')

  const returnArray = []

  if (object?.data) {
    const keyToFind = object.data.desirability.catagories.find(({ key }) => key == objectKey)

    let tempObject

    for (const answer in keyToFind.items) {
      tempObject = {
        value: questionKey + '-A' + (parseInt(answer) + 1),
        text: keyToFind.items[answer].item,
        hint: {
          text: 'Grant amount: £' + keyToFind.items[answer].amount + ' ' + keyToFind.items[answer].unit
        }
      }

      returnArray.push(tempObject)
    }
  }

  return returnArray
}

module.exports = {
  formatAnswerArray
}
