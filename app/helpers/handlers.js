const { getYarValue, setYarValue } = require("../helpers/session");
const { getModel } = require("../helpers/models");
const { checkErrors } = require("../helpers/errorSummaryHandlers");
const { getGrantValues } = require("../helpers/grants-info");
const { formatUKCurrency } = require("../helpers/data-formats");
const {
  SELECT_VARIABLE_TO_REPLACE,
  DELETE_POSTCODE_CHARS_REGEX,
} = require("../helpers/regex");
const { getUrl } = require("../helpers/urls");
const { guardPage } = require("../helpers/page-guard");
const senders = require("../messaging/senders");
const createMsg = require("../messaging/create-msg");
const gapiService = require("../services/gapi-service");
const { startPageUrl, urlPrefix } = require("../config/server");
const { ALL_QUESTIONS } = require("../config/question-bank");
const { formatOtherItems } = require("./../helpers/other-items-sizes");
const emailFormatting = require("./../messaging/email/process-submission");

const {
  getConfirmationId,
  handleConditinalHtmlData,
  getCheckDetailsModel,
  getEvidenceSummaryModel,
  getDataFromYarValue,
  getConsentOptionalData,
} = require("./pageHelpers");

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

const sendContactDetailsToSenders = async (request, confirmationId) => {
  try {
    const emailData = await emailFormatting({
      body: createMsg.getAllDetails(request, confirmationId),
      correlationId: request.yar.id,
    });
    await senders.sendDesirabilitySubmitted(emailData, request.yar.id);
    // TODO: update Gapi calls to use new format
    // await gapiService.sendDimensionOrMetrics(request, [ {
    //   dimensionOrMetric: gapiService.dimensions.CONFIRMATION,
    //   value: confirmationId
    // }, {
    //   dimensionOrMetric: gapiService.dimensions.FINALSCORE,
    //   value: getYarValue(request, 'current-score')
    // },
    // {
    //   dimensionOrMetric: gapiService.metrics.CONFIRMATION,
    //   value: 'TIME'
    // }
    // ])
    console.log("[CONFIRMATION EVENT SENT]");
  } catch (err) {
    console.log("ERROR: ", err);
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
const processGA = async (question, request, confirmationId) => {
  if (question.ga) {
    await gapiService.processGA(request, question.ga, confirmationId);
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

const getPage = async (question, request, h) => {
  const {
    url,
    backUrl,
    nextUrlObject,
    type,
    title,
    yarKey,
    preValidationKeys,
    preValidationKeysRule,
    backUrlObject,
  } = question;
  const nextUrl = getUrl(nextUrlObject, question.nextUrl, request);
  const isRedirect = guardPage(
    request,
    preValidationKeys,
    preValidationKeysRule
  );
  if (isRedirect) {
    return h.redirect(startPageUrl);
  }
  let confirmationId = "";
  setGrantsData(question, request);
  
  switch (url) {
    case "applying-for":
      setYarValue(request, "fitForPurpose", null);
      setYarValue(request, "projectType", null);
      setYarValue(request, "grantFundedCover", null);
      setYarValue(request, "existingCover", null);
      break
      case "grant-funded-cover" :
        setYarValue(request, "serviceCapacityIncrease", null);
        setYarValue(request, "existingCoverSize", null);
        setYarValue(request, "coverSize", null);
      break
      case "existing-cover" :
        setYarValue(request, "serviceCapacityIncrease", null);
        setYarValue(request, "existingCoverSize", null);
        setYarValue(request, "coverSize", null);
      break
      case "existing-cover-pig" :
        setYarValue(request, "serviceCapacityIncrease", null);
        setYarValue(request, "existingCoverSize", null);
        setYarValue(request, "coverSize", null);
      break
      case "applicant-type" :
        setYarValue(request, "intensiveFarming", null);
      break
      case "existing-cover-type" :
        setYarValue(request, "existingCoverSize", null);
        setYarValue(request, "coverSize", null);
      break
      case "separator":
        const existingCover = getYarValue(request, 'existingCover')
        const grantFundedCover = getYarValue(request, 'grantFundedCover')
        const applyingFor = getYarValue(request, 'applyingFor')
        const applicantType = getYarValue(request, 'applicantType')
        const projectType = getYarValue(request, 'projectType')

        if (existingCover === "No") {
          question.backUrl = `${urlPrefix}/cover-size`
        }else if (existingCover === "Yes" && grantFundedCover === "Yes, I need a cover") {
          question.backUrl = `${urlPrefix}/existing-cover-size`
        }else if (existingCover === "Yes" && applyingFor != "None of the above") {
          // the url below is not confirmed. it's just temporary url
          question.backUrl = `${urlPrefix}/existinggrantfundedcoversize`
        }else if (
        (grantFundedCover=== "Yes, I already have a cover" || grantFundedCover=== "Not needed, the slurry is treated with acidification") && 
        grantFundedCover === "No" && 
        applicantType === "Pig" &&
        projectType=== "Replace an existing store that is no longer fit for purpose with a new store") {
          question.backUrl = `${urlPrefix}/pig-serviceable-capacity-increase-replace`
        }else if (
          (grantFundedCover=== "Yes, I already have a cover" || grantFundedCover=== "Not needed, the slurry is treated with acidification") && 
          grantFundedCover === "No" && 
          applicantType === "Pig" &&
          projectType=== "Add a new store to increase existing capacity" || projectType=== "Expand an existing store") {
            question.backUrl = `${urlPrefix}/pig-serviceable-capacity-increase-additional`
        }else if (
            (grantFundedCover=== "Yes, I already have a cover" || grantFundedCover=== "Not needed, the slurry is treated with acidification") && 
            grantFundedCover === "No" && 
            applicantType !== "Pig" &&
            projectType=== "Replace an existing store that is no longer fit for purpose with a new store") {
              question.backUrl = `${urlPrefix}/serviceable-capacity-increase-replace`
        }else if (
              (grantFundedCover=== "Yes, I already have a cover" || grantFundedCover=== "Not needed, the slurry is treated with acidification") && 
              grantFundedCover === "No" && 
              applicantType !== "Pig" &&
              projectType=== "Add a new store to increase existing capacity" || projectType=== "Expand an existing store") {
              question.backUrl = `${urlPrefix}/serviceable-capacity-increase-additional`
          }
      break
    default:
      break
  }

  if (
    url === "potential-amount" &&
    !getGrantValues(getYarValue(request, "itemsTotalValue"), question.grantInfo)
      .isEligible
  ) {
    const NOT_ELIGIBLE = { ...question.ineligibleContent, backUrl };
    gapiService.sendEligibilityEvent(request, "true");
    return h.view("not-eligible", NOT_ELIGIBLE);
  }

  if (question.maybeEligible) {
    let { maybeEligibleContent } = question;
    maybeEligibleContent.title = question.title;
    let consentOptionalData;

    if (maybeEligibleContent.reference) {
      if (!getYarValue(request, "consentMain")) {
        return h.redirect(startPageUrl);
      }
      confirmationId = getConfirmationId(request.yar.id);

      // Send Contact details to GAPI
      await sendContactDetailsToSenders(request, confirmationId);

      maybeEligibleContent = {
        ...maybeEligibleContent,
        reference: {
          ...maybeEligibleContent.reference,
          html: maybeEligibleContent.reference.html.replace(
            SELECT_VARIABLE_TO_REPLACE,
            (_ignore, _confirmatnId) => confirmationId
          ),
        },
      };
      request.yar.reset();
    }

    maybeEligibleContent = {
      ...maybeEligibleContent,
      messageContent: maybeEligibleContent.messageContent.replace(
        SELECT_VARIABLE_TO_REPLACE,
        (_ignore, additionalYarKeyName) =>
          formatUKCurrency(getYarValue(request, additionalYarKeyName) || 0)
      ),
    };

    consentOptionalData = await addConsentOptionalData(url, request);

    const MAYBE_ELIGIBLE = {
      ...maybeEligibleContent,
      consentOptionalData,
      url,
      nextUrl,
      backUrl: getUrl(backUrlObject, backUrl, request),
    };
    return h.view("maybe-eligible", MAYBE_ELIGIBLE);
  }

  await setTitle(title, question, request);

  const data = getDataFromYarValue(request, yarKey, type);

  let conditionalHtml;
  conditionalHtml = await addConditionalLabelData(
    question,
    yarKey,
    type,
    request,
    conditionalHtml
  );

  await processGA(question, request, confirmationId);

  switch (url) {
    case "check-details": {
      return h.view(
        "check-details",
        getCheckDetailsModel(request, question, backUrl, nextUrl)
      );
    }
    case "planning-permission-summary": {
      const evidenceSummaryModel = getEvidenceSummaryModel(
        request,
        question,
        backUrl,
        nextUrl
      );
      if (evidenceSummaryModel.redirect) {
        return h.redirect(startPageUrl);
      }
      return h.view("evidence-summary", evidenceSummaryModel);
    }
    case "score":
    case "business-details":
    case "agent-details":
    case "applicant-details": {
      return h.view("page", getModel(data, question, request, conditionalHtml));
    }
    default:
      break;
  }

  return h.view("page", getModel(data, question, request, conditionalHtml));
};

const clearYarValue = (yarKey, payload, request) => {
  if (yarKey === "consentOptional" && !Object.keys(payload).includes(yarKey)) {
    setYarValue(request, yarKey, "");
  }
};
const createAnswerObj = (payload, yarKey, type, request, answers) => {
  let thisAnswer;
  for (const [key, value] of Object.entries(payload)) {
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
      const payloadYarVal = payload[field.yarKey]
        ? payload[field.yarKey]
            .replace(DELETE_POSTCODE_CHARS_REGEX, "")
            .split(/(?=.{3}$)/)
            .join(" ")
            .toUpperCase()
        : "";
      dataObject = {
        ...dataObject,
        [field.yarKey]:
          field.yarKey === "postcode" || field.yarKey === "projectPostcode"
            ? payloadYarVal
            : payload[field.yarKey] || "",
        ...(field.conditionalKey
          ? { [field.conditionalKey]: payload[field.conditionalKey] }
          : {}),
      };
    });
    setYarValue(request, yarKey, dataObject);
  }
};

const showPostPage = (currentQuestion, request, h) => {
  const {
    yarKey,
    answers,
    baseUrl,
    ineligibleContent,
    nextUrl,
    nextUrlObject,
    title,
    type,
  } = currentQuestion;
  const NOT_ELIGIBLE = { ...ineligibleContent, backUrl: baseUrl };
  const payload = request.payload;

  let thisAnswer;
  let dataObject;

  clearYarValue(yarKey, payload, request);
  thisAnswer = createAnswerObj(payload, yarKey, type, request, answers);

  handleMultiInput(type, request, dataObject, yarKey, currentQuestion, payload);
  console.log('here: ', baseUrl, getYarValue(request, "fitForPurpose"), getYarValue(request, "applyingFor"));
  
  if (title) {
    currentQuestion = {
      ...currentQuestion,
      title: title.replace(
        SELECT_VARIABLE_TO_REPLACE,
        (_ignore, additionalYarKeyName) =>
          formatUKCurrency(getYarValue(request, additionalYarKeyName) || 0)
      ),
    };
  }

  const errors = checkErrors(payload, currentQuestion, h, request);
  if (errors) {
    gapiService.sendValidationDimension(request);
    return errors;
  }

  if(baseUrl == 'existing-cover-type' && 
  getYarValue(request, "existingCover") === "No" &&  
  getYarValue(request, "existingCoverType") && 
  getYarValue(request, "grantFundedCover") === "Yes, I need a cover"){
    return h.redirect("/slurry-infrastructure/existing-cover-size");
  }else if(baseUrl == 'existing-cover-type' && 
  getYarValue(request, "existingCover") === "Yes" &&
  getYarValue(request, "existingCoverType") && 
  (getYarValue(request, "applyingFor") === "Building a new store, replacing or expanding an existing store" ||
  getYarValue(request, "applyingFor") === "An impermeable cover only")){
    // I have asked Alice to put different url for different cases. 
    // return h.redirect("/slurry-infrastructure/existing-cover-size");
  }


  if(baseUrl == 'cover-type' && getYarValue(request, "existingCover") === "Yes" &&  getYarValue(request, "coverType")){
    return h.redirect("/slurry-infrastructure/existing-cover-type");
  }else if(baseUrl == 'cover-type' && getYarValue(request, "existingCover") === "No" &&  getYarValue(request, "coverType")){
    return h.redirect("/slurry-infrastructure/cover-size");
  }

  if (
    baseUrl === "fit-for-purpose" &&
    getYarValue(request, "fitForPurpose") === "No" &&
    getYarValue(request, "applyingFor") ===
      "Building a new store, replacing or expanding an existing store"
  ){
    return h.redirect("/slurry-infrastructure/fit-for-purpose-conditional");
  }else if (
    baseUrl === "fit-for-purpose" &&
    getYarValue(request, "fitForPurpose") === "No" &&
    getYarValue(request, "applyingFor") === "An impermeable cover only"
  ){
    return h.view("not-eligible", NOT_ELIGIBLE);
  }else if(
    getYarValue(request, "serviceCapacityIncrease") &&
    (getYarValue(request, "grantFundedCover") === "Yes, I already have a cover" ||
    getYarValue(request, "grantFundedCover") === "Not needed, the slurry is treated with acidification") &&
    getYarValue(request, "existingCover") === "No"){
      return h.redirect("/slurry-infrastructure/separator");
  }else if(
    getYarValue(request, "serviceCapacityIncrease") &&
    (getYarValue(request, "grantFundedCover") === "Yes, I already have a cover" ||
    getYarValue(request, "grantFundedCover") === "Not needed, the slurry is treated with acidification") &&
    getYarValue(request, "existingCover") === "Yes"){
      return h.redirect("/slurry-infrastructure/existing-cover-type");
  }else if(
    getYarValue(request, "serviceCapacityIncrease") &&
    getYarValue(request, "grantFundedCover") === "Yes, I need a cover"){
      return h.redirect("/slurry-infrastructure/cover-type");
  }

  if (thisAnswer?.notEligible) {
    gapiService.sendEligibilityEvent(request, !!thisAnswer?.notEligible);
    return h.view("not-eligible", NOT_ELIGIBLE);
  } else if (thisAnswer?.redirectUrl) {
    return h.redirect(thisAnswer?.redirectUrl);
  }

  return h.redirect(
    getUrl(nextUrlObject, nextUrl, request, payload.secBtn, currentQuestion.url)
  );
};

const getHandler = (question) => {
  return (request, h) => {
    return getPage(question, request, h);
  };
};

const getPostHandler = (currentQuestion) => {
  return (request, h) => {
    return showPostPage(currentQuestion, request, h);
  };
};

module.exports = {
  getHandler,
  getPostHandler,
};
