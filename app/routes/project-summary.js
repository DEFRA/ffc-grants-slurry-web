const { formatSummaryTable } = require('./../helpers/project-summary')
const { formatUKCurrency } = require('../helpers/data-formats')
const urlPrefix = require('../config/server').urlPrefix
const { getUrl } = require('../helpers/urls')

const viewTemplate = 'project-summary'
const currentPath = `${urlPrefix}/${viewTemplate}`
const changePath = '${urlPrefix}/storage-type'
const continuePath = '${urlPrefix}/potential-amount'
const backUrlObject = {
  dependentQuestionYarKey: 'otherItems',
  dependentAnswerKeysArray: ['other-items-A15'],
  urlOptions: {
    thenUrl: 'other-items',
    elseUrl: 'item-sizes-quantities'
  }
}

function createModel (data, request) {
  const backUrl = getUrl(backUrlObject, '', request)
  const previousPath = '${urlPrefix}/${backUrl}' 
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
    try {

      const result = formatSummaryTable(request)
      const totalValue = formatUKCurrency(request.yar.get('itemsTotalValue'))

      return h.view(viewTemplate, createModel({ catagory: result, totalValue: totalValue }, request))
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
    const { secBtn } = request.payload    
    const nextPath = !!secBtn ? changePath  : continuePath
    
    request.yar.set('standardisedCostCalculated', true)
    return h.redirect(nextPath)
  }
}]
