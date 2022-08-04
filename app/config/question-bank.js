const {
  CURRENCY_FORMAT,
  CHARS_MAX_10,
  CHARS_MIN_10,
  CHARS_MAX_100,
  POSTCODE_REGEX,
  WHOLE_NUMBER_REGEX,
  SBI_REGEX,
  NAME_ONLY_REGEX,
  PHONE_REGEX,
  EMAIL_REGEX,
  ONLY_TEXT_REGEX,
  PLANNING_REFERENCE_NUMBER_REGEX,
  LETTERS_AND_NUMBERS_REGEX,
  TWO_NUMBERS_EIGHT_CHARS,
  CHARS_MAX_50
} = require('../helpers/regex')

const { LIST_COUNTIES } = require('../helpers/all-counties')

/**
 * ----------------------------------------------------------------
 * list of yarKeys not bound to an answer, calculated separately
 * -  calculatedGrant
 * -  remainingCost
 *
 * Mainly to replace the value of a previously stored input
 * Format: {{_VALUE_}}
 * eg: question.title: 'Can you pay £{{_storedYarKey_}}'
 * ----------------------------------------------------------------
 */

/**
 * ----------------------------------------------------------------
 * question type = single-answer, boolean ,input, multiinput, mullti-answer
 *
 *
 * ----------------------------------------------------------------
 */

/**
 * multi-input validation schema
 *
 *  type: 'multi-input',
    allFields: [
      {
        ...
        validate: [
          {
            type: 'NOT_EMPTY',
            error: 'Error message'
          },
          {
            type: 'REGEX',
            error: 'Error message',
            regex: SAVED_REGEX
          },
          {
            type: 'MIN_MAX',
            error: 'Error message',
            min: MINIMUM,
            max: MAXIMUM
          }
        ]
      }
    ]
 */

