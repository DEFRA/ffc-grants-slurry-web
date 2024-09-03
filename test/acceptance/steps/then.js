const { Then } = require("@wdio/cucumber-framework");
const { browser } = require("@wdio/globals");
const _ = require("lodash");
const { projectFundingItem } = require("../dto/projectFundingItem");
const { worksheetField } = require("../dto/worksheet");
const projectSummaryPage = require("../pages/projectSummaryPage");
const guard = require("../services/guard");
const poller = require("../services/poller");
const sharePoint = require("../services/sharePoint");

let referenceNumber = null;

Then(/^(?:the user should|should) be at URL "([^"]*)?"$/, async (urlPath) => {
    const fullUrl = await browser.getUrl();
    await expect(fullUrl.endsWith(urlPath)).toBe(true);
});

Then(/^(?:the user should|should) see heading "([^"]*)?"$/, async (text) => {
    if (text.indexOf("'") > -1) {
        text = text.substring(0, text.indexOf("'"));
    }
    await expect($(`//h1[contains(text(),"${text}")]`)).toBeDisplayed();
});

Then(/^(?:the user should|should) see heading label "([^"]*)?"$/, async (text) => {
    await expect($(`//h1/label[contains(text(),'${text}')]`)).toBeDisplayed();
});

Then(/^(?:the user should|should) see hint "([^"]*)?"$/, async (text) => {
    await expect($(`//div[@class="govuk-hint" and contains(text(),'${text}')]`)).toBeDisplayed();
});

Then(/^(?:the user should|should) see error "([^"]*)?"$/, async (text) => {
    if (text.indexOf("'") > -1) {
        text = text.substring(0, text.indexOf("'"));
    }
    await expect($(`//div[@class="govuk-error-summary"]//a[contains(text(),'${text}')]`)).toBeDisplayed();
});

Then(/^(?:the user should|should) see the following errors$/, async (dataTable) => {
    for (const row of dataTable.raw()) {
        let expectedError = row[0];
        await expect($(`//div[@class="govuk-error-summary"]//a[contains(text(),'${expectedError}')]`)).toBeDisplayed();
    }
});

Then(/^(?:the user should|should) see warning "([^"]*)?"$/, async (text) => {
    await expect($(`//div[@class='govuk-warning-text']//strong[text()[contains(.,'${text}')]]`)).toBeDisplayed();
});

Then(/^(?:the user should|should) see body "([^"]*)?"$/, async (text) => {
    await expect($(`//p[@class='govuk-body' and contains(text(),'${text}')]`)).toBeDisplayed();
});

Then(/^(?:the user should|should) see bullet point "([^"]*)?"$/, async (text) => {
    await expect($(`//ul[@class='govuk-list--bullet']//li[contains(text(),'${text}')]`)).toBeDisplayed();
});

Then(/^(?:the user should|should) see "([^"]*)?" for their eligibility result$/, async (text) => {
    await expect($(`//h1[text()='Your results']/following-sibling::div/span[text()='${text}']`)).toBeDisplayed();
});

Then(/^(?:the user should|should) see a reference number for their application$/, async () => {
    const selector = $("//h1/following-sibling::div[1]/strong");
    await expect(selector).toHaveText(expect.stringContaining("-"));
    referenceNumber = await selector.getText();
});

Then(/^a spreadsheet should be generated with the following values$/, async (expectedDataTable) => {
    guard.isNotNull(referenceNumber, "referenceNumber should have been set by a prior step");

    const isSpreadsheetPresent = await poller.pollForSuccess(async() => sharePoint.isSpreadsheetPresentFor(referenceNumber));
    await expect(isSpreadsheetPresent).toBe(true);

    const expectedFields = expectedDataTable.hashes()
        .map(row => {
            const dataType = row["DATA TYPE"];
            let fieldValue = row["FIELD VALUE"];

            switch (dataType) {
                case "CURRENT-DATE":
                    fieldValue = new Date().toLocaleDateString('en-GB');
                    break;
                case "DATE-IN-6-MONTHS":
                    let currentDate = new Date();
                    currentDate.setMonth(currentDate.getMonth() + 6);
                    fieldValue = currentDate.toLocaleDateString('en-GB');
                    break;
                case "DECIMAL":
                    fieldValue = Number.parseFloat(fieldValue);
                    break;
                case "INTEGER":
                    fieldValue = Number.parseInt(fieldValue);
                    break;
                case "REFERENCE-NUMBER":
                    fieldValue = referenceNumber;
                    break;
            }

            return new worksheetField(Number.parseInt(row["ROW NO"]), row["FIELD NAME"], fieldValue);
        });

    const actualFields = (await sharePoint.getWorksheetFor(referenceNumber)).fields;

    for (const expectedField of expectedFields) {
        const matchingActualField = actualFields.find(actualField => _.isEqual(actualField, expectedField));
        await expect(matchingActualField).toEqual(expectedField);
    }
});

Then(/^the following items in the breakdown of funding$/, async (expectedDataTable) => {
    const expectedFundingItems = expectedDataTable.hashes()
        .map(row => new projectFundingItem(
            row["ITEM"],
            row["UNIT COST"],
            row["QUANTITY"],
            row["TOTAL"]
        ));

    const actualFundingItems = (await new projectSummaryPage().getFundingItems());

    console.warn("expectedFundingItems: " + JSON.stringify(expectedFundingItems));
    console.warn("actualFundingItems: " + JSON.stringify(actualFundingItems));

    for (const expectedFundingItem of expectedFundingItems) {
        const matchingActualFundingItem = actualFundingItems.find(actualFundingItem => _.isEqual(actualFundingItem, expectedFundingItem));
        await expect(matchingActualFundingItem).toEqual(expectedFundingItem);
    }
});
