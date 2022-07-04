const { sendMessage, receiveMessage } = require('../')
const { applicationRequestQueue, fetchApplicationRequestMsgType, applicationResponseQueue } = require('../../config/server.js')

async function getStandardisedCosts (sessionId) {
    console.log('made it to message', sessionId)
  await sendMessage(fetchApplicationRequestMsgType, applicationRequestQueue, { sessionId })

  console.log('finished sending message, onto receiving :D')
  return receiveMessage(sessionId, applicationResponseQueue)
}

module.exports = {
  getStandardisedCosts
}