const questionBank = {
  grantScheme: {
    key: 'FFC002',
    name: 'Slurry Infrastructure'
  },
  sections: [
    {
      name: 'eligibility',
      title: 'Eligibility',
      questions: [
        {
          key: 'applicant-type',
          order: 10,
          title: 'What type of farmer are you?',
          hint: {
            text: 'Select all that apply'
          },
          pageTitle: '',
          url: 'applicant-type',
          baseUrl: 'applicant-type',
          backUrl: 'start',
          nextUrl: 'legal-status',
          ineligibleContent: {
            messageContent: `This grant is for pig, beef or dairy farmers. <br/> <br/> 
            <div class="govuk-inset-text">Poultry, arable-only, contractors and horticultural growers are not currently eligible.</div>`,
            messageLink: {
              url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
              title: 'See other grants you may be eligible for.'
            }
          },
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: `This grant is for pig, beef or dairy farmers.
                
                Poultry, arable-only, contractors and horticultural growers are not currently eligible.`
              }]
            }]
          },
          fundingPriorities: 'Improve the environment',
          type: 'multi-answer',
          minAnswerCount: 1,
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select the option that applies to you'
            },
            {
              type: 'STANDALONE_ANSWER',
              error: 'You cannot select that combination of options',
              standaloneObject: {
                questionKey: 'applicant-type',
                answerKey: 'applicant-type-A4'
              }
            }
          ],
          answers: [
            {
              key: 'applicant-type-A1',
              value: 'Pig'
            },
            {
              key: 'applicant-type-A2',
              value: 'Beef'
            },
            {
              key: 'applicant-type-A3',
              value: 'Dairy'
            },
            {
              value: 'divider'
            },
            {
              key: 'applicant-type-A4',
              value: 'None of the above',
              notEligible: true
            }
          ],
          yarKey: 'applicantType'
        },
        {
          key: 'legal-status',
          order: 20,
          title: 'What is the legal status of the business?',
          pageTitle: '',
          backUrl: 'applicant-type',
          nextUrl: 'country',
          url: 'legal-status',
          baseUrl: 'legal-status',
          preValidationKeys: [],
          ineligibleContent: {
            messageContent: 'Your business does not have an eligible legal status.',
            details: {
              summaryText: 'Who is eligible',
              html: '<ul class="govuk-list govuk-list--bullet"><li>Sole trader</li><li>Partnership</li><li>Limited company</li><li>Charity</li><li>Trust</li><li>Limited liability partnership</li><li>Community interest company</li><li>Limited partnership</li><li>Industrial and provident society</li><li>Co-operative society (Co-Op)</li><li>Community benefit society (BenCom)</li></ul>'
            },
            messageLink: {
              url: 'https://www.gov.uk/topic/farming-food-grants-payments/rural-grants-payments',
              title: 'See other grants you may be eligible for.'
            },
            warning: {
              text: 'Other types of business may be supported in future schemes',
              iconFallbackText: 'Warning'
            }
          },
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: 'Public organisations and local authorities cannot apply for this grant.',
                items: []
              }]
            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select the legal status of the business'
            }
          ],
          answers: [
            {
              key: 'legal-status-A1',
              value: 'Sole trader'
            },
            {
              key: 'legal-status-A2',
              value: 'Partnership'
            },
            {
              key: 'legal-status-A3',
              value: 'Limited company'
            },
            {
              key: 'legal-status-A4',
              value: 'Charity'
            },
            {
              key: 'legal-status-A5',
              value: 'Trust'
            },
            {
              key: 'legal-status-A6',
              value: 'Limited liability partnership'
            },
            {
              key: 'legal-status-A7',
              value: 'Community interest company'
            },
            {
              key: 'legal-status-A8',
              value: 'Limited partnership'
            },
            {
              key: 'legal-status-A9',
              value: 'Industrial and provident society'
            },
            {
              key: 'legal-status-A10',
              value: 'Co-operative society (Co-Op)'
            },
            {
              key: 'legal-status-A11',
              value: 'Community benefit society (BenCom)'
            },
            {
              value: 'divider'
            },
            {
              key: 'legal-status-A12',
              value: 'None of the above',
              notEligible: true
            }
          ],
          yarKey: 'legalStatus'
        },
        {
          key: 'country',
          order: 30,
          title: 'Is the planned project in England?',
          hint: {
            text: 'The location of the slurry store'
          },
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          pageTitle: '',
          backUrl: 'legal-status',
          nextUrl: 'project-started',
          url: 'country',
          baseUrl: 'country',
          preValidationKeys: ['legalStatus'],
          ineligibleContent: {
            messageContent: 'This grant is only for projects in England.',
            insertText: { text: 'Scotland, Wales and Northern Ireland have other grants available.' },
            messageLink: {
              url: '',
              title: ''
            }
          },
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: `This grant is only for projects in England.
                
                Scotland, Wales and Northern Ireland have other grants available.`
              }]
            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if the project is in England'
            }
          ],
          answers: [
            {
              key: 'country-A1',
              value: 'Yes'
            },
            {
              key: 'country-A2',
              value: 'No',
              notEligible: true
            }
          ],
          yarKey: 'inEngland'
        },
        {
          key: 'project-started',
          order: 40,
          title: 'Have you already started work on the project?',
          pageTitle: '',
          url: 'project-started',
          baseUrl: 'project-started',
          backUrl: 'country',
          nextUrl: 'tenancy',
          preValidationKeys: [],
          ineligibleContent: {
            messageContent: 'You cannot apply for a grant if you have already started work on the project.',
            insertText: { text: 'Starting the project or committing to any costs (such as placing orders) before you receive a funding agreement invalidates your application.' },
            messageLink: {
              url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
              title: 'See other grants you may be eligible for.'
            }
          },
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: `
                You will invalidate your application if you start the project or commit to any costs (such as placing orders) before you receive a funding agreement.
                
                Before you start the project, you can:`,
                items: [
                  'get quotes from suppliers',
                  'apply for planning permission (this can take a long time)'
                ]
              }]
            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select the option that applies to your project'
            }
          ],
          answers: [
            {
              key: 'project-started-A1',
              value: 'Yes, preparatory work',
              hint: {
                text: 'For example, quotes from suppliers, applying for planning permission'
              }
            },
            {
              key: 'project-started-A2',
              value: 'Yes, we have begun project work',
              hint: {
                text: 'For example, started construction work, signing contracts, placing orders'
              },
              notEligible: true
            },
            {
              key: 'project-started-A3',
              value: 'No, we have not done any work on this project yet'
            }
          ],
          yarKey: 'projectStart'
        },
        {
          key: 'tenancy',
          order: 50,
          title: 'Is the planned project on land the business owns?',
          hint: {
            text: 'The location of the slurry store'
          },
          pageTitle: '',
          url: 'tenancy',
          baseUrl: 'tenancy',
          backUrl: 'project-started',
          nextUrl: 'system-type',
          preValidationKeys: [],
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: 'You must own the land or have a tenancy in place for 5 years after the final grant payment.'
              }]
            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if the planned project is on land the business owns'
            }
          ],
          answers: [
            {
              key: 'tenancy-A1',
              value: 'Yes'
            },
            {
              key: 'tenancy-A2',
              value: 'No',
              redirectUrl: 'tenancy-length'
            }
          ],
          yarKey: 'tenancy'
        },
        {
          key: 'tenancy-length',
          order: 60,
          title: 'Do you have a tenancy agreement for 5 years after the final grant payment?',
          pageTitle: '',
          url: 'tenancy-length',
          baseUrl: 'tenancy-length',
          backUrl: 'tenancy',
          preValidationKeys: [],
          nextUrl: 'system-type',
          type: 'single-answer',
          minAnswerCount: 1,
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: 'You must own the land or have a tenancy in place for 5 years after the final grant payment.',
                items: []
              }]
            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if the land has a tenancy agreement in place for 5 years after the final grant payment.'
            }
          ],
          answers: [
            {
              key: 'tenancy-length-A1',
              value: 'Yes'
            },
            {
              key: 'tenancy-length-A2',
              value: 'No',
              redirectUrl: 'tenancy-length-condition'
            }
          ],
          yarKey: 'tenancyLength'
        },
        {
          key: 'tenancy-length-condition',
          title: 'You may be able to apply for a grant from this scheme',
          order: 70,
          url: 'tenancy-length-condition',
          backUrl: 'tenancy-length',
          preValidationKeys: [],
          nextUrl: 'system-type',
          maybeEligible: true,
          maybeEligibleContent: {
            messageHeader: 'You may be able to apply for a grant from this scheme',
            messageContent: 'You will need to extend your tenancy agreement before you can complete a full application.'
          }
        },
        {
          key: 'system-type',
          order: 80,
          title: 'What is your current manure management system?',
          pageTitle: '',
          url: 'system-type',
          baseUrl: 'system-type',
          backUrlObject: {
            dependentQuestionYarKey: 'tenancyLength',
            dependentAnswerKeysArray: ['tenancy-length-A1'],
            urlOptions: {
              thenUrl: 'tenancy-length',
              elseUrl: 'tenancy-length-condition',
              nonDependentUrl: 'tenancy'
            }
          },
          nextUrl: 'existing-storage-capacity',
          preValidationKeys: [],
          ineligibleContent: {
            messageContent: 'This grant is for farmers currently using a system that produces slurry.',
            messageLink: {
              url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
              title: 'See other grants you may be eligible for.'
            }
          },
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: `
                This grant is for farmers currently using a system that produces slurry.
                `,
                items: []
              }]
            }],
            details: {
              summaryText: 'What is slurry?',
              html: '<ul class="govuk-list govuk-list--bullet"><li>Slurry is a liquid organic manure produced by livestock (other than poultry) while in a yard or building. It includes animal bedding and water that drains from areas where animals are kept.</li></ul>'
            }
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select your current manure management system'
            }
          ],
          answers: [
            {
              key: 'system-type-A1',
              value: 'Slurry-based system'
            },
            {
              key: 'system-type-A2',
              value: 'Farm-yard manure and slurry system'
            },
            {
              key: 'system-type-A3',
              value: 'Farm-yard manure system that does not produce slurry',
              notEligible: true
            },
            {
              key: 'system-type-A4',
              value: 'I do not have a slurry system',
              notEligible: true
            }
          ],
          errorMessage: {
            text: ''
          },
          yarKey: 'systemType'
        },
        {
          key: 'existing-storage-capacity',
          order: 90,
          title: 'How many months’ slurry storage capacity do you have?',
          hint: {
            text: 'Based on your current animal numbers'
          },
          baseUrl: 'existing-storage-capacity',
          backUrl: 'system-type',
          nextUrl: 'planned-storage-capacity',
          url: 'existing-storage-capacity',
          preValidationKeys: [],
          ineligibleContent: {
            messageContent: `
            This grant is to get your serviceable storage levels to 6 months.`,
            messageLink: {
              url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
              title: 'See other grants you may be eligible for.'
            }
          },
          type: 'single-answer',
          minAnswerCount: 1,
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: `
                This grant is to get your serviceable storage levels to 6 months.

                For example, if you have 4 months’ serviceable storage, we will fund another 2 months. If you have 2 months’ serviceable storage and increase to 12 months, we will fund 4 months.

                Any capacity above 6 months is not covered by the grant.
                `,
                items: []
              }]
            }],
            details: {
              summaryText: 'When is a store no longer fit for purpose?',
              html: '<ul class="govuk-list govuk-list--bullet">A store is no longer fit for purpose if it has reached the end of its design life and may be susceptible to leaks or failure.</ul>'
            }
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select existing storage capacity'
            }
          ],
          answers: [
            {
              key: 'existing-storage-capacity-A1',
              value: 'Less than 6 months'
            },
            {
              key: 'existing-storage-capacity-A2',
              value: 'Up to 6 months but it is no longer fit for purpose'
            },
            {
              key: 'existing-storage-capacity-A3',
              value: '6 months or more',
              notEligible: true
            }
          ],
          yarKey: 'existingStorageCapacity'
        },
        {
          key: 'planned-storage-capacity',
          order: 100,
          title: 'How many months’ slurry storage capacity will you have after the project?',
          hint: {
            text: 'Based on your current animal numbers'
          },
          baseUrl: 'planned-storage-capacity',
          backUrl: 'existing-storage-capacity',
          nextUrl: 'project-type',
          url: 'planned-storage-capacity',
          preValidationKeys: [],
          type: 'single-answer',
          minAnswerCount: 1,
          ineligibleContent: {
            messageContent: 'This grant is to get your serviceable storage levels to 6 months.',
            messageLink: {
              url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
              title: 'See other grants you might be eligible for.'
            }
          },
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: `
                This grant is to get your serviceable storage levels to 6 months.

                For example, if you have 4 months’ serviceable storage, we will fund another 2 months. If you have 2 months’ serviceable storage and increase to 12 months, we will fund 4 months.

                Any capacity above 6 months is not covered by the grant.

                You must maintain at least 6 months’ capacity for the duration of the 5-year grant funding agreement.
                `,
                items: []
              }]
            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select planned storage capacity'
            }
          ],
          answers: [
            {
              key: 'planned-storage-capacity-A1',
              value: '6 months'
            },
            {
              key: 'planned-storage-capacity-A2',
              value: 'More than 6 months '
            },
            {
              key: 'planned-storage-capacity-A3',
              value: 'Less than 6 months',
              notEligible: true
            }
          ],
          yarKey: 'plannedStorageCapacity'
        },
        {
          key: 'project-type',
          order: 110,
          title: 'How will you increase your storage capacity?',
          baseUrl: 'project-type',
          backUrl: 'planned-storage-capacity',
          nextUrl: 'cover',
          url: 'project-type',
          preValidationKeys: [],
          ineligibleContent: {
            messageContent: `
            This grant is only for: <br> 
            <ul class="govuk-list govuk-list--bullet">
            <li>replacing an existing store that is no longer fit for purpose</li>
            <li>adding a new store to increase existing capacity</li>
            <li>expanding an existing store (for example, by adding an extra ring to a steel tank)</li>
            </ul>
            `,
            messageLink: {
              url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
              title: 'See other grants you may be eligible for.'
            }
          },
          type: 'single-answer',
          minAnswerCount: 1,
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: 'This grant is for:',
                items: [
                  'replacing an existing store that is no longer fit for purpose with a new store',
                  'adding a new store to increase existing capacity',
                  'expanding an existing store (for example, by adding an extra ring to a steel tank)'
                ],
                additionalPara: ''
              }]
            }],
            details: {
              summaryText: 'When is a store no longer fit for purpose?',
              html: '<ul class="govuk-list govuk-list--bullet">A store is no longer fit for purpose if it has reached the end of its design life and may be susceptible to leaks or failure.</ul>'
            }
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select how you will increase your storage capacity'
            }
          ],
          answers: [
            {
              key: 'project-type-A1',
              value: 'Replace an existing store that is no longer fit for purpose with a new store'
            },
            {
              key: 'project-type-A2',
              value: 'Add a new store to increase existing capacity'
            },
            {
              key: 'project-type-A3',
              value: 'Expand an existing store'
            },
            {
              value: 'divider'
            },
            {
              key: 'project-type-A4',
              value: 'None of the above',
              notEligible: true
            }
          ],
          yarKey: 'projectType'
        },
        {
          key: 'cover',
          order: 120,
          title: 'Will the grant-funded store have an impermeable cover?',
          baseUrl: 'cover',
          backUrl: 'project-type',
          nextUrl: 'estimated-grant',
          url: 'cover',
          preValidationKeys: [],
          ineligibleContent: {
            messageContent: 'Grant-funded stores must have an impermeable cover unless the slurry is treated with acidification.',
            messageLink: {
              url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
              title: 'See other grants you might be eligible for.'
            }
          },
          type: 'single-answer',
          minAnswerCount: 1,
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: `
                Grant-funded stores must have an impermeable cover unless the slurry is treated with acidification.
                
                Slurry acidification systems are not eligible for funding through this grant.`,
                items: []
              }]
            }],
            details: {
              summaryText: 'What is acidification?',
              html: '<ul class="govuk-list govuk-list--bullet">Acidification is the use of acid treatment to lower the pH value of slurry to stabilise ammonia emissions.</ul>'
            }
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select impermeable cover option'
            }
          ],
          answers: [
            {
              key: 'cover-A1',
              value: 'Yes'
            },
            {
              key: 'cover-A2',
              value: 'Not needed, the slurry is treated with acidification'
            },
            {
              key: 'cover-A3',
              value: 'No',
              notEligible: true
            }
          ],
          yarKey: 'cover'
        },
        {
          key: 'estimated-grant',
          order: 180,
          url: 'estimated-grant',
          backUrl: 'cover',
          nextUrl: 'standardised-cost',
          preValidationKeys: [],
          maybeEligible: true,
          maybeEligibleContent: {
            messageHeader: 'Estimate how much grant you could get',
            messageContent: 'Add some information about the project (for example, type of store and capacity, type of cover and size, approximate size and quantity of other items you need) so we can estimate how much grant you could get.'
          }
        },
        // Calls standardised cost page
        {
          key: 'storage-type',
          order: 130,
          costDataType: 'cat-storage',
          title: 'What type of store do you want?',
          baseUrl: 'storage-type',
          backUrl: 'standardised-cost',
          id: 'storageType',
          nextUrlObject: {
            dependentQuestionYarKey: 'projectType',
            dependentAnswerKeysArray: ['project-type-A1'],
            urlOptions: {
              thenUrl: 'serviceable-capacity-increase-replace',
              elseUrl: 'serviceable-capacity-increase-additional'
            }
          },
          url: 'storage-type',
          hint: {
            text: 'Select one option'
          },
          preValidationKeys: [],
          type: 'single-answer',
          minAnswerCount: 1,
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Please select an option'
            }
          ],
          answers: [],
          yarKey: 'storageType'
        },
        {
          key: 'serviceable-capacity-increase-replace',
          order: 131,
          title: '',
          pageTitle: '',
          url: 'serviceable-capacity-increase-replace',
          baseUrl: 'serviceable-capacity-increase-replace',
          backUrl: 'storage-type',
          nextUrlObject: {
            dependentQuestionYarKey: 'cover',
            dependentAnswerKeysArray: ['cover-A2'],
            urlOptions: {
              thenUrl: 'other-items',
              elseUrl: 'cover-type'
            }
          },
          fundingPriorities: '',
          preValidationKeys: [],
          classes: 'govuk-input--width-10',
          id: 'storageCapacityIncrease',
          name: 'storageCapacityIncrease',
          suffix: { text: 'm³' },
          type: 'input',
          label: {
            text: 'What estimated volume do you need to have 6 months’ serviceable storage?',
            classes: 'govuk-label--l',
            isPageHeading: true
          },
          hint: {
            html: `
            Use <a class="govuk-link" target="_blank" href="https://ahdb.org.uk/knowledge-library/slurry-wizard" rel="noopener noreferrer">Slurry Wizard</a> to help you calculate the difference between your current serviceable storage and 6 months’ serviceable storage, based on current animal numbers </br></br>
            Enter estimated volume in cubic metres
          `
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Enter the volume you need to have 6 months’ serviceable storage'
            },
            {
              type: 'REGEX',
              regex: WHOLE_NUMBER_REGEX,
              error: 'Volume must be a whole number'
            },
            {
              type: 'MIN_MAX',
              min: 1,
              max: 9999999999,
              error: 'Volume must be between 1-9999999999'
            }
          ],
          sidebar: {
            mainHeading: 'Your project items',
            values: [
              {
                heading: 'Store',
                content: [{
                  para: '',
                  items: [],
                  dependentAnswerExceptThese: []
                }]
              }
            ],
            dependentYarKeys: ['storageType'],
            dependentQuestionKeys: ['storage-type']
          },
          warning: {
            html: 'This grant is to get your serviceable storage levels to 6 months. Any capacity above 6 months is not covered by the grant'
          },
          yarKey: 'serviceCapacityIncrease'
        },
        {
          key: 'serviceable-capacity-increase-additional',
          order: 132,
          title: '',
          pageTitle: '',
          classes: 'govuk-input--width-10',
          url: 'serviceable-capacity-increase-additional',
          baseUrl: 'serviceable-capacity-increase-additional',
          backUrl: 'storage-type',
          nextUrlObject: {
            dependentQuestionYarKey: 'cover',
            dependentAnswerKeysArray: ['cover-A2'],
            urlOptions: {
              thenUrl: 'other-items',
              elseUrl: 'cover-type'
            }
          },
          preValidationKeys: [],
          suffix: { text: 'm³' },
          type: 'input',
          label: {
            text: 'What estimated additional volume do you need to have 6 months’ serviceable storage?',
            classes: 'govuk-label--l',
            isPageHeading: true
          },
          hint: {
            html: `
            Use <a class="govuk-link" target="_blank" href="https://ahdb.org.uk/knowledge-library/slurry-wizard" rel="noopener noreferrer">Slurry Wizard</a> to help you calculate the difference between your current serviceable storage and 6 months’ serviceable storage, based on current animal numbers </br></br>
            Enter estimated volume in cubic metres
          `
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Enter the volume you need to have 6 months’ serviceable storage'
            },
            {
              type: 'REGEX',
              regex: WHOLE_NUMBER_REGEX,
              error: 'Volume must be a whole number'
            },
            {
              type: 'MIN_MAX',
              min: 1,
              max: 9999999999,
              error: 'Volume must be between 1-9999999999'
            }
          ],
          sidebar: {
            mainHeading: 'Your project items',
            values: [
              {
                heading: 'Store',
                content: [{
                  para: '',
                  items: [],
                  dependentAnswerExceptThese: []
                }]
              }],
            dependentQuestionKeys: ['storage-type']
          },
          warning: {
            html: `This grant is to get your serviceable storage levels to 6 months.
            For example, if you have 4 months’ serviceable storage, we will fund another 2 months.
            </br> </br>
            Any capacity above 6 months is not covered by the grant.`
          },
          yarKey: 'serviceCapacityIncrease'
        },
        {
          key: 'cover-type',
          order: 133,
          costDataType: 'cat-cover-type',
          title: 'What type of cover will you have?',
          baseUrl: 'cover-type',
          backUrlObject: {
            dependentQuestionYarKey: 'projectType',
            dependentAnswerKeysArray: ['project-type-A1'],
            urlOptions: {
              thenUrl: 'serviceable-capacity-increase-replace',
              elseUrl: 'serviceable-capacity-increase-additional'
            }
          },
          nextUrlObject: {
            dependentQuestionYarKey: 'coverType',
            dependentAnswerKeysArray: ['cover-type-A4'],
            urlOptions: {
              thenUrl: 'other-items',
              elseUrl: 'cover-size'
            }
          },
          url: 'cover-type',
          preValidationKeys: [],
          hint: {
            text: 'Select one option'
          },
          type: 'single-answer',
          sidebar: {
            mainHeading: 'Your project items',
            values: [
              {
                heading: 'Store',
                content: [{
                  para: '',
                  items: [],
                  dependentAnswerExceptThese: []
                }]
              }],
            prefixSufix: [{
              linkedPrefix: 'Increase: ',
              linkedSufix: 'm³'
            }],
            linkedQuestionkey: ['serviceable-capacity-increase-replace'],
            dependentQuestionKeys: ['storage-type']
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Please select an option'
            }
          ],
          hintArray: ['Solid roof or lid with a flat deck or conical shape made from inflexible material such as fibreglass panels or polyester sheets', 'Taut skin made from flexible or pliant sheet material such as reinforced plastic sheeting or strong canvas', 'Flexible plastic sheet covers with some form of flotation or fixing to store sides to prevent movement'],
          answers: [
            {
              value: 'divider'
            },
            {
              key: 'cover-type-A4',
              value: 'I already have an impermeable cover'
            }
          ],
          yarKey: 'coverType'
        },
        {
          key: 'cover-size',
          order: 137,
          title: '',
          pageTitle: '',
          classes: 'govuk-input--width-10',
          url: 'cover-size',
          baseUrl: 'cover-size',
          backUrl: 'cover-type',
          nextUrl: 'other-items',
          preValidationKeys: [],
          suffix: { text: 'm²' },
          type: 'input',
          label: {
            text: 'How big will the cover be?',
            classes: 'govuk-label--l',
            isPageHeading: true
          },
          hint: {
            html: `
            Enter the estimated surface area of the replacement, new or expanded store

            Enter size in metres squared
          `
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Enter the size of cover'
            },
            {
              type: 'REGEX',
              regex: WHOLE_NUMBER_REGEX,
              error: 'Cover size must be a whole number'
            },
            {
              type: 'MIN_MAX',
              min: 1,
              max: 9999999999,
              error: 'Volume must be between 1-9999999999'
            }
          ],
          sidebar: {
            mainHeading: 'Your project items',
            values: [
              {
                heading: 'Store',
                content: [{
                  para: '',
                  items: [],
                  dependentAnswerExceptThese: []
                }]
              },
              {
                heading: 'Cover',
                content: [{
                  para: '',
                  items: [],
                  dependentAnswerExceptThese: []
                }]
              }],
            prefixSufix: [{
              linkedPrefix: 'Increase: ',
              linkedSufix: 'm³'
            }],
            linkedQuestionkey: ['serviceable-capacity-increase-replace'],
            dependentQuestionKeys: ['storage-type', 'cover-type']
          },
          yarKey: 'coverSize'
        },
        {
          key: 'other-items',
          order: 139,
          costDataType: 'other',
          title: 'What other items do you need?',
          baseUrl: 'other-items',
          backUrlObject: {
            dependentQuestionYarKey: ['cover', 'coverType'],
            dependentAnswerKeysArray: ['cover-A2', 'cover-type-A4'],
            urlOptions: {
              thenUrl: 'cover-type',
              elseUrl: 'cover-size',
              nonDependentUrl: 'storage-type'

            }
          },
          nextUrlObject: {
            dependentQuestionYarKey: 'otherItems',
            dependentAnswerKeysArray: ['other-items-A15'],
            urlOptions: {
              thenUrl: 'remaining-cost',
              elseUrl: 'item-sizes-quantities'
            }

          },
          hint: {
            text: 'Select all the items your project needs'
          },
          url: 'other-items',
          preValidationKeys: [],
          type: 'multi-answer',
          minAnswerCount: 1,
          sidebar: {
            mainHeading: 'Your project items',
            values: [
              {
                heading: 'Store',
                content: [{
                  para: '',
                  items: [],
                  dependentAnswerExceptThese: []
                }]
              },
              {
                heading: 'Cover',
                content: [{
                  para: '',
                  items: [],
                  dependentAnswerExceptThese: []
                }]
              }],
            prefixSufix: [{
              linkedPrefix: 'Increase: ',
              linkedSufix: 'm³'
            },
            {
              linkedPrefix: 'Size: ',
              linkedSufix: 'm³'
            }],
            linkedQuestionkey: ['serviceable-capacity-increase-replace', 'cover-size'],
            dependentQuestionKeys: ['storage-type', 'cover-type']
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Please select an option'
            },
            {
              type: 'STANDALONE_ANSWER',
              error: 'You cannot select that combination of options',
              standaloneObject: {
                questionKey: 'other-items',
                answerKey: 'other-items-A15'
              }
            }
          ],
          answers: [
            {
              value: 'divider'
            },
            {
              key: 'other-items-A15',
              value: 'None of the above',
              redirectUrl: 'project-summary'
            }
          ],
          yarKey: 'otherItems'
        },
        {
          key: 'item-sizes-quantities',
          order: 140,
          costDataKey: 'other',
          title: 'Item sizes and quantities',
          baseUrl: 'item-sizes-quantities',
          backUrl: 'other-items',
          nextUrl: 'project-summary',
          url: 'item-sizes-quantities',
          preValidationKeys: [],
          hint: {
            text: 'Enter the approximate size and quantities your project needs'
          },
          type: 'multi-input',
          sidebar: {
            mainHeading: 'Your project items',
            values: [
              {
                heading: 'Store',
                content: [{
                  para: '',
                  items: [],
                  dependentAnswerExceptThese: []
                }]
              },
              {
                heading: 'Cover',
                content: [{
                  para: '',
                  items: [],
                  dependentAnswerExceptThese: []
                }]
              },
              {
                heading: 'Other items',
                content: [{
                  para: '',
                  items: [],
                  dependentAnswerExceptThese: []
                }]
              }],
            prefixSufix: [{
              linkedPrefix: 'Increase: ',
              linkedSufix: 'm³'
            },
            {
              linkedPrefix: 'Size: ',
              linkedSufix: 'm³'
            }],
            linkedQuestionkey: ['serviceable-capacity-increase-replace', 'cover-size'],
            dependentQuestionKeys: ['storage-type', 'cover-type', 'other-items']
          },
          allFields: [],
          yarKey: 'itemSizeQuantities'
        },
        // CALLS PROJECT SUMMARY
        {
          key: 'potential-amount',
          order: 150,
          url: 'potential-amount',
          baseUrl: 'potential-amount',
          backUrl: 'project-summary',
          nextUrl: 'remaining-costs',
          preValidationKeys: [],
          grantInfo: {
            minGrant: 25000,
            maxGrant: 250000,
            grantPercentage: '',
            cappedGrant: false
          },
          ineligibleContent: {
            messageContent: 'The minimum grant you can claim is £25,000. The maximum grant is £250,000.',
            messageLink: {
              url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
              title: 'See other grants you may be eligible for.'
            }
          },
          maybeEligible: true,
          maybeEligibleContent: {
            messageHeader: 'Potential grant funding',
            messageContent: 'Based on the standardised costs for each item and the approximate size and quantities you entered, we estimate you could be eligible for a grant of £{{_itemsTotalValue_}}',
            warning: {
              text: 'There’s no guarantee the project will receive a grant.'
            }
          }
        },
        {
          key: 'remaining-costs',
          order: 190,
          title: 'Can you pay the remaining costs?',
          pageTitle: '',
          url: 'remaining-costs',
          baseUrl: 'remaining-costs',
          backUrl: 'potential-amount',
          nextUrl: 'planning-permission',
          eliminationAnswerKeys: '',
          ineligibleContent: {
            messageContent: `<p class="govuk-body">You cannot use public money (for example, grant funding from government or local authorities) towards the project costs.</p>
            <div class="govuk-list govuk-list--bullet">
                  You can use:
                  <ul>
                    <li>loans</li>
                    <li>overdrafts</li>
                    <li>the Basic Payment Scheme</li>
                  </ul>
            </div>`,
            messageLink: {
              url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
              title: 'See other grants you may be eligible for.'
            }
          },
          fundingPriorities: '',
          type: 'single-answer',
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          minAnswerCount: 1,
          sidebar: {
            values: [
              {
                heading: 'Eligibility',
                content: [{
                  para: `You cannot use public money (for example, grant funding from government or local authorities) towards the project costs.
                  
                  You can use:`,
                  items: [
                    'loans',
                    'overdrafts',
                    'the Basic Payment Scheme'
                  ]
                }]
              }
            ]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select if you can pay the remaining costs'
            }
          ],
          answers: [
            {
              key: 'remaining-costs-A1',
              value: 'Yes'

            },
            {
              key: 'remaining-costs-A2',
              value: 'No',
              notEligible: true
            }
          ],
          yarKey: 'remainingCosts'

        },
        {
          key: 'planning-permission',
          order: 142,
          title: 'Does the project have planning permission?',
          pageTitle: '',
          url: 'planning-permission',
          baseUrl: 'planning-permission',
          backUrl: 'remaining-costs',
          nextUrl: 'planning-permission-evidence',
          preValidationKeys: ['inEngland'],
          ineligibleContent: {
            messageContent: 'Any planning permission must be in place by 31 January 2024.',
            messageLink: {
              url: 'https://www.gov.uk/topic/farming-food-grants-payments/rural-grants-payments',
              title: 'See other grants you may be eligible for.'
            }
          },
          fundingPriorities: 'Improving Adding Value',
          type: 'single-answer',
          minAnswerCount: 1,
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: `Any planning permission must be in place by 31 December 2023. 

                      You must have applied for planning permission before you submit a full application.`
              }]
            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select your project planning permission'
            }
          ],
          answers: [
            {
              key: 'planning-permission-A1',
              value: 'Approved'
            },
            {
              key: 'planning-permission-A2',
              value: 'Applied for but not yet approved'
            },
            {
              key: 'planning-permission-A3',
              value: 'Not yet applied for but expected to be in place by 31 December 2023',
              redirectUrl: 'planning-permission-condition'
            }
          ],
          yarKey: 'planningPermission'
        },
        {
          key: 'planning-permission-condition',
          order: 145,
          url: 'planning-permission-condition',
          backUrl: 'planning-permission',
          nextUrl: 'grid-reference',
          maybeEligible: true,
          preValidationKeys: [],
          maybeEligibleContent: {
            messageHeader: 'You may be able to apply for a grant from this scheme',
            messageContent: 'Any planning permission must be in place by 31st December 2023.'
          },
          yarKey: 'PlanningPermissionCondition'
        },
        {
          key: 'planning-permission-evidence',
          order: 150,
          title: 'Your planning permission',
          hint: {
            text: 'Enter the name of your planning authority and your planning reference number'
          },
          url: 'planning-permission-evidence',
          baseUrl: 'planning-permission-evidence',
          backUrl: 'planning-permission',
          nextUrl: 'grid-reference',
          preValidationKeys: [],
          type: 'multi-input',
          allFields: [
            {
              yarKey: 'planningAuthority',
              type: 'text',
              classes: 'govuk-input--width-10',
              label: {
                text: 'Planning authority',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter planning authority'
                },
                {
                  type: 'REGEX',
                  regex: NAME_ONLY_REGEX,
                  error: 'Planning authority must only contain letters, hyphens and spaces'
                },
                {
                  type: 'REGEX',
                  regex: CHARS_MAX_50,
                  error: 'Planning authority must be 50 characters or fewer'
                }
              ]
            },
            {
              yarKey: 'planningReferenceNumber',
              type: 'text',
              classes: 'govuk-input--width-10',
              label: {
                text: 'Planning reference number',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter planning reference number'
                },
                {
                  type: 'REGEX',
                  regex: CHARS_MAX_50,
                  error: 'Planning reference number must be 50 characters of fewer'
                },
                {
                  type: 'REGEX',
                  regex: PLANNING_REFERENCE_NUMBER_REGEX,
                  error: 'Planning reference number must only include letters, numbers and /'
                }
              ]
            }],
          yarKey: 'PlanningPermissionEvidence'
        },
        {
          key: 'grid-reference',
          order: 152,
          url: 'grid-reference',
          backUrl: 'planning-permission-evidence',
          nextUrl: 'planning-permission-summary',
          title: 'What is the OS grid reference for your slurry store?',
          hint: {
            text: 'Enter OS grid reference number, for example AB12478975'
          },
          backUrlObject: {
            dependentQuestionYarKey: 'planningPermission',
            dependentAnswerKeysArray: ['planning-permission-A1', 'planning-permission-A2'],
            urlOptions: {
              thenUrl: 'planning-permission-evidence',
              elseUrl: 'planning-permission-condition'
            }
          },
          preValidationKeys: [],
          type: 'multi-input',
          allFields: [
            {
              yarKey: 'gridReferenceNumber',
              type: 'text',
              classes: 'govuk-input--width-10',
              label: {
                text: 'OS grid reference number',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter OS Grid reference'
                },
                {
                  type: 'REGEX',
                  regex: LETTERS_AND_NUMBERS_REGEX,
                  error: 'First two characters should be letter following eight characters must be numbers'
                },
                {
                  type: 'REGEX',
                  regex: TWO_NUMBERS_EIGHT_CHARS,
                  error: 'OS Grid Reference must be two letters followed by 8 digits'
                }
              ]
            }],
          yarKey: 'gridReference'
        },
        {
          key: 'planning-permission-summary',
          order: 153,
          title: 'Check your answers before getting your results',
          pageTitle: 'planning-permission-summary',
          url: 'planning-permission-summary',
          baseUrl: 'planning-permission-summary',
          backUrl: 'grid-reference',
          nextUrl: 'result-page',
          preValidationKeys: [],
          eliminationAnswerKeys: '',
          ineligibleContent: {},
          pageData: {
            planningPermissionLink: 'planning-permission',
            planningPermissionEvidenceLink: 'planning-permission-evidence',
            gridReferenceLink: 'grid-reference'
          },
          fundingPriorities: '',
          type: '',
          minAnswerCount: 1,
          answers: []
        },
        {
          key: 'result-page',
          order: 156,
          title: 'Check your answers before getting your results',
          url: 'result-page',
          baseUrl: 'result-page',
          backUrl: 'planning-permission-summary',
          nextUrl: 'business-details',
          maybeEligible: true,
          maybeEligibleContent: {
            messageHeader: 'Your results',
            messageContent: `Based on your answers, your project is:
            <div class="govuk-inset-text">
              <span class="govuk-heading-m">Eligible to apply</span>
              </div>
              <p class='govuk-body'>
              The RPA wants to fund projects that have a higher environmental benefit. <br/><br/>
              We will do this by prioritising projects in areas that need urgent action 
              to reduce nutrient pollution from agriculture and restore natural habitats.<br/><br/>
              Depending on the number of applications received, we may invite projects 
              outside these areas to submit a full application.</p>`,
            extraMessageContent: `
            <h2 class="govuk-heading-m">Next steps</h2>
            <p class="govuk-body">Next, add your business and contact details and submit them to the RPA (you should only do this once).
            <br/><br/>
            You’ll get an email with your answers and a reference number.</p>`
          },
          answers: []
        },

        /// ////// ***************** After Score  ************************************/////////////////////
        {
          key: 'business-details',
          order: 220,
          title: 'Business details',
          pageTitle: '',
          url: 'business-details',
          baseUrl: 'business-details',
          backUrl: 'result-page',
          nextUrl: 'applying',
          eliminationAnswerKeys: '',
          ineligibleContent: {},
          fundingPriorities: '',
          type: 'multi-input',
          minAnswerCount: '',
          maxAnswerCount: '',
          allFields: [
            {
              yarKey: 'projectName',
              type: 'text',
              classes: 'govuk-input--width-20',
              label: {
                text: 'Project name',
                classes: 'govuk-label'
              },
              hint: {
                text: 'For example, Browns Hill Farm lagoon expansion project'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter a project name'
                },
                {
                  type: 'MIN_MAX_CHARS',
                  min: 0,
                  max: 100,
                  error: 'Name must be 100 characters or fewer'
                }
              ]
            },
            {
              yarKey: 'businessName',
              type: 'text',
              classes: 'govuk-input--width-20',
              label: {
                text: 'Business name',
                classes: 'govuk-label'
              },
              hint: {
                text: "If you're registered on the Rural Payments system, enter business name as registered"
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter a business name'
                },
                {
                  type: 'MIN_MAX_CHARS',
                  min: 0,
                  max: 100,
                  error: 'Name must be 100 characters or fewer'
                }
              ]
            },
            {
              yarKey: 'numberEmployees',
              type: 'number',
              classes: 'govuk-input--width-10',
              label: {
                text: 'Number of employees',
                classes: 'govuk-label'
              },
              hint: {
                text: 'Full-time employees, including the owner'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter the number of employees'
                },
                {
                  type: 'REGEX',
                  regex: WHOLE_NUMBER_REGEX,
                  error: 'Number of employees must be a whole number, like 305'
                },
                {
                  type: 'MIN_MAX',
                  min: 1,
                  max: 9999999,
                  error: 'Number must be between 1-9999999'
                }
              ]
            },
            {
              yarKey: 'businessTurnover',
              type: 'number',
              classes: 'govuk-input--width-10',
              prefix: {
                text: '£'
              },
              label: {
                text: 'Business turnover',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter the business turnover'
                },
                {
                  type: 'REGEX',
                  regex: WHOLE_NUMBER_REGEX,
                  error: 'Business turnover must be a whole number, like 100000'
                },
                {
                  type: 'MIN_MAX',
                  min: 1,
                  max: 999999999,
                  error: 'Number must be between 1-999999999'
                }
              ]
            },
            {
              yarKey: 'sbi',
              type: 'text',
              title: 'Single Business Identifier (SBI)',
              classes: 'govuk-input govuk-input--width-10',
              label: {
                text: 'Single Business Identifier (SBI) (Optional)',
                classes: 'govuk-label'
              },
              hint: {
                html: 'If you do not have an SBI, you will need to get one for full application'
              },
              validate: [
                {
                  type: 'REGEX',
                  regex: SBI_REGEX,
                  error: 'SBI number must have 9 characters, like 011115678'
                }
              ]
            }
          ],
          yarKey: 'businessDetails'

        },
        {
          key: 'applying',
          order: 230,
          title: 'Who is applying for this grant?',
          pageTitle: '',
          url: 'applying',
          baseUrl: 'applying',
          backUrl: 'business-details',
          preValidationKeys: ['businessDetails'],
          eliminationAnswerKeys: '',
          fundingPriorities: '',
          type: 'single-answer',
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          minAnswerCount: 1,
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select who is applying for this grant'
            }
          ],
          answers: [
            {
              key: 'applying-A1',
              value: 'Applicant',
              redirectUrl: 'applicant-details'
            },
            {
              key: 'applying-A2',
              value: 'Agent',
              redirectUrl: 'agent-details'
            }
          ],
          yarKey: 'applying'
        },
        {
          key: 'farmer-details',
          order: 240,
          title: 'Applicant’s details',
          pageTitle: '',
          url: 'applicant-details',
          baseUrl: 'applicant-details',
          nextUrl: 'check-details',
          preValidationKeys: ['applying'],
          eliminationAnswerKeys: '',
          backUrlObject: {
            dependentQuestionYarKey: 'applying',
            dependentAnswerKeysArray: ['applying-A2'],
            urlOptions: {
              thenUrl: 'agent-details',
              elseUrl: 'applying'
            }
          },
          fundingPriorities: '',
          type: 'multi-input',
          minAnswerCount: '',
          maxAnswerCount: '',
          ga: [{ dimension: 'cd3', value: { type: 'yar', key: 'applying' } }],
          allFields: [
            {
              type: 'sub-heading',
              text: 'Name'
            },
            {
              yarKey: 'firstName',
              type: 'text',
              classes: 'govuk-input--width-20',
              label: {
                text: 'First name',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your first name'
                },
                {
                  type: 'REGEX',
                  regex: NAME_ONLY_REGEX,
                  error: 'Name must only include letters, hyphens and apostrophes'
                }
              ]
            },
            {
              yarKey: 'lastName',
              type: 'text',
              endFieldset: 'true',
              classes: 'govuk-input--width-20',
              label: {
                text: 'Last name',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your last name'
                },
                {
                  type: 'REGEX',
                  regex: NAME_ONLY_REGEX,
                  error: 'Name must only include letters, hyphens and apostrophes'
                }
              ]
            },
            {
              type: 'sub-heading',
              text: 'Contact details'
            },
            {
              yarKey: 'emailAddress',
              type: 'email',
              classes: 'govuk-input--width-20',
              label: {
                text: 'Email address',
                classes: 'govuk-label'
              },
              hint: {
                text: 'We will only use this to send you confirmation'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your email address'
                },
                {
                  type: 'REGEX',
                  regex: EMAIL_REGEX,
                  error: 'Enter an email address in the correct format, like name@example.com'
                }
              ]
            },
            {
              yarKey: 'mobileNumber',
              type: 'tel',
              classes: 'govuk-input--width-10',
              label: {
                text: 'Mobile number',
                classes: 'govuk-label'
              },
              hint: {
                text: 'We will only use this to contact you about your application'
              },
              validate: [
                {
                  type: 'NOT_EMPTY_EXTRA',
                  error: 'Enter a mobile number (if you do not have a mobile, enter your landline number)',
                  extraFieldsToCheck: ['landlineNumber']
                },
                {
                  type: 'REGEX',
                  regex: CHARS_MIN_10,
                  error: 'Your mobile number must have at least 10 characters'
                },
                {
                  type: 'REGEX',
                  regex: PHONE_REGEX,
                  error: 'Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 0808 157 0192'
                }
              ]
            },
            {
              yarKey: 'landlineNumber',
              endFieldset: 'true',
              type: 'tel',
              classes: 'govuk-input--width-10',
              label: {
                text: 'Landline number',
                classes: 'govuk-label'
              },
              hint: {
                text: 'We will only use this to contact you about your application'
              },
              validate: [
                {
                  type: 'NOT_EMPTY_EXTRA',
                  error: 'Enter a landline number (if you do not have a landline, enter your mobile number)',
                  extraFieldsToCheck: ['mobileNumber']
                },
                {
                  type: 'REGEX',
                  regex: CHARS_MIN_10,
                  error: 'Your landline number must have at least 10 characters'
                },
                {
                  type: 'REGEX',
                  regex: PHONE_REGEX,
                  error: 'Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 0808 157 0192'
                }
              ]
            },
            {
              type: 'sub-heading',
              text: 'Business address'
            },
            {
              yarKey: 'address1',
              type: 'text',
              classes: 'govuk-input--width-20',
              label: {
                html: 'Building and street <span class="govuk-visually-hidden">line 1 of 2</span>',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your building and street details'
                }
              ]
            },
            {
              yarKey: 'address2',
              type: 'text',
              classes: 'govuk-input--width-20',
              label: {
                html: '<span class="govuk-visually-hidden">Building and street line 2 of 2</span>',
                classes: 'govuk-label'
              }
            },
            {
              yarKey: 'town',
              type: 'text',
              classes: 'govuk-input--width-10',
              label: {
                text: 'Town',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your town'
                },
                {
                  type: 'REGEX',
                  regex: ONLY_TEXT_REGEX,
                  error: 'Town must only include letters'
                }
              ]
            },
            {
              yarKey: 'county',
              type: 'select',
              classes: 'govuk-input--width-10',
              label: {
                text: 'County',
                classes: 'govuk-label'
              },
              answers: [
                ...LIST_COUNTIES
              ],
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Select your county'
                }
              ]
            },
            {
              yarKey: 'postcode',
              type: 'text',
              classes: 'govuk-input--width-5',
              label: {
                text: 'Business postcode',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your business postcode, like AA1 1AA'
                },
                {
                  type: 'REGEX',
                  regex: POSTCODE_REGEX,
                  error: 'Enter a business postcode, like AA1 1AA'
                }
              ]
            },
            {
              yarKey: 'projectPostcode',
              type: 'text',
              endFieldset: 'true',
              classes: 'govuk-input--width-5',
              label: {
                text: 'Project postcode',
                classes: 'govuk-label'
              },
              hint: {
                text: 'The site postcode where the work will happen'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your project postcode, like AA1 1AA'
                },
                {
                  type: 'REGEX',
                  regex: POSTCODE_REGEX,
                  error: 'Enter a project postcode, like AA1 1AA'
                }
              ]
            }
          ],
          yarKey: 'farmerDetails'

        },
        {
          key: 'agent-details',
          order: 250,
          title: 'Agent’s details',
          pageTitle: '',
          url: 'agent-details',
          baseUrl: 'agent-details',
          backUrl: 'applying',
          nextUrl: 'applicant-details',
          summaryPageUrl: 'check-details',
          preValidationKeys: ['applying'],
          eliminationAnswerKeys: '',
          ineligibleContent: {},
          fundingPriorities: '',
          type: 'multi-input',
          minAnswerCount: '',
          maxAnswerCount: '',
          allFields: [
            {
              type: 'sub-heading',
              text: 'Name'
            },
            {
              yarKey: 'firstName',
              type: 'text',
              classes: 'govuk-input--width-20',
              label: {
                text: 'First name',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your first name'
                },
                {
                  type: 'REGEX',
                  regex: NAME_ONLY_REGEX,
                  error: 'Name must only include letters, hyphens and apostrophes'
                }
              ]
            },
            {
              yarKey: 'lastName',
              type: 'text',
              classes: 'govuk-input--width-20',
              label: {
                text: 'Last name',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your last name'
                },
                {
                  type: 'REGEX',
                  regex: NAME_ONLY_REGEX,
                  error: 'Name must only include letters, hyphens and apostrophes'
                }
              ]
            },
            {
              yarKey: 'businessName',
              type: 'text',
              endFieldset: 'true',
              classes: 'govuk-input--width-20',
              label: {
                text: 'Business name',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your business name'
                },
                {
                  type: 'MIN_MAX_CHARS',
                  min: 0,
                  max: 100,
                  error: 'Name must be 100 characters or fewer'
                }
              ]
            },
            {
              type: 'sub-heading',
              text: 'Contact details'
            },
            {
              yarKey: 'emailAddress',
              type: 'email',
              classes: 'govuk-input--width-20',
              label: {
                text: 'Email address',
                classes: 'govuk-label'
              },
              hint: {
                text: 'We will only use this to send you confirmation'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your email address'
                },
                {
                  type: 'REGEX',
                  regex: EMAIL_REGEX,
                  error: 'Enter an email address in the correct format, like name@example.com'
                }
              ]
            },
            {
              yarKey: 'mobileNumber',
              type: 'tel',
              classes: 'govuk-input--width-10',
              label: {
                text: 'Mobile number',
                classes: 'govuk-label'
              },
              hint: {
                text: 'We will only use this to contact you about your application'
              },
              validate: [
                {
                  type: 'NOT_EMPTY_EXTRA',
                  error: 'Enter a mobile number (if you do not have a mobile, enter your landline number)',
                  extraFieldsToCheck: ['landlineNumber']
                },
                {
                  type: 'REGEX',
                  regex: CHARS_MIN_10,
                  error: 'Your mobile number must have at least 10 characters'
                },
                {
                  type: 'REGEX',
                  regex: PHONE_REGEX,
                  error: 'Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 0808 157 0192'
                }
              ]
            },
            {
              yarKey: 'landlineNumber',
              type: 'tel',
              endFieldset: 'true',
              classes: 'govuk-input--width-10',
              label: {
                text: 'Landline number',
                classes: 'govuk-label'
              },
              hint: {
                text: 'We will only use this to contact you about your application'
              },
              validate: [
                {
                  type: 'NOT_EMPTY_EXTRA',
                  error: 'Enter a landline number (if you do not have a landline, enter your mobile number)',
                  extraFieldsToCheck: ['mobileNumber']
                },
                {
                  type: 'REGEX',
                  regex: CHARS_MIN_10,
                  error: 'Your landline number must have at least 10 characters'
                },
                {
                  type: 'REGEX',
                  regex: PHONE_REGEX,
                  error: 'Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 0808 157 0192'
                }
              ]
            },
            {
              type: 'sub-heading',
              text: 'Business address'
            },
            {
              yarKey: 'address1',
              type: 'text',
              classes: 'govuk-input--width-20',
              label: {
                html: 'Building and street <span class="govuk-visually-hidden">line 1 of 2</span>',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your building and street details'
                }
              ]
            },
            {
              yarKey: 'address2',
              type: 'text',
              classes: 'govuk-input--width-20',
              label: {
                html: '<span class="govuk-visually-hidden">Building and street line 2 of 2</span>',
                classes: 'govuk-label'
              }
            },
            {
              yarKey: 'town',
              type: 'text',
              classes: 'govuk-input--width-10',
              label: {
                text: 'Town',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your town'
                },
                {
                  type: 'REGEX',
                  regex: ONLY_TEXT_REGEX,
                  error: 'Town must only include letters'
                }
              ]
            },
            {
              yarKey: 'county',
              type: 'select',
              classes: 'govuk-input--width-10',
              label: {
                text: 'County',
                classes: 'govuk-label'
              },
              answers: [
                ...LIST_COUNTIES
              ],
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Select your county'
                }
              ]
            },
            {
              yarKey: 'postcode',
              type: 'text',
              endFieldset: 'true',
              classes: 'govuk-input--width-5',
              label: {
                text: 'Postcode',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your postcode, like AA1 1AA'
                },
                {
                  type: 'REGEX',
                  regex: POSTCODE_REGEX,
                  error: 'Enter a postcode, like AA1 1AA'
                }
              ]
            }
          ],
          yarKey: 'agentsDetails'

        },
        {
          key: 'check-details',
          order: 260,
          title: 'Check your details',
          pageTitle: 'Check details',
          url: 'check-details',
          backUrl: 'applicant-details',
          nextUrl: 'confirm',
          preValidationKeys: ['applying'],
          eliminationAnswerKeys: '',
          ineligibleContent: {},
          pageData: {
            businessDetailsLink: 'business-details',
            agentDetailsLink: 'agent-details',
            farmerDetailsLink: 'applicant-details'
          },
          fundingPriorities: '',
          type: '',
          minAnswerCount: 1,
          answers: []
        },
        {
          key: 'confirm',
          title: 'Confirm and send',
          order: 270,
          url: 'confirm',
          backUrl: 'check-details',
          nextUrl: 'confirmation',
          preValidationKeys: ['farmerDetails'],
          preValidationKeysRule: { condition: 'ANY' },
          maybeEligible: true,
          maybeEligibleContent: {
            messageHeader: 'Confirm and send',
            messageContent: `I confirm that, to the best of my knowledge, the details I have provided are correct.</br></br>
            I understand the project’s eligibility and estimated grant amount is based on the answers I provided.</br></br>
            I am aware that the information I submit will be:</br>
            <ul>
              <li>checked by the RPA</li>
              <li>passed to Natural England so they can contact me to provide advice on my project</li>
              <li>passed to the Environment Agency so that they are aware of my planned project</li>
            </ul></br>
            I am aware that if my project is successful, details of my full application will be shared with the Environment Agency so they can provide assurance on the project location and store design.</br></br>
            I am happy to be contacted by Defra and RPA (or third-party on their behalf) about my application.</br></br>
            So that we can continue to improve our services and schemes, we may wish to contact you in the future. Please confirm if you are happy for us, or a third-party working for us, to contact you.`
          },
          answers: [
            {
              key: 'consentOptional',
              value: 'CONSENT_OPTIONAL'
            }
          ],
          yarKey: 'consentOptional'
        },
        {
          key: 'reference-number',
          order: 280,
          title: 'Details submitted',
          pageTitle: '',
          url: 'confirmation',
          baseUrl: 'confirmation',
          preValidationKeys: ['consentOptional'],
          ga: [
            { dimension: 'cd2', value: { type: 'score' } },
            { dimension: 'cd5', value: { type: 'confirmationId' } },
            { dimension: 'cm1', value: { type: 'journey-time' } }
          ],
          maybeEligible: true,
          maybeEligibleContent: {
            reference: {
              titleText: 'Details submitted',
              html: 'Your reference number<br><strong>{{_confirmationId_}}</strong>',
              surveyLink: process.env.SURVEY_LINK
            },
            messageContent: `We have sent you a confirmation email with a record of your answers.<br/><br/>
            If you do not get an email within 72 hours, please call the RPA helpline and follow the options for the Farming Transformation Fund scheme:<br/>
            <h1 class="govuk-heading-m">RPA helpline</h1>
            <h2 class="govuk-heading-s">Telephone</h2>
            Telephone: 03000 200 301<br/>
            Monday to Friday, 9am to 5pm (except public holidays)<br/>
            <p><a class="govuk-link" target="_blank" href="https://www.gov.uk/call-charges" rel="noopener noreferrer">Find out about call charges</a></p>
            <h2 class="govuk-heading-s">Email</h2>
            <a class="govuk-link" title="Send email to RPA" target="_blank" rel="noopener noreferrer" href="mailto:ftf@rpa.gov.uk">FTF@rpa.gov.uk</a><br/><br/>
            
            <h2 class="govuk-heading-m">What happens next</h2>
            <p>1. RPA will be in touch when the full application period opens to tell you if your project is invited to submit a full application form.</p>
            <p>2. If you submit an application, RPA will assess it is eligible and meets the rules of the grant.</p>
            <p>3. If your application is successful, you’ll be sent a funding agreement and can begin work on the project.</p>
            `,
            warning: {
              text: 'You must not start the project'
            },
            extraMessageContent: `<p>Starting the project or committing to any costs (such as placing orders) before you receive a funding agreement will invalidate your application.</p> 
            <p>Before you start the project, you can:</p>
            <ul>
              <li>get quotes from suppliers</li>
              <li>apply for planning permission</li>
            </ul>
            <p class="govuk-body"><a class="govuk-link" href="${process.env.SURVEY_LINK}" target="_blank" rel="noopener noreferrer">What do you think of this service?</a></p>
            `
          },
          fundingPriorities: '',
          type: '',
          minAnswerCount: 1,
          answers: []
        }
      ]
    }
  ]
}

const ALL_QUESTIONS = []
questionBank.sections.forEach(({ questions }) => {
  ALL_QUESTIONS.push(...questions)
})
const ALL_URLS = []
ALL_QUESTIONS.forEach(item => ALL_URLS.push(item.url))

const YAR_KEYS = ['itemsTotalValue']
ALL_QUESTIONS.forEach(item => YAR_KEYS.push(item.yarKey))
module.exports = {
  questionBank,
  ALL_QUESTIONS,
  YAR_KEYS,
  ALL_URLS
}
