const { sendMessage } = require('../../../../../app/messaging')
const { MessageSender } = require('ffc-messaging')

jest.mock('../../../../../app/messaging')
const { createMessage } = require('../../../../app/messaging')

describe('application messaging tests', () => {
    const sessionId = 'a-session-id'
  
    beforeEach(() => {
      jest.resetAllMocks()
    })

    test('sendMessage sends a message', async () => {

        const body = { applicationReference: '12345'}
        const type = { type: 'mock'}
        const config = { queue: 'yes'}
        const sessionId = {id: 1}
        createMessage.mockResolvedValue({body, type, sessionId})

        const message = await sendMessage({body, type, config, sessionId})

        expect(createMessage).toHaveBeenCalledtimes(1)
        expect(createMessage).toHaveBeenCalledWith({body, type, id: 2})
        
        
        

    })
})