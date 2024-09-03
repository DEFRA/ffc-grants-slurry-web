const { $, $$ } = require('@wdio/globals')
const { projectFundingBreakdown, projectFundingItem } = require("../dto/projectFundingBreakdown");

class projectSummaryPage {
    async getFundingBreakdown () {
        const projectItemRowElements = await this.#getProjectItemRowElements();
        return new projectFundingBreakdown(
            await Promise.all(
                await projectItemRowElements
                    .map(async e => new projectFundingItem(
                        await this.#getItemName(e),
                        await this.#getItemUnitCost(e),
                        await this.#getItemQuantity(e),
                        await this.#getItemTotal(e)
                    )
                )
            ),
            await this.#getProjectFundingTotal()
        );
    }

    async #getProjectItemRowElements () {
        return $$("//h2[text()='Breakdown of funding']/following-sibling::table/tbody/tr[td[@class='govuk-table__header']]");
    }

    async #getItemName(parentRowElement) {
        const text = await parentRowElement.$$("td")[0].getText();
        return text.trim();
    }

    async #getItemUnitCost(parentRowElement) {
        const text = await parentRowElement.$$("td")[1].getText();
        return text.trim();
    }

    async #getItemQuantity(parentRowElement) {
        const text = await parentRowElement.$$("td")[2].getText();
        return text.trim();
    }

    async #getItemTotal(parentRowElement) {
        const text = await parentRowElement.$$("td")[3].getText();
        return text.trim();
    }

    async #getProjectFundingTotal() {
        const text = await $("//h2[text()='Breakdown of funding']/following-sibling::table/tbody/tr[td[@class='govuk-!-padding-left-8']]/td[2]").getText();
        return text.trim();
    }
}

module.exports = projectSummaryPage;
