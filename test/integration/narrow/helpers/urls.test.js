describe('urls.js', () => {
  jest.mock('../../../../app/helpers/session')
  const { getYarValue } = require('../../../../app/helpers/session')

  const { getUrl } = require('../../../../app/helpers/urls')
  let urlObject = null
  let secBtn = 'Back to score'
  let dict = {}
  beforeEach(() => {
    getYarValue.mockImplementation((req, key) => (dict[key]))
  })
  afterEach(() => {
    jest.resetAllMocks()
  })
  test('getUrl() - should return url if urlObject is empty', () => {
    expect(getUrl(urlObject, 'mock-url', {}, secBtn, '')).toEqual('/slurry-infrastructure/score')

    secBtn = ''
    expect(getUrl(urlObject, 'mock-url', {}, secBtn, '')).toEqual('mock-url')
  })

  test('getUrl() - should return nonDependentUrl if urlObject is present, but yar values are empty', () => {
    urlObject = {
      dependentQuestionYarKey: 'dependentQuestionYarKey',
      dependentAnswerKeysArray: 'dependentAnswerKeysArray',
      urlOptions: {
        thenUrl: 'thenUrl',
        elseUrl: 'elseUrl',
        nonDependentUrl: 'nonDependentUrl'
      }
    }
    expect(getUrl(urlObject, 'mock-url', {}, secBtn, '')).toEqual('nonDependentUrl')
  })
  // elseUrl test
  test('getUrl() - should return elseUrl if urlObject and dependent Yar values are present', () => {
    urlObject = {
      dependentQuestionYarKey: 'dependentQuestionYarKey',
      dependentAnswerKeysArray: 'dependentAnswerKeysArray',
      urlOptions: {
        thenUrl: 'thenUrl',
        elseUrl: 'elseUrl',
        nonDependentUrl: 'nonDependentUrl'
      }
    }
    dict = {
      dependentQuestionYarKey: 'dependentAnswerKeysArray'
    }
    expect(getUrl(urlObject, 'mock-url', {}, secBtn, '')).toEqual('elseUrl')
  })
})
