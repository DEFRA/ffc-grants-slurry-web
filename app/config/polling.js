const Joi = require('joi')
// Define config schema
const schema = Joi.object({
  interval: Joi.number().default(60),
  retries: Joi.number().default(10)

})

// Build config
const config = {
  interval: process.env.POLLING_INTERVAL,
  retries: process.env.POLLING_RETRIES
}

// Validate config
const result = schema.validate(config, {
  abortEarly: false
})

// Throw if config is invalid
if (result.error) {
  throw new Error(`The polling config is invalid. ${result.error.message}`)
}

module.exports = result.value
