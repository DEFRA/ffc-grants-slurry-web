const { sendDesirabilitySubmitted } = require('./senders')
const cache = require('../cache')
const createMsg = require('./create-submission-msg')
const appInsights = require('../services/app-insights')

module.exports = async function (msg, contactDetailsReceiver) {
  try {
    const { body: submissionDetails, correlationId } = msg

    // Get details from cache regarding desirability score
    const desirabilityScore = await cache.getDesirabilityScore(correlationId)

    console.log('MADE IT TO DETAILS', submissionDetails, 'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW')
    const msgOut = createMsg(submissionDetails, desirabilityScore)

    await sendDesirabilitySubmitted(msgOut, correlationId)

    await contactDetailsReceiver.completeMessage(msg)
  } catch (err) {
    console.error(`[ERROR][UNABLE TO PROCESS CONTACT DETAILS RECEIVER MESSAGE][${err}]`)
    appInsights.logException(err, msg?.correlationId)
    await contactDetailsReceiver.abandonMessage(msg)
  }
}
