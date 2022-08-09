describe('urls.js', () => {
  const { getUrl } = require('../../../../app/helpers/urls')

  test('getUrl()', () => {
    const urlObject = undefined
    let secBtn = 'Back to score'
    expect(getUrl(urlObject, 'mock-url', {}, secBtn, '')).toEqual('/slurry-infrastructure/score')

    secBtn = ''
    expect(getUrl(urlObject, 'mock-url', {}, secBtn, '')).toEqual('mock-url')
  })
})
