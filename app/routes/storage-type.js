
const urlPrefix = require('../config/server').urlPrefix

const viewTemplate = 'storage-type'
const currentPath = `${urlPrefix}/${viewTemplate}`
const nextPath = `${urlPrefix}/standard-costs`

function createModel(data, _request) {
    const previousPath = `${urlPrefix}/standardised-cost`

    return {
        backLink: previousPath,
        formActionPage: currentPath,
        ...data
    }
}

module.exports = [{
    method: 'GET',
    path: currentPath,
    options: {
        log: {
            collect: true
        }
    },
    handler: async (request, h, err) => {
        try {
            console.log('Sending session message .....')

            const standardisedCostObject = request.yar.get('standardisedCostObject')

            const answersList = formatAnswerArray(standardisedCostObject, 'store-type', 'cat-storage')

            return h.view(viewTemplate, createModel(answersList, request))
        } catch (error) {
            request.log(error)
        }
        request.log(err)
        return h.view('500')
    }
},
{
    method: 'POST',
    path: currentPath,
    handler: (request, h) => {
        // request.yar.set('score-calculated', true)
        return h.redirect(nextPath)
    }
}]
