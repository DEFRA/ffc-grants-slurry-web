const { senders, getDesirabilityAnswers } = require('../messaging')
const Wreck = require('@hapi/wreck')
const { ALL_QUESTIONS } = require('../config/question-bank')
const pollingConfig = require('../config/polling')
const { setYarValue } = require('../helpers/session')
const { addSummaryRow } = require('../helpers/score-helpers')
const gapiService = require('../services/gapi-service')

const urlPrefix = require('../config/server').urlPrefix

const viewTemplate = 'score'
const currentPath = `${urlPrefix}/${viewTemplate}`
const nextPath = `${urlPrefix}/business-details`

function createModel (data, _request) {
  const previousPath = `${urlPrefix}/environmental-impact`

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
