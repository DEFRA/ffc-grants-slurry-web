const { $$ } = require('@wdio/globals');
const { projectItemsSidebarSection } = require("../dto/projectItemsSidebarSection");

class projectItemsSidebar {
    async getSections () {
        const headings = await this.#getHeadings();
        const unorderedLists = await this.#getUnorderedLists();

        return await Promise.all(
            headings.map(async (h3, index) => new projectItemsSidebarSection(h3, await this.#getListItemsFor(unorderedLists[index]))
            )
        );
    }

    async #getHeadings () {
        return await $$("//div[hr[@class='sideBarColor']]//h3").map(async e => (await e.getText()).trim());
    }

    async #getUnorderedLists() {
        return await $$("//div[hr[@class='sideBarColor']]//ul");
    }

    async #getListItemsFor(ulElement) {
        return await ulElement.$$("li").map(async e => (await e.getText()).trim());
    }
}

module.exports = projectItemsSidebar;
