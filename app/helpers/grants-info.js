const getGrantValues = (projectCostValue, grantsInfo) => {
  // if (cappedGrant = true) then maxGrant becomes max grant available
  const { minGrant, maxGrant, grantPercentage, cappedGrant } = grantsInfo

  let calculatedGrant = grantPercentage ? Number(grantPercentage * projectCostValue / 100).toFixed(2) : projectCostValue

  if (cappedGrant) {
    calculatedGrant = Math.min(calculatedGrant, maxGrant)
  }
  const remainingCost = grantPercentage ? Number(projectCostValue - calculatedGrant).toFixed(2) : calculatedGrant
  const isEligible = (
    (minGrant <= calculatedGrant) && (calculatedGrant <= maxGrant)
  )
  return { calculatedGrant, remainingCost, isEligible }
}

module.exports = {
  getGrantValues
}
