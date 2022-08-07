describe('Get & Post Handlers', () => {
  jest.mock('../../../../app/helpers/session', () => {
    const original = jest.requireActual('../../../../app/helpers/session')
    return {
      ...original,
      getYarValue: jest.fn()
    }
  })
  const { getYarValue } = require('../../../../app/helpers/session')

  jest.mock('../../../../app/helpers/conditionalHTML')
  const { getHtml } = require('../../../../app/helpers/conditionalHTML')

  jest.mock('../../../../app/helpers/models')
  const { getModel } = require('../../../../app/helpers/models')

  const rewire = require('rewire')

  const {
    customiseErrorText
  } = require('../../../../app/helpers/errorSummaryHandlers')

  let mockH

  test('check validateAnswerField()', async () => {
    const myModule = rewire('../../../../app/helpers/errorSummaryHandlers')
    const validateAnswerField = myModule.__get__('validateAnswerField')

    const value = 'value'
    let details = {}
    expect(validateAnswerField(value, 'NOT_EMPTY', details, {})).toBe(true)

    details = { max: 2 }
    expect(validateAnswerField(value, 'MAX_SELECT', details, {})).toBe(true)

    expect(validateAnswerField(value, 'DEFAULT_SELECT', details, {})).toBe(false)
  })

  test('check checkInputError()', () => {
    const myModule = rewire('../../../../app/helpers/errorSummaryHandlers')
    const checkInputError = myModule.__get__('checkInputError')

    let validate = [{ type: 'NOT_EMPTY', dependentKey: 'dep-yarKey' }]
    expect(checkInputError(validate, false, {}, '')).toBe(undefined)

    validate = [{ type: 'DEFAULT_SELECT', dependentKey: 'dep-yarKey' }]
    expect(checkInputError(validate, true, { 'dep-yarKey': 'depYarkeyValue' }, '')).toEqual(
      { type: 'DEFAULT_SELECT', dependentKey: 'dep-yarKey' }
    )
  })

  test('check customiseErrorText()', () => {
    mockH = { view: jest.fn() }
    getYarValue.mockReturnValue('mock-yar-value')
    getHtml.mockReturnValue('mock-html')
    getModel.mockReturnValue({ items: ['item1', 'item2'] })

    let currentQuestion = {
      yarKey: 'mock-yarKey',
      type: 'multi-input',
      conditionalKey: 'mock-condKey'
    }
    let errorList = [{ href: 'mock-yarKey', text: 'mock-href-text' }]
    customiseErrorText('mock-value', currentQuestion, errorList, mockH, {})
    expect(mockH.view).toHaveBeenCalledWith(
      'page',
      {
        items: ['item1', 'item2'],
        errorList: [{
          href: 'mock-yarKey',
          text: 'mock-href-text'
        }]
      })

    getModel.mockReturnValue({ items: { item1: 'item1', item2: 'item2' } })
    currentQuestion = {
      ...currentQuestion,
      type: 'mock-type'
    }
    mockH.view.mockClear()
    customiseErrorText('mock-value', currentQuestion, errorList, mockH, {})
    expect(mockH.view).toHaveBeenCalledWith(
      'page',
      {
        items: {
          item1: 'item1',
          item2: 'item2',
          errorMessage: { text: 'mock-href-text' }
        },
        errorList: [{
          href: 'mock-yarKey',
          text: 'mock-href-text'
        }]
      }
    )

    getModel.mockReturnValue({ items: { item1: 'item1', item2: 'item2' } })
    errorList = [{ href: 'mock-another-yarKey', text: 'mock-another-href-text' }]
    mockH.view.mockClear()
    customiseErrorText('mock-value', currentQuestion, errorList, mockH, {})
    expect(mockH.view).toHaveBeenCalledWith(
      'page',
      {
        items: { item1: 'item1', item2: 'item2' },
        errorList: [{
          href: 'mock-another-yarKey',
          text: 'mock-another-href-text'
        }]
      }
    )
  })
})
