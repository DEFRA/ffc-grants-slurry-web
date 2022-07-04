
const pollingConfig = require('../config/polling')

const { getStandardisedCosts } = require('../messaging/application')

const urlPrefix = require('../config/server').urlPrefix

const viewTemplate = 'standardised-costs'
const currentPath = `${urlPrefix}/${viewTemplate}`
const nextPath = `${urlPrefix}/standard-costs`

function createModel (data, _request) {
  const previousPath = `${urlPrefix}/cover`

  return {
    backLink: previousPath,
    formActionPage: currentPath,
    ...data
  }
}

async function getResult (correlationId) {
  const url = `${pollingConfig.host}/desirability-score?correlationId=${correlationId}`
  console.log('polling Url: ', url)

  console.log(`Tried getting score ${pollingConfig.retries} times, giving up`)
  return null
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
    //   console.log('Getting Desirability Answers .....')
    console.log('Sending session message .....')

    const standardisedCosts = await getStandardisedCosts(sessionId)
      
    // Following section is covered in messaging/send-message.js
      // await senders.sendProjectDetails(msgDataToSend, request.yar.id) 
      console.log('[STANDARDISED COST REQUEST SENT]')

      console.log('Response from queues', standardisedCosts)

      return h.view(viewTemplate, createModel({value: '12345'}, request))

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
    request.yar.set('score-calculated', true)
    return h.redirect(nextPath)
  }
}]
