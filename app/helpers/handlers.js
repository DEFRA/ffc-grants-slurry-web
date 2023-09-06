const { getYarValue, setYarValue } = require("../helpers/session");
const { getModel } = require("../helpers/models");
const { checkErrors } = require("../helpers/errorSummaryHandlers");
const { getGrantValues } = require("../helpers/grants-info");
const { formatUKCurrency } = require("../helpers/data-formats");
const {
  SELECT_VARIABLE_TO_REPLACE,
} = require("../helpers/regex");
const { getUrl } = require("../helpers/urls");
const { guardPage } = require("../helpers/page-guard");
const senders = require("../messaging/senders");
const createMsg = require("../messaging/create-msg");
const { startPageUrl } = require("../config/server");
const emailFormatting = require("./../messaging/email/process-submission");

const {
  getConfirmationId,
  getCheckDetailsModel,
  getEvidenceSummaryModel,
  getDataFromYarValue,
} = require("./pageHelpers");

const {
  setGrantsData,
  setTitle,
  addConsentOptionalData,
  addConditionalLabelData,
  handleMultiInput,
  processGA,
  clearYarValue,
  createAnswerObj,
} = require("./content-helpers");


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
      break
      case "existing-cover" :
        setYarValue(request, "serviceCapacityIncrease", null);
      break
      case "existing-cover-pig" :
        setYarValue(request, "serviceCapacityIncrease", null);
      break
      case "applicant-type" :
        setYarValue(request, "intensiveFarming", null);
      break
    case "estimated-grant" :
      setYarValue(request, "estimatedGrant", 'reached');
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
    //TODO update Gapi calls to use new format
    // gapiService.sendEligibilityEvent(request, "true");
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
    // TODO: update Gapi calls to use new format
    // gapiService.sendValidationDimension(request);
    return errors;
  }
  
  if (
    baseUrl === "fit-for-purpose" &&
    getYarValue(request, "fitForPurpose") === "No" &&
    getYarValue(request, "applyingFor") ===
      "Building a new store, replacing or expanding an existing store"
  ) {
    return h.redirect("/slurry-infrastructure/fit-for-purpose-conditional");
  } else if (
    baseUrl === "fit-for-purpose" &&
    getYarValue(request, "fitForPurpose") === "No" &&
    getYarValue(request, "applyingFor") === "An impermeable cover only"
  ) {
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
  }
  else if(
    getYarValue(request, "serviceCapacityIncrease") &&
    getYarValue(request, "grantFundedCover") === "Yes, I need a cover"){
      return h.redirect("/slurry-infrastructure/cover-type");
  }

  if (thisAnswer?.notEligible) {
    //TODO update Gapi calls to use new format
    // gapiService.sendEligibilityEvent(request, !!thisAnswer?.notEligible);
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
