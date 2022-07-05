const { MessageSender } = require('ffc-messaging')
const createMessage = require('./create-message')

const sendMessage = async (body, type, config, options) => {
  console.log(type,'TTTTTTT',config,'CCCCCC', options , 'OOOOOOOOOO')
  console.log('[I AM INSIDE SEND MESSAGE .....]')
  const message = createMessage(body, type, options)
  const sender = new MessageSender(config)
  await sender.sendMessage(message)
  await sender.closeConnection()
}

module.exports = sendMessage
