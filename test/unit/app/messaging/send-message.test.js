const { sendMessage, createMessage } = require('../../../../app/messaging')
const { MessageSender } = require('ffc-messaging')

describe('application messaging tests', () => {  
    beforeEach(() => {
      jest.resetAllMocks()
    })

    test('sendMessage sends a message', async () => {

        // mock response from MessageSender.sendMessage()

        const body = { applicationReference: '12345'}
        const type = { type: 'mock'}
        const config = { queue: 'yes'}
        const sessionId = {id: 1}

        // createMessage.mockResolvedValue({body, type, sessionId})
        
        // not working
        const senderMock = jest.spyOn(MessageSender, 'sendMessage').mockReturnValue({data: {}})

        await sendMessage({body, type, config, sessionId})

        expect(createMessage).toHaveBeenCalledTimes(1)
        expect(createMessage).toHaveBeenCalledWith({body, type, id: 2})

        expect(senderMock.sendMessage).toHaveBeenCalledTimes(1)
        expect(senderMock.sendMessage).toHaveBeenCalledWith({body, type, sessionId})
        expect(senderMock.closeConnection).toHaveBeenCalledTimes(1)
        
    })
})