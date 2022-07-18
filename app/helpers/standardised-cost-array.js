function formatAnswerArray(object, key, objectKey){

    let returnArray = []

    console.log('[IN HERE]')

    if (object && object.data){

        for (let i=0; i <= object.data.desirability.catagories.length; i++){

            console.log('[FOR 1]')

            if (object.data.desirability.catagories[i].key == objectKey) {

                let tempObject

                for (let j=0; j <= object.data.desirability.catagories[i].items.length - 1; j++) {

                    console.log('[FOR 2]')

                    tempObject = {
                        value: key + '-A' + (j+1),
                        text: object.data.desirability.catagories[i].items[j].item,
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