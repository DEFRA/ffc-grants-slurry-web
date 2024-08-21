const { When } = require("@wdio/cucumber-framework");
const { browser } = require("@wdio/globals");
const scoreResultsPage = require("../pages/scoreResultsPage");

When(/^(?:the user clicks|clicks) on "([^"]*)?"$/, async (text) => {
    await $(`//*[contains(text(),'${text}')]`).click();
});

When(/^(?:the user continues|continues)$/, async () => {
    await $("//*[@id='Continue' or @id='btnContinue']").click();
});

When(/^(?:the user continues|continues) to their score$/, async () => {
    await $("//button[@id='Get-your-score']").click();
});

When(/^(?:the user continues|continues) to their results$/, async () => {
    await $("//button[@id='btnResults']").click();
});

When(/^(?:the user goes|goes) back$/, async () => {
    await $("//a[@class='govuk-back-link']").click();
});

When(/^PAUSE "([^"]*)?" SECONDS$/, async (seconds) => {
    await browser.pause(parseInt(seconds) * 1000);
});

When(/^(?:the user confirms|confirms) and sends$/, async () => {
    await $("//button[@id='btnConfirmSend']").click();
});

When(/^the user selects "([^"]*)?"$/, async (text) => {
    const element = await $(`//input[contains(@value,'${text}')]`);
    if (!await element.isSelected()) {
        await element.click();
     }
});

When(/^the user unselects any previous selection$/, async () => {
    const elements = await $$(`//input[@type='checkbox']`);
    for (const element of elements) {
        if (await element.isSelected()) {
            await element.click();
        }
    }
}); 

When(/^(?:the user selects|selects) the following$/, async (dataTable) => {
    for (const row of dataTable.raw()) {
        const element = await $(`//input[@type='checkbox' and contains(@value,'${row[0]}')]`);
        if (!await element.isSelected()) {
            await element.click();
        }
    };
});

When(/^(?:the user enters|enters) "([^"]*)?" in "([^"]*)?"$/, async (text, id) => {
    await $(`//input[@id='${id}']`).setValue(text);
});

When(/^the user enters the following$/, async (dataTable) => {
    for (const row of dataTable.hashes()) {
        const element = await $(`//*[@id='${row["ID"]}']`);
        const tag = await element.getTagName();
        if (tag == "select") {
            await element.selectByVisibleText(row["VALUE"]);
        } else {
            await element.setValue(row["VALUE"]);
        }
    };
});

When(/^(?:the user chooses|chooses) to change their "([^"]*)?" answers$/, async (section) => {
    await new scoreResultsPage().changeAnswersFor(section);
});
