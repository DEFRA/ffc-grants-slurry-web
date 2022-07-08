// mock dialog-polyfill
jest.mock('dialog-polyfill', () => ({
  registerDialog: jest.fn((param) => null)
}))
const dialogPolyfill = require('dialog-polyfill')

// mock module object - parameter of constructor TimeoutWarning
let mockModule = {
  querySelector: jest.fn((param) => (`mqs_${param}`)),
  getAttribute: jest.fn((param) => null)
}
const origMockModule = mockModule

// mock document & window - DOM global values
const { JSDOM } = require('jsdom')
const dom = new JSDOM()
global.document = dom.window.document
global.window = dom.window
global.HTMLDialogElement = dom.window.HTMLDialogElement

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

  it('test TimeoutWarning.dialogSupported()', () => {
    global.HTMLDialogElement = jest.fn(() => {})

    jest.spyOn(document, 'querySelector').mockImplementation((param) => ({
      classList: {
        add: (addParam) => null
      }
    }))

    expect(new TimeoutWarning(mockModule).dialogSupported()).toBe(true)

    global.HTMLDialogElement = {}
    expect(new TimeoutWarning(mockModule).dialogSupported()).toBe(true)

    dialogPolyfill.registerDialog.mockImplementation((param) => { throw Error('mock-error') })
    expect(new TimeoutWarning(mockModule).dialogSupported()).toBe(false)
  })

  it('test TimeoutWarning.init()', () => {
    dialogPolyfill.registerDialog.mockImplementation((param) => { throw Error('mock-error') })
    expect(new TimeoutWarning(mockModule).init()).toBe(undefined)

    global.HTMLDialogElement = jest.fn(() => {})
    mockModule = {
      ...mockModule,
      querySelector: jest.fn((paramA) => ({
        addEventListener: jest.fn((paramB) => {})
      })),
      addEventListener: jest.fn((paramC) => {})
    }
    expect(new TimeoutWarning(mockModule).init()).toBe(undefined)

    mockModule = origMockModule
  })

  it('test TimeoutWarning.countIdleTime()', () => {
    expect(new TimeoutWarning(mockModule).countIdleTime()).toBe(undefined)
  })

  it('test TimeoutWarning.setLastActiveTimeOnServer()', () => {
    const result = new TimeoutWarning(mockModule)
    expect(result).toBeDefined()
    expect(result.setLastActiveTimeOnServer()).toBe(0)
  })
})
