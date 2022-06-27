const mockAcceptSession = jest.fn()
const mockReceiveMessages = jest.fn().mockResolvedValue([{body: { message: 'hello'}}])
const mockCompleteMessage = jest.fn()
const mockCloseConnection = jest.fn()
jest.mock('ffc-messaging/app/messaging/message-receiver', () => {
    return jest.fn().mockImplementation(() => {
      return {
        acceptSession: mockAcceptSession, 
        receiveMessages: mockReceiveMessages, 
        completeMessage: mockCompleteMessage, 
        closeConnection: mockCloseConnection
        }
    })
})


const receiveSessionMessage = require('../../../../app/messaging/receive-message')

describe('receive message tests', () => {  

    afterEach(() => {
        jest.clearAllMocks()
    })

    test('receiveMessage receives message', async () => {

        const messageId = {id: 1}
        const config = { queue: 'yes'}

        const result = await receiveSessionMessage(messageId, config)

        expect(result).toEqual({message: 'hello'})

        expect(mockAcceptSession).toHaveBeenCalledTimes(1)
        expect(mockReceiveMessages).toHaveBeenCalledTimes(1)
        expect(mockCompleteMessage).toHaveBeenCalledTimes(1)
        expect(mockCloseConnection).toHaveBeenCalledTimes(1)
        
    })
})