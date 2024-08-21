const { $$ } = require('@wdio/globals')
const { scoreAnswer } = require("../dto/scoreAnswer");

class scoreResultsPage {
    async getScore() {
        return await $("//h1[text()='Score results']/following-sibling::div[1]/h2").getText();
    }

    async getAnswers () {
        const scoringRowElements = await this.#getScoringRowElements();
        return await Promise.all(await scoringRowElements.map(async e => {
            return new scoreAnswer(
                await this.#getTopic(e),
                await this.#getAnswers(e),
                await this.#getScore(e)
            );
        }));
    }

    async changeAnswersFor(topic) {
        const scoringRowElements = await this.#getScoringRowElements();
        const chosenScoringRowElement = (await scoringRowElements.filter(async e => await this.#getTopic(e) === topic))[0];
        await chosenScoringRowElement.$$("td")[2].$("a").click();
    }

    async #getScoringRowElements () {
        return $$("//h2[text()='Your answers']/following-sibling::table/tbody/tr");
    }

    async #getTopic(parentElement) {
        const text = await parentElement.$("th").getText();
        return text.trim();
    }

    async #getAnswers(parentElement) {
        const liElements = await parentElement.$$("td")[0].$("ul").$$("li");
        return await Promise.all(await liElements.map(async li => {
            const text = await li.getText();
            return text.trim();
        }));
    }

    async #getScore(parentElement) {
        const text = await parentElement.$$("td")[1].$("strong").getText();
        return text.trim();
    }
}

module.exports = scoreResultsPage;
