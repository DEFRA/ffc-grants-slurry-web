function formatAnswerArray(object, key, objectKey){

    let returnArray = []

    if (object && object.data){

        for (let i=0; i <= object.data.desirability.catagories.length; i++){

            if (object.data.desirability.catagories[i].key == objectKey) {

                let tempObject

                for (let j=0; j <= object.data.desirability.catagories[i].items.length - 1; j++) {

                    tempObject = {
                        key: key + '-A' + (j+1),
                        value: object.data.desirability.catagories[i].items[j].item,
                        hint: {
                            text: 'Grant amount: £' + object.data.desirability.catagories[i].items[j].amount + ' ' + object.data.desirability.catagories[i].items[j].unit
                        }
                    }

                    returnArray.push(tempObject)

                    console.log(returnArray)

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