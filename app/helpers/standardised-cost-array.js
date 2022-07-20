function formatAnswerArray(request, key, objectKey){

    let object = request.yar.get('standardisedCostObject')

    let returnArray = []

    if (object && object.data){

        for (let i=0; i <= object.data.desirability.catagories.length; i++){

            if (object.data.desirability.catagories[i].key == objectKey) {

                let tempObject

                for (let j=0; j <= object.data.desirability.catagories[i].items.length - 1; j++) {

                    tempObject = {
                        value: key + '-A' + (j+1),
                        text: object.data.desirability.catagories[i].items[j].item,
                        hint: {
                            text: 'Grant amount: £' + object.data.desirability.catagories[i].items[j].amount + ' ' + object.data.desirability.catagories[i].items[j].unit
                        }
                    }

                    returnArray.push(tempObject)

                }
                
                break
            }

        }
        
    }

    return returnArray

}

module.exports = {
    formatAnswerArray
}