describe("Conditional html", () => {
  const { setOptionsLabel } = require("../../../../app/helpers/answer-options");

  test("check function setOptionsLabel - data is string of array and answers is object of array", () => {
    const data = ["Pig", "Beef"];
    const answers = [
      { key: "applicant-type-A1", value: "Pig" },
      { key: "applicant-type-A2", value: "Beef" },
      { key: "applicant-type-A3", value: "Dairy" },
      { value: "divider" },
      {
        key: "applicant-type-A4",
        value: "None of the above",
        notEligible: true,
      },
    ];

    const expectedResult = [
      {
        value: "Pig",
        text: "Pig",
        hint: undefined,
        checked: true,
        selected: false,
      },
      {
        value: "Beef",
        text: "Beef",
        hint: undefined,
        checked: true,
        selected: false,
      },
      {
        value: "Dairy",
        text: "Dairy",
        hint: undefined,
        checked: false,
        selected: false,
      },
      { divider: "or" },
      {
        value: "None of the above",
        text: "None of the above",
        hint: undefined,
        checked: false,
        selected: false,
      },
    ];

    const result = setOptionsLabel(data, answers);
    expect(result).toEqual(expectedResult);
  });

  test("check function setOptionsLabel - data is null of array and option is object of array", () => {
    const data = null;
    const answers = [
      {
        key: "project-started-A1",
        value: "Yes, preparatory work",
        hint: {
          text: "For example, quotes from suppliers, applying for planning permission",
        },
      },
      {
        key: "project-started-A2",
        value: "Yes, we have begun project work",
        hint: {
          text: "For example, started construction work, signing contracts, placing orders",
        },
        notEligible: true,
      },
      {
        key: "project-started-A3",
        value: "No, we have not done any work on this project yet",
      },
    ];

    const result = setOptionsLabel(data, answers);
    const expectedResult = [
      {
        value: "Yes, preparatory work",
        text: "Yes, preparatory work",
        hint: {
          text: "For example, quotes from suppliers, applying for planning permission",
        },
        checked: false,
        selected: false,
      },
      {
        value: "Yes, we have begun project work",
        text: "Yes, we have begun project work",
        hint: {
          text: "For example, started construction work, signing contracts, placing orders",
        },
        checked: false,
        selected: false,
      },
      {
        value: "No, we have not done any work on this project yet",
        text: "No, we have not done any work on this project yet",
        hint: undefined,
        checked: false,
        selected: false,
      },
    ];

    expect(result).toEqual(expectedResult);
  });
});

//   test("check function isChecked - data is string of array and option is string", () => {
//     const data = ["Pig"];
//     const option = "Pig";

//     const result = isChecked(data, option);
//     expect(result).toBe(true);
//   });

//   test("check function isChecked - data null and option is string", () => {
//     const data = null;
//     const option = "Sole trader";

//     const result = isChecked(data, option);
//     expect(result).toBe(false);
//   });

//   test("check function isChecked - data null and option is string", () => {
//     const data = null;
//     const option = "Yes";

//     const result = isChecked(data, option);
//     expect(result).toBe(false);
//   });

//   test("check function isChecked - data null and option is string", () => {
//     const data = ["Pig"];
//     const option = "Beef";

//     const result = isChecked(data, option);
//     expect(result).toBe(false);
//   });

//   test("check function isChecked - data is string of array and option is string", () => {
//     const data = [
//       "Constructing or improving buildings for processing",
//       "Processing equipment or machinery",
//     ];
//     const option = "Constructing or improving buildings for processing";

//     const result = isChecked(data, option);
//     expect(result).toBe(true);
//   });
//   test("check function isChecked - data is string of array and option is string", () => {
//     const data = [
//       "Constructing or improving buildings for processing",
//       "Processing equipment or machinery",
//     ];
//     const option = "Processing equipment or machinery";

//     const result = isChecked(data, option);
//     expect(result).toBe(true);
//   });
