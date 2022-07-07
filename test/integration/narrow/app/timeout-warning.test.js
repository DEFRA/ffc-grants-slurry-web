// mock dialog-polyfill
jest.mock('dialog-polyfill', () => ({
  forceRegisterDialog: jest.fn(() => 2),
  registerDialog: jest.fn(() => 4)
}))
const dialogPolyfill = require('dialog-polyfill')

// mock module object - parameter of constructor TimeoutWarning
const mockModule = {
  querySelector: jest.fn((param) => (`mqs_${param}`)),
  getAttribute: jest.fn((param) => null)
}

// mock document & window - DOM global values
const { JSDOM } = require('jsdom')
const dom = new JSDOM()
global.document = dom.window.document
global.window = dom.window

// import TimeoutWarning
const TimeoutWarning = require('../../../../app/templates/components/timeout-warning/timeout-warning')

describe('Timeout Warning', () => {
  it('test TimeoutWarning constructor', () => {
    expect(TimeoutWarning).toBeDefined()

    jest.spyOn(document, 'querySelector').mockImplementation((param) => (`dqs_${param}`))

    expect(new TimeoutWarning(mockModule)).toEqual({
      $module: mockModule,
      $lastFocusedEl: null,
      $closeButton: 'mqs_.js-dialog-close',
      $cancelButton: 'mqs_.js-dialog-cancel',
      overLayClass: 'govuk-timeout-warning-overlay',
      $fallBackElement: 'dqs_.govuk-timeout-warning-fallback',
      timers: [],
      $countdown: 'mqs_.timer',
      $accessibleCountdown: 'mqs_.at-timer',
      idleMinutesBeforeTimeOut: 25,
      timeOutRedirectUrl: 'timeout',
      minutesTimeOutModalVisible: 5,
      timeUserLastInteractedWithPage: ''
    })

    mockModule.getAttribute.mockImplementation((param) => {
      switch (param) {
        case 'data-minutes-idle-timeout':
          return 15
        case 'data-url-redirect':
          return 'mock-back-url'
        case 'data-minutes-modal-visible':
          return 10
        default:
          return null
      }
    })

    expect(new TimeoutWarning(mockModule)).toEqual(
      expect.objectContaining({
        idleMinutesBeforeTimeOut: 15,
        timeOutRedirectUrl: 'mock-back-url',
        minutesTimeOutModalVisible: 10
      })
    )
  })

  it('Test 2', () => {
    expect(true).toEqual(true)
    expect(dialogPolyfill.registerDialog()).toBe(4)
  })
})