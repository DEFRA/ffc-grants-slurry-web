function formatAnswerArray(object, key, objectKey) {

    let returnArray = []

    for (i=0; i <= object.data.desirability.catagories.length; i++){

        let counter = 1

        if (object.data.desirability.catagories[i].key == objectKey) {

            let tempObject

            for (j=0; j <= object.data.desirability.catagories[i].items.length - 1; j++) {

                tempObject = {
                    key: key + '-A' + counter,
                    value: object.data.desirability.catagories[i].items[j].item,
                    hint: {
                        text: 'Grant amount: £' + object.data.desirability.catagories[i].items[j].amount + ' ' + object.data.desirability.catagories[i].items[j].unit
                    }
                }

                returnArray.push(tempObject)

                console.log(returnArray)

                counter += 1
            }
            
            break
        }

    }
    
    return returnArray
}

module.exports = {
    formatAnswerArray
}