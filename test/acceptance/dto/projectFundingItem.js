class projectFundingItem {
    constructor(projectItem, unitCost, quantity, total) {
        this.projectItem = projectItem;
        this.unitCost = unitCost;
        this.quantity = quantity;
        this.total = total;
    }
}

module.exports = { projectFundingItem }