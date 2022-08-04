describe('Get & Post Handlers', () => {
  jest.mock('../../../../app/helpers/utils', () => {
    const original = jest.requireActual('../../../../app/helpers/utils')
    return {
      ...original,
      getQuestionAnswer: jest.fn()
    }
  })
  const { getQuestionAnswer } = require('../../../../app/helpers/utils')

  const {
    validateAnswerField,
    checkInputError
  } = require('../../../../app/helpers/errorSummaryHandlers')

  test('check validateAnswerField()', async () => {
    let value = 'value'
    let details = {}
    expect(validateAnswerField(value, 'NOT_EMPTY', details, {})).toBe(true)

    details = {
      combinationObject: {
        questionKey: 'question-key',
        combinationAnswerKeys: ['ansKey1', 'ansKey2', 'ansKey3']
      }
    }
    value = ['value']
    getQuestionAnswer.mockReturnValueOnce('value1')
    getQuestionAnswer.mockReturnValueOnce('value2')
    getQuestionAnswer.mockReturnValueOnce('value3')
    expect(validateAnswerField(value, 'COMBINATION_ANSWER', details, {})).toBe(true)

    value = ['value1', 'value2', 'value3']
    getQuestionAnswer.mockReturnValueOnce('value1')
    getQuestionAnswer.mockReturnValueOnce('value2')
    getQuestionAnswer.mockReturnValueOnce('value3')
    expect(validateAnswerField(value, 'COMBINATION_ANSWER', details, {})).toBe(true)

    details = { max: 2 }
    expect(validateAnswerField(value, 'MAX_SELECT', details, {})).toBe(false)

    expect(validateAnswerField(value, 'DEFAULT_SELECT', details, {})).toBe(false)
  })

  test('check checkInputError()', () => {
    let validate = [{ type: 'NOT_EMPTY', dependentKey: 'dep-yarKey' }]
    expect(checkInputError(validate, false, {}, '')).toBe(undefined)

    validate = [{ type: 'DEFAULT_SELECT', dependentKey: 'dep-yarKey' }]
    expect(checkInputError(validate, true, { 'dep-yarKey': 'depYarkeyValue' }, '')).toEqual(
      { type: 'DEFAULT_SELECT', dependentKey: 'dep-yarKey' }
    )
  })
})
