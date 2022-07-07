jest.mock('dialog-polyfill', () => ({
  forceRegisterDialog: jest.fn(() => 2),
  registerDialog: jest.fn(() => 4)
}))
const dialogPolyfill = require('dialog-polyfill')

const TimeoutWarning = require('../../../../app/templates/components/timeout-warning/timeout-warning')

describe('Timeout Warning', () => {
  it('Test 1', () => {
    expect(TimeoutWarning).toBeDefined()
    expect(true).toEqual(true)
    expect(dialogPolyfill.forceRegisterDialog()).toBe(2)
  })

  it('Test 2', () => {
    expect(true).toEqual(true)
    expect(dialogPolyfill.registerDialog()).toBe(4)
  })
})
