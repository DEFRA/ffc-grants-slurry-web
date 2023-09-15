const { getStandardisedCosts } = require('../messaging/application')
const { startPageUrl } = require('../config/server')
const { guardPage } = require('../helpers/page-guard')
const { getYarValue } = require('../helpers/session')

const urlPrefix = require('../config/server').urlPrefix
const viewTemplate = 'standardised-grant-amounts'
const currentPath = `${urlPrefix}/${viewTemplate}`
const nextPath = `${urlPrefix}/storage-type`
const nextPathImpermeable = `${urlPrefix}/existing-cover-type`

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
    const preValidationKeys = ['estimatedGrant']
    const isRedirect = guardPage(request, preValidationKeys, null)

    if (isRedirect) {
      return h.redirect(startPageUrl)
    }

    try {
      console.log('Sending session message .....')
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
    return (getYarValue(request, 'applyingFor') === 'An impermeable cover only' && getYarValue(request, 'fitForPurpose') === 'Yes') ? h.redirect(nextPathImpermeable) : h.redirect(nextPath)
  }
}]
