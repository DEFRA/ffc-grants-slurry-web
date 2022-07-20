function formatAnswerArray(request, key, objectKey){

    let object = request.yar.get('standardisedCostObject')

    let returnArray = []

    console.log(object)

    if (object?.data){

        let keyToFind = object.data.desirability.catagories.find(({key}) => key == objectKey)

        let tempObject

        for (answer in keyToFind.items) {

            tempObject = {
                value: key + '-A' + (parseInt(answer)+1),
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