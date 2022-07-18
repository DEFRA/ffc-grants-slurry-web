const { sendMessage, receiveMessage } = require('../')
const { costRequestQueue, fetchCostRequestMsgType, costResponseQueue } = require('../../config/messaging.js')

async function getStandardisedCosts (sessionId) {
  console.log('[MADE IT TO MESSAGE]', sessionId)
  await sendMessage({ }, fetchCostRequestMsgType, costRequestQueue, { sessionId })

  console.log('[FINISHED SENDING MESSAGE MOVING TO RECEIVING]')
  return receiveMessage(sessionId, costResponseQueue)
}

module.exports = {
  getStandardisedCosts
}
