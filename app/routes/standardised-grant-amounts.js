const { getStandardisedCosts } = require('../messaging/application')
const { startPageUrl } = require('../config/server')
const { guardPage } = require('../helpers/page-guard')

const urlPrefix = require('../config/server').urlPrefix
const viewTemplate = 'standardised-grant-amounts'
const currentPath = `${urlPrefix}/${viewTemplate}`
const nextPath = `${urlPrefix}/storage-type`

function createModel (data, _request) {
  const previousPath = `${urlPrefix}/estimated-grant`

  return {
    backLink: previousPath,
    formActionPage: currentPath,
    ...data
  }
}

module.exports = [{
  method: 'GET',
  path: currentPath,
  options: {
    log: {
      collect: true
    }
  },
  handler: async (request, h, _err) => {
    const preValidationKeys = ['grantFundedCover']
    const isRedirect = guardPage(request, preValidationKeys, null)

    if (isRedirect) {
      return h.redirect(startPageUrl)
    }

    try {
      console.log('Sending session message .....')
      console.log(request.yar.id, "HELLLLLO")
      const result = await getStandardisedCosts(request.yar.id)
      console.log(result, '[THIS IS RESULT WE GOT BACK]')
      request.yar.set('standardisedCostObject', result)

      return h.view(viewTemplate, createModel({ catagories: result.data.desirability.catagories }, request))
    } catch (error) {
      console.log(error)
      return h.view('500').takeover()
    }
  }
},
{
  method: 'POST',
  path: currentPath,
  handler: (request, h) => {
    request.yar.set('score-calculated', true)
    return h.redirect(nextPath)
  }
}]
