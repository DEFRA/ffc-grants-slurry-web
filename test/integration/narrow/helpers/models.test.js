jest.mock('../../../../app/helpers/utils')
const { allAnswersSelected } = require('../../../../app/helpers/utils')

describe('Models', () => {
  const question = {
    type: 'mock_type',
    backUrl: 'mock_back_url',
    key: 'mock_key',
    answers: [{
      value: 'mock_answer_value',
      hint: 'hint',
      text: 'answer_text'
    }],
    backUrlObject: {
      dependentQuestionYarKey: 'tenancyLength',
      dependentAnswerKeysArray: ['tenancy-length-A1'],
      urlOptions: {
        thenUrl: 'tenancy-length',
        elseUrl: 'tenancy-length-condition',
        nonDependentUrl: 'tenancy'
      }
    },
    sidebar: {
      values: [{
        heading: 'Eligibility',
        content: [{
          para: `This grant is for pig, beef or dairy farmers.
          
          Poultry, arable-only, contractors and horticultural growers are not currently eligible.`
        }]
      }]
    },
    score: '123',
    warning: {
      text: 'Other types of business may be supported in future schemes',
      iconFallbackText: 'Warning'
    }
  }

  const { getModel } = require('../../../../app/helpers/models')

  test('inspect getModel() - full value', () => {
    expect(getModel([], question, {})).toEqual({
      type: 'mock_type',
      key: 'mock_key',
      title: undefined,
      backUrl: 'tenancy',
      items: {
        classes: 'govuk-fieldset__legend--l',
        id: undefined,
        name: undefined,
        fieldset: {
          legend: {
            classes: 'govuk-fieldset__legend--l',
            isPageHeading: true,
            text: undefined
          }
        },
        hint: undefined,
        items: [
          {
            checked: false,
            conditional: undefined,
            hint: 'hint',
            selected: false,
            text: 'answer_text',
            value: 'mock_answer_value'
          }
        ]
      },
      sideBarText: {
        values: [
          expect.objectContaining({ heading: 'Eligibility' })
        ]
      },
      warning: {
        text: 'Other types of business may be supported in future schemes',
        iconFallbackText: 'Warning'
      },
      reachedCheckDetails: false,
      diaplaySecondryBtn: false
    })
  })

  test('inspect getModel().title', () => {
    expect(getModel([], question, {})).toEqual(
      expect.objectContaining({
        type: 'mock_type',
        key: 'mock_key',
        title: undefined
      })
    )

    question.label = { text: 'mock_label_text' }
    expect(getModel([], question, {})).toEqual(
      expect.objectContaining({
        type: 'mock_type',
        key: 'mock_key',
        title: 'mock_label_text'
      })
    )

    question.title = 'mock_title'
    expect(getModel([], question, {})).toEqual(
      expect.objectContaining({
        type: 'mock_type',
        key: 'mock_key',
        title: 'mock_title'
      })
    )
  })

  test('inspect getModel().backUrl', () => {
    question.backUrlObject.urlOptions.nonDependentUrl = 'remaining-costs'

    expect(getModel([], question, {})).toEqual(
      expect.objectContaining({
        backUrl: 'remaining-costs'
      })
    )
  })

  test('inspect getModel().warningDetails', () => {
    question.warningCondition = {
      dependentWarningQuestionKey: 'mock_key',
      dependentWarningAnswerKeysArray: {},
      warning: {
        text: 'mock_warning_text',
        iconFallbackText: 'mock_warning'
      }
    }

    allAnswersSelected.mockReturnValueOnce(true)

    expect(getModel([], question, {}).warning).toEqual({
      text: 'mock_warning_text',
      iconFallbackText: 'mock_warning'
    })
  })
})
