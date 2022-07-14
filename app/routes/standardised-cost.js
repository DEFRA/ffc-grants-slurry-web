const { getStandardisedCosts }  = require('../messaging/application')


const urlPrefix = require('../config/server').urlPrefix

const viewTemplate = 'standardised-cost'
const currentPath = `${urlPrefix}/${viewTemplate}`
const nextPath = `${urlPrefix}/standard-costs`

function createModel(data, _request) {
  const previousPath = `${urlPrefix}/cover`

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

      const result = await getStandardisedCosts(request.yar.id)
      
      console.log(result, '[STANDARDISED COST REQUEST SENT]')

      if(result.costData == 'success'){

        return h.view(viewTemplate, createModel({ value: '12345' }, request))
      }

    } catch (error) {
      request.log(error)
    }
    request.log(err)
    return h.view('500')
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
