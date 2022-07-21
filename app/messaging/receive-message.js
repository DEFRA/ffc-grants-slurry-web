const { MessageReceiver } = require('ffc-messaging')

async function receiveMessage (messageId, config) {
  console.log(messageId, 'MESSAGEID', config, 'CONFIGGGG')
  let result
  const receiver = new MessageReceiver(config)
  await receiver.acceptSession(messageId)
  const messages = await receiver.receiveMessages(1, { maxWaitTimeInMs: 50000 })
  if (messages && messages.length) {
    result = messages[0].body
    console.log(result,'result received')
    await receiver.completeMessage(messages[0])
  }
  await receiver.closeConnection()
  return result
}

module.exports = receiveMessage
