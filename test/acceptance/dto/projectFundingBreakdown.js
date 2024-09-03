class projectFundingBreakdown {
    constructor(fundingItems, total) {
        this.fundingItems = fundingItems;
        this.total = total;
    }
}
class projectFundingItem {
    constructor(name, unitCost, quantity, total) {
        this.name = name;
        this.unitCost = unitCost;
        this.quantity = quantity;
        this.total = total;
    }
}

module.exports = { projectFundingBreakdown, projectFundingItem }