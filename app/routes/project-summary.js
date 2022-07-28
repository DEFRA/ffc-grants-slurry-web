const { formatSummaryTable } = require('./../helpers/project-summary')

const urlPrefix = require('../config/server').urlPrefix
const viewTemplate = 'project-summary'
const currentPath = `${urlPrefix}/${viewTemplate}`
const nextPath = `${urlPrefix}/remaining-cost`

function createModel (data, _request) {
  const previousPath = `${urlPrefix}/other-items` // need to add second return route

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
      console.log('Sending session message .....')

      const result = formatSummaryTable(request)

      const totalValue = request.yar.get('itemsTotalValue')

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
    request.yar.set('standardisedCostCalculated', true)
    return h.redirect(nextPath)
  }
}]
