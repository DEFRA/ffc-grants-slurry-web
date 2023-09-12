const { crumbToken } = require("./test-helper");
describe("Gantry test", () => {
  const varList = {
    coverType: null,
    existingCover: "no",
    applyingFor: "fake",
    applicantType: "Beef",
    projectType: "fake",
    storageType: "hello",
    separator: "Yes",
    separatorType: "fake",
  };
  beforeEach(() => {
    jest.clearAllMocks();
  });
  jest.mock("../../../../app/helpers/session", () => ({
    setYarValue: (request, key, value) => null,
    getYarValue: (request, key) => {
      if (varList[ key ]) return varList[ key ];
      else return null;
    },
  }));

  // GET
  it("GET /gantry route returns 200", async () => {
    const options = {
      method: "GET",
      url: `${global.__URLPREFIX__}/gantry`,
    };
    const response = await global.__SERVER__.inject(options);
    expect(response.statusCode).toBe(200);
    expect(response.payload).toContain(
      "Do you want to add a gantry?"
    );
    expect(response.payload).toContain(
      "Grant amount: £5,154 per unit"
    );
    expect(response.payload).toContain(
      "Yes"
    );
    expect(response.payload).toContain(
      "No"
    );
  });
  it("page loads with /pig-serviceable-capacity-increase-replace/ back link", async () => {
    const optionSeparator = {
      method: "GET",
      url: `${global.__URLPREFIX__}/gantry`,
    };
    const responseSeparator = await global.__SERVER__.inject(optionSeparator);
    expect(responseSeparator.statusCode).toBe(200);
    expect(responseSeparator.payload).toContain(
      '<a href=\"separator-type\" class=\"govuk-back-link\">Back</a>'
    );
  });
  it("no option selected -> show error message", async () => {
    const postOptions = {
      method: "POST",
      url: `${global.__URLPREFIX__}/gantry`,
      headers: { cookie: "crumb=" + crumbToken },
      payload: { gantry: "", crumb: crumbToken },
    };
    const postResponse = await global.__SERVER__.inject(postOptions);
    expect(postResponse.statusCode).toBe(200);
    expect(postResponse.payload).toContain(
      "Select if you want to add a gantry"
    );
  });

  // POST
  it("POST /gantry route returns next page -> /solid-fraction-storage/, when user selects 'Yes'", async () => {
    const postOptions = {
      method: "POST",
      url: `${global.__URLPREFIX__}/gantry`,
      headers: { cookie: "crumb=" + crumbToken },
      payload: { gantry: "Yes", crumb: crumbToken },
    };
    const postResponse = await global.__SERVER__.inject(postOptions);
    expect(postResponse.statusCode).toBe(302);
    expect(postResponse.headers.location).toBe("solid-fraction-storage");
  });
  it("POST /gantry route returns next page -> /solid-fraction-storage/, when user selects 'No'", async () => {
    const postOptions = {
      method: "POST",
      url: `${global.__URLPREFIX__}/gantry`,
      headers: { cookie: "crumb=" + crumbToken },
      payload: { gantry: "No", crumb: crumbToken },
    };
    const postResponse = await global.__SERVER__.inject(postOptions);
    expect(postResponse.statusCode).toBe(302);
    expect(postResponse.headers.location).toBe("solid-fraction-storage");
  });
});
