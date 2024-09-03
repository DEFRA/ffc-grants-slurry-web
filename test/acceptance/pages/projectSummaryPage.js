const { $$ } = require('@wdio/globals')
const { projectFundingItem } = require("../dto/projectFundingItem");

class projectSummaryPage {
    async getFundingItems () {
        const scoringRowElements = await this.#getScoringRowElements();
        return await Promise.all(
            await scoringRowElements
                .map(async e => new projectFundingItem(
                    await this.#getProjectItem(e),
                    await this.#getUnitCost(e),
                    await this.#getQuantity(e),
                    await this.#getTotal(e)
                )
            )
        );
    }

    async #getScoringRowElements () {
        return $$("//h2[text()='Breakdown of funding']/following-sibling::table/tbody/tr[td[@class='govuk-table__header']]");
    }

    async #getProjectItem(parentRowElement) {
        const text = await parentRowElement.$$("td")[0].getText();
        return text.trim();
    }

    async #getUnitCost(parentRowElement) {
        const text = await parentRowElement.$$("td")[1].getText();
        return text.trim();
    }

    async #getQuantity(parentRowElement) {
        const text = await parentRowElement.$$("td")[2].getText();
        return text.trim();
    }

    async #getTotal(parentRowElement) {
        const text = await parentRowElement.$$("td")[3].getText();
        return text.trim();
    }
}

module.exports = projectSummaryPage;