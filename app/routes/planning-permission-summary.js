


// const urlPrefix = require('../config/server').urlPrefix

// const viewTemplate = 'planning-permission-summary'
// const currentPath = `${urlPrefix}/${viewTemplate}`
// const nextPath = `${urlPrefix}/planning-permission-summary`



// function createModel(data, _request) {
//     const previousPath = `${urlPrefix}/grid-reference`
//     return {
//     backLink: previousPath,
//     formActionPage: currentPath,
//     ...data
//     }
// }

// module.exports = [{
// method: 'GET',
// path: currentPath,
// options: {
// log: {
//     collect: true
// }
// },
// handler: async (request, h, err) => {
// try {
    
//     //const standardisedCosts = await getStandardisedCosts(request.yar.id)
//     const result = await getStandardisedCosts(request.yar.id)
//     // Following section is covered in messaging/send-message.js
//     // await senders.sendProjectDetails(msgDataToSend, request.yar.id) 
//     console.log(result, '[STANDARDISED COST REQUEST SENT]')

//     //console.log('Response from queues')

//     return h.view(viewTemplate, createModel({ value: '12345' }, request))

// } catch (error) {
//     request.log(error)
// }
// request.log(err)
// return h.view('500')
// }
// },
// {
//     method: 'POST',
//     path: currentPath,
//     handler: (request, h) => {
//     request.yar.set('score-calculated', true)
//     return h.redirect(nextPath)
// }
// }]