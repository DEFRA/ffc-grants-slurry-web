const { formatSummaryTable } = require('./../helpers/project-summary')

const urlPrefix = require('../config/server').urlPrefix
const viewTemplate = 'project-summary'
const currentPath = `${urlPrefix}/${viewTemplate}`
const nextPath = `${urlPrefix}/remaining-cost`

function createModel (data, _request) {
  const previousPath = `${urlPrefix}/other-items`

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
  handler: async (request, h, err) => {
    try {
      console.log('Sending session message .....')

      const result = await formatSummaryTable(request)

      return h.view(viewTemplate, createModel({ catagory: result }, request))
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
