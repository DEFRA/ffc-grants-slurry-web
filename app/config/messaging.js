const Joi = require('joi')

const sharedConfigSchema = {
  appInsights: Joi.object(),
  host: Joi.string().default('localhost'),
  password: Joi.string(),
  username: Joi.string(),
  useCredentialChain: Joi.bool().default(false)
}

const messageConfigSchema = Joi.object({
  projectDetailsQueue: {
    address: Joi.string().default('projectDetails'),
    type: Joi.string(),
    ...sharedConfigSchema
  },
  contactDetailsQueue: {
    address: Joi.string().default('contactDetails'),
    type: Joi.string(),
    ...sharedConfigSchema
  },
  applicationRequestQueue: {
    address: Joi.string().default('applicationRequestQueue'),
    type: Joi.string(),
    ...sharedConfigSchema
  },
  applicationResponseQueue: {
    address: Joi.string().default('applicationResponseQueue'),
    type: Joi.string(),
    ...sharedConfigSchema
  },
  fetchApplicationRequestMsgType: Joi.string(),
  eligibilityAnswersMsgType: Joi.string(),
  projectDetailsMsgType: Joi.string(),
  contactDetailsMsgType: Joi.string(),
  msgSrc: Joi.string()
})

const sharedConfig = {
  appInsights: require('applicationinsights'),
  host: process.env.SERVICE_BUS_HOST,
  password: process.env.SERVICE_BUS_PASSWORD,
  username: process.env.SERVICE_BUS_USER,
  useCredentialChain: process.env.NODE_ENV === 'production'
}

const msgTypePrefix = 'uk.gov.ffc.grants' // ' '

const config = {
  projectDetailsQueue: {
    address: process.env.PROJECT_DETAILS_QUEUE_ADDRESS,
    type: 'queue',
    ...sharedConfig
  },
  contactDetailsQueue: {
    address: process.env.CONTACT_DETAILS_QUEUE_ADDRESS,
    type: 'queue',
    ...sharedConfig
  },
  applicationRequestQueue: {
    address: process.env.APPLICATIONREQUEST_QUEUE_ADDRESS + '-' + process.env.ENVIRONMENT_CODE,
    type: 'queue',
    ...sharedConfig
  },
  applicationResponseQueue: {
    address: process.env.APPLICATIONRESPONSE_QUEUE_ADDRESS  + '-' + process.env.ENVIRONMENT_CODE,
    type: 'queue',
    ...sharedConfig
  },
  fetchApplicationRequestMsgType: `${msgTypePrefix}.fetch.app.request`,
  eligibilityAnswersMsgType: `${msgTypePrefix}.slurry.eligibility.details`,
  projectDetailsMsgType: `${msgTypePrefix}.slurry.project.details`,
  contactDetailsMsgType: `${msgTypePrefix}.slurry.contact.details`,
  msgSrc: 'ffc-grants-slurry-web'
}

// Validate config
const result = messageConfigSchema.validate(config, {
  abortEarly: false
})

// // Throw if config is invalid
if (result.error) {
  throw new Error(`The message config is invalid. ${result.error.message}`)
}

module.exports = result.value
