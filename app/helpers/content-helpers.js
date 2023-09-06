const { formatUKCurrency } = require("../helpers/data-formats");
const { getYarValue, setYarValue } = require("../helpers/session");
const { getGrantValues } = require("../helpers/grants-info");
const gapiService = require("../services/gapi-service");
const {
	SELECT_VARIABLE_TO_REPLACE,
	DELETE_POSTCODE_CHARS_REGEX,
} = require("../helpers/regex");
const { formatOtherItems } = require("./../helpers/other-items-sizes");
const {
	handleConditinalHtmlData,
	getConsentOptionalData,
} = require("./pageHelpers");

// handlers helper functions
const setGrantsData = (question, request) => {
	if (question.grantInfo) {
		const { calculatedGrant, remainingCost } = getGrantValues(
			getYarValue(request, "itemsTotalValue"),
			question.grantInfo
		);
		setYarValue(request, "calculatedGrant", calculatedGrant);
		setYarValue(request, "remainingCost", remainingCost);
	}
};

const setTitle = async (title, question, request) => {
	if (title) {
		return {
			...question,
			title: title.replace(
				SELECT_VARIABLE_TO_REPLACE,
				(_ignore, additionalYarKeyName) =>
					formatUKCurrency(getYarValue(request, additionalYarKeyName) || 0)
			),
		};
	}
};

const addConsentOptionalData = async (url, request) => {
	if (url === "confirm") {
		const consentOptional = getYarValue(request, "consentOptional");
		return getConsentOptionalData(consentOptional);
	}
};

const addConditionalLabelData = async (
	question,
	yarKey,
	type,
	request,
	condHTML
) => {
	if (question?.conditionalKey && question?.conditionalLabelData) {
		const conditional =
			yarKey === "businessDetails" ? yarKey : question.conditionalKey;
		condHTML = handleConditinalHtmlData(
			type,
			question.conditionalLabelData,
			conditional,
			request
		);
	}
	return condHTML;
}

const handleMultiInput = (
	type,
	request,
	dataObject,
	yarKey,
	currentQuestion,
	payload
) => {
	if (type === "multi-input") {
		let allFields = currentQuestion.allFields;
		if (currentQuestion.costDataKey) {
			allFields = formatOtherItems(request);
		}
		allFields.forEach((field) => {
			const payloadYarVal = payload[ field.yarKey ]
				? payload[ field.yarKey ]
					.replace(DELETE_POSTCODE_CHARS_REGEX, "")
					.split(/(?=.{3}$)/)
					.join(" ")
					.toUpperCase()
				: "";
			dataObject = {
				...dataObject,
				[ field.yarKey ]:
					field.yarKey === "postcode" || field.yarKey === "projectPostcode"
						? payloadYarVal
						: payload[ field.yarKey ] || "",
				...(field.conditionalKey
					? { [ field.conditionalKey ]: payload[ field.conditionalKey ] }
					: {}),
			};
		});
		setYarValue(request, yarKey, dataObject);
	}
};

const processGA = async (question, request, confirmationId) => {
	//TODO: update Gapi calls to use new format
	// if (question.ga) {
	//   await gapiService.processGA(request, question.ga, confirmationId);
	// }
};

const clearYarValue = (yarKey, payload, request) => {
	if (yarKey === "consentOptional" && !Object.keys(payload).includes(yarKey)) {
		setYarValue(request, yarKey, "");
	}
};

const createAnswerObj = (payload, yarKey, type, request, answers) => {
	let thisAnswer;
	for (const [ key, value ] of Object.entries(payload)) {
		thisAnswer = answers?.find((answer) => answer.value === value);
		if (
			yarKey === "grantFundedCover" &&
			thisAnswer.key === "grantFundedCover-A3"
		) {
			request.yar.set("coverType", "");
			request.yar.set("coverSize", "");
		}

		if (type !== "multi-input" && key !== "secBtn") {
			setYarValue(
				request,
				key,
				key === "projectPostcode"
					? value
						.replace(DELETE_POSTCODE_CHARS_REGEX, "")
						.split(/(?=.{3}$)/)
						.join(" ")
						.toUpperCase()
					: value
			);
		}
	}
	return thisAnswer;
};


module.exports = {
	setGrantsData,
	setTitle,
	addConsentOptionalData,
	addConditionalLabelData,
	handleMultiInput,
	processGA,
	clearYarValue,
	createAnswerObj,
};