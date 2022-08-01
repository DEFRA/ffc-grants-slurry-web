describe('Page Helpers', () => {
  jest.mock('../../../../app/helpers/session')
  const { getYarValue } = require('../../../../app/helpers/session')

  const { handleConditinalHtmlData } = require('../../../../app/helpers/pageHelpers')

  test('check handleConditinalHtmlData()', () => {
    let result

    getYarValue.mockReturnValue({ sbi: 'mock-sbi-value' })
    result = handleConditinalHtmlData('multi-input', 'mock-label-data', 'mock-yarKey', {})
    expect(result).toContain('<label class="govuk-label" for="sbi">')
    expect(result).toContain('<input class="govuk-input govuk-!-width-one-third" id="sbi" name="sbi" value="mock-sbi-value">')

    getYarValue.mockReturnValue('mock-yarValue')
    result = handleConditinalHtmlData('input', 'mock-label-data', 'mock-yarKey', {})
    expect(result).toContain('<label class="govuk-label" for="mock-yarKey">')
    expect(result).toContain('<input class="govuk-input govuk-!-width-one-third" id="mock-yarKey" name="mock-yarKey" value="mock-yarValue">')
  })
})
