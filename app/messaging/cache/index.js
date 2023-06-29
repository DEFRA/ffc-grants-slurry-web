const cacheConfig = require('../config/cache.js')
let desirabilityScoreCache

module.exports = {
  initialise: (server) => {
    desirabilityScoreCache = server.cache({
      expiresIn: cacheConfig.desirabilityScoresSegment.expiresIn,
      segment: cacheConfig.desirabilityScoresSegment.name
    })
  },
  setDesirabilityScore: (key, value) => desirabilityScoreCache.set(key, value),
  getDesirabilityScore: key => desirabilityScoreCache.get(key),
  removeDesirabilityScore: key => {
    try {
      desirabilityScoreCache.get(key) && desirabilityScoreCache.drop(key)
    } catch (e) {
      console.log(e, 'key not found.')
    }
  }
}
