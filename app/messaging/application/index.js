const { sendMessage, receiveMessage } = require('../')
const { applicationRequestQueue, fetchApplicationRequestMsgType, applicationResponseQueue } = require('../../config/server.js')

async function getStandardisedCosts (sessionId) {
  await sendMessage(fetchApplicationRequestMsgType, applicationRequestQueue, { sessionId })
  return receiveMessage(sessionId, applicationResponseQueue)
}

module.exports = {
  getStandardisedCosts
}
