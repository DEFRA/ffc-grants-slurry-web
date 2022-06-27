const { sendMessage } = require('../../../../app/messaging')

jest.mock('ffc-messaging')
const { MessageSender } = require('ffc-messaging')

describe('application messaging tests', () => {  
    beforeEach(() => {
      jest.resetAllMocks()
      MessageSender.mockClear()
    })

    test('sendMessage sends a message', async () => {

        const body = { applicationReference: '12345'}
        const type = { type: 'mock'}
        const config = { queue: 'yes'}
        const sessionId = {id: 1}

        await sendMessage({body, type, config, sessionId})

        const MessageSenderInstance = MessageSender.mock.instances[0]

        const sendMessageCheck = MessageSenderInstance.sendMessage

        expect(MessageSender).toHaveBeenCalled()
        expect(sendMessageCheck).toHaveBeenCalledTimes(1)
        expect(sendMessageCheck).toHaveBeenCalledWith({
            body: {
                body, 
                type, 
                config: {
                    queue: 'yes'
                }, 
                sessionId
            },
            type: undefined,
            source: 'ffc-grants-slurry-web'
        })
        
    })
})