const { sendMessage, receiveMessage } = require('../')
const { applicationRequestQueue, fetchApplicationRequestMsgType, applicationResponseQueue } = require('../../config/server.js')

async function getStandardisedCosts (applicationReference, sessionId) {
  await sendMessage({ applicationReference }, fetchApplicationRequestMsgType, applicationRequestQueue, { sessionId })
  return receiveMessage(sessionId, applicationResponseQueue)
}

module.exports = {
  getStandardisedCosts
}
