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
  EMAIL_REGEX
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
    name: 'Adding Value'
  },
  sections: [
    {
      name: 'eligibility',
      title: 'Eligibility',
      questions: [
        {
          key: 'nature-of-business',
          order: 10,
          title: 'What is your business?',
          pageTitle: '',
          backUrl: 'start',
          nextUrl: 'legal-status',
          url: 'nature-of-business',
          baseUrl: 'nature-of-business',
          type: 'single-answer',
          fundingPriorities: '',
          minAnswerCount: 1,
          ga: [{ journeyStart: true }],
          ineligibleContent: {
            messageContent: `
            <span>This grant is for businesses who:</span>
            <ul class="govuk-body">
              <li>are agricultural or horticultural growers or producers</li>
              <li>are a business processing agricultural or horticultural products that is at least 50% owned by agricultural or horticultural producers</li>
            </ul>`,
            messageLink: {
              url: 'https://www.gov.uk/topic/farming-food-grants-payments/rural-grants-payments',
              title: 'See other grants you may be eligible for.'
            }
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select the option that applies to your business'
            }
          ],
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: 'This grant is for businesses who:',
                items: [
                  'are agricultural or horticultural growers or producers',
                  'are a business processing agricultural or horticultural products that is at least 50% owned by agricultural or horticultural producers'
                ]
              }]
            }]
          },
          validations: [],
          answers: [
            {
              key: 'nature-of-business-A1',
              value: 'A grower or producer of agricultural or horticultural produce',
              hint: {
                text: 'For example, arable or livestock farmer, fruit producer, salad grower'
              }
            },
            {
              key: 'nature-of-business-A2',
              value: 'A business processing agricultural or horticultural products that is at least 50% owned by agricultural or horticultural producers',
              hint: {
                text: 'For example, cheese processing business owned by a dairy farmer'
              }
            },
            {
              value: 'divider'
            },
            {
              key: 'nature-of-business-A3',
              value: 'None of the above',
              notEligible: true
            }
          ],
          yarKey: 'applicantBusiness'
        },
        {
          key: 'legal-status',
          order: 20,
          title: 'What is the legal status of the business?',
          pageTitle: '',
          backUrl: 'nature-of-business',
          nextUrl: 'country',
          url: 'legal-status',
          baseUrl: 'legal-status',
          preValidationKeys: ['applicantBusiness'],
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
          errorMessage: {
            text: ''
          },
          yarKey: 'legalStatus'
        },
        {
          key: 'country',
          order: 30,
          title: 'Is the planned project in England?',
          hint: {
            text: 'The site where the work will happen'
          },
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          pageTitle: '',
          backUrl: 'legal-status',
          nextUrl: 'planning-permission',
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
              conditional: true,
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
          key: 'planning-permission',
          order: 40,
          title: 'Does the project have planning permission?',
          pageTitle: '',
          url: 'planning-permission',
          baseUrl: 'planning-permission',
          backUrl: 'country',
          nextUrl: 'project-start',
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
                para: `You must have secured planning permission before you submit a full application.
                
                Any planning permission must be in place by 31 January 2024.`
              }]
            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select when the project will have planning permission'
            }
          ],
          answers: [
            {
              key: 'planning-permission-A1',
              value: 'Not needed'
            },
            {
              key: 'planning-permission-A2',
              value: 'Secured'
            },
            {
              key: 'planning-permission-A3',
              value: 'Should be in place by 31 January 2024',
              redirectUrl: 'planning-required-condition'
            },
            {
              key: 'planning-permission-A4',
              value: 'Will not be in place by 31 January 2024',
              notEligible: true
            }
          ],
          yarKey: 'planningPermission'
        },
        {
          key: 'planning-required-condition',
          order: 91,
          url: 'planning-required-condition',
          backUrl: 'planning-permission',
          nextUrl: 'project-start',
          maybeEligible: true,
          preValidationKeys: ['planningPermission'],
          maybeEligibleContent: {
            messageHeader: 'You may be able to apply for this grant',
            messageContent: 'Any planning permission must be in place by 31 January 2024.'
          }
        },
        {
          key: 'project-location-owned-rented',
          order: 40,
          title: 'Is the project location site owned or rented by applicant?',
          pageTitle: '',
          url: 'project-location-owned-rented',
          baseUrl: 'project-location-owned-rented',
          backUrl: 'planning-permission',
          nextUrl: 'project-start',
          preValidationKeys: ['planningPermission'],
          ineligibleContent: {
            messageContent: 'The land must be owned by the applicant, or there must be a tenancy in place to at least 2026, before the project starts.',
            messageLink: {
              url: 'https://www.gov.uk/topic/farming-food-grants-payments/rural-grants-payments',
              title: 'See other grants you may be eligible for.'
            }
          },
          fundingPriorities: 'Improving Adding Value',
          type: 'single-answer',
          minAnswerCount: 1,
          sidebar: {
            values: [
              {
                heading: 'Eligibility',
                content: [{
                  para: 'The land must be owned by the applicant, or there must be a tenancy in place to at least 2026, before the project starts.',
                  items: []
                }]
              }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select when the project will have planning permission'
            }
          ],
          answers: [
            {
              key: 'project-location-owned-rented-A1',
              value: 'Owned'
            },
            {
              key: 'project-location-owned-rented-A2',
              value: 'A Long term lease (to at least 2026) is, or will be, in place before the project starts'
            },
            {
              key: 'project-location-owned-rented-A4',
              value: 'A long-term lease will not be in place before project start',
              notEligible: true
            }
          ],
          yarKey: 'projectLocationOwnedRented'
        },
        {
          key: 'project-start',
          order: 50,
          title: 'Have you already started work on the project?',
          pageTitle: '',
          url: 'project-start',
          baseUrl: 'project-start',
          backUrlObject: {
            dependentQuestionYarKey: 'planningPermission',
            dependentAnswerKeysArray: ['planning-permission-A3'],
            urlOptions: {
              thenUrl: '/adding-value/planning-required-condition',
              elseUrl: '/adding-value/planning-permission'
            }
          },
          nextUrl: 'tenancy',
          preValidationKeys: ['planningPermission'],
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
              key: 'project-start-A1',
              value: 'Yes, preparatory work',
              hint: {
                text: 'For example, quotes from suppliers, applying for planning permission'
              }
            },
            {
              key: 'project-start-A2',
              value: 'Yes, we have begun project work',
              hint: {
                text: 'For example, started construction work, signing contracts, placing orders'
              },
              notEligible: true
            },
            {
              key: 'project-start-A3',
              value: 'No, we have not done any work on this project yet'
            }
          ],
          yarKey: 'projectStart'
        },
        {
          key: 'tenancy',
          order: 60,
          title: 'Is the planned project on land the business owns?',
          hint: {
            text: 'The site where the work will happen'
          },
          pageTitle: '',
          url: 'tenancy',
          baseUrl: 'tenancy',
          backUrl: 'project-start',
          nextUrl: 'project-items',
          preValidationKeys: ['projectStart'],
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: 'You must own the land or have a tenancy in place until 2028 before starting the project.'
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
          order: 70,
          title: 'Do you have a tenancy agreement until 2028 or after?',
          pageTitle: '',
          url: 'tenancy-length',
          baseUrl: 'tenancy-length',
          backUrl: 'tenancy',
          preValidationKeys: ['tenancy'],
          nextUrl: 'project-items',
          eliminationAnswerKeys: '',
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: 'You must own the land or have a tenancy in place until 2028 before starting the project.',
                items: []
              }]
            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if the land has a tenancy agreement in place until 2028 or after'
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
          order: 75,
          url: 'tenancy-length-condition',
          backUrl: 'tenancy',
          preValidationKeys: ['tenancy'],
          nextUrl: 'project-items',
          maybeEligible: true,
          maybeEligibleContent: {
            messageHeader: 'You may be able to apply for a grant from this scheme',
            messageContent: 'You will need to extend your tenancy agreement before you can complete a full application.'
          }
        },
        {
          key: 'project-items',
          order: 80,
          title: 'What eligible items does your project need?',
          pageTitle: '',
          hint: {
            html: `
            Storage facilities will only be funded as part of a bigger project and cannot be more than 50% of total grant funding.<br/><br/>
            Select all the items your project needs
          `
          },
          url: 'project-items',
          baseUrl: 'project-items',
          backUrl: 'tenancy',
          nextUrl: 'storage',
          fundingPriorities: '',
          preValidationKeys: ['projectStart', 'tenancy'],
          type: 'multi-answer',
          minAnswerCount: 1,
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select all the items your project needs'
            }
          ],
          answers: [
            {
              key: 'project-items-A1',
              value: 'Constructing or improving buildings for processing',
              hint: {
                text: 'For example, a new building for cheese making, extending an existing building to install a new meat-cutting and packing line'
              }
            },
            {
              key: 'project-items-A2',
              value: 'Processing equipment or machinery',
              hint: {
                text: 'For example, equipment and machinery for pasteurising and bottling milk, a meat cutting and packing line or vegetable washing and packing'
              }
            },
            {
              key: 'project-items-A3',
              value: 'Retail facilities',
              hint: {
                text: 'For example, shops or display cabinets'
              }
            }
          ],
          yarKey: 'projectItems'
        },
        {
          key: 'storage',
          order: 81,
          title: 'Does your project also need storage facilities?',
          pageTitle: '',
          url: 'storage',
          baseUrl: 'storage',
          backUrl: 'project-items',
          nextUrl: 'project-cost',
          preValidationKeys: ['projectItems'],
          hint: {
            text: 'For example, cold stores or controlled atmosphere storage'
          },
          warning: {
            text: 'Storage facilities cannot be more than 50% of the total grant funding.',
            iconFallbackText: 'Warning'
          },
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if you will need storage facilities'
            }
          ],
          answers: [
            {
              key: 'storage-A1',
              value: 'Yes, we will need storage facilities',
              sidebarFormattedValue: 'Storage facilities'
            },
            {
              key: 'storage-A2',
              value: 'No, we don’t need it'
            }
          ],
          yarKey: 'storage'
        },
        {
          key: 'project-cost',
          order: 90,
          pageTitle: '',
          url: 'project-cost',
          baseUrl: 'project-cost',
          backUrl: 'storage',
          nextUrl: 'potential-amount',
          preValidationKeys: ['storage'],
          classes: 'govuk-input--width-10',
          id: 'projectCost',
          name: 'projectCost',
          prefix: { text: '£' },
          type: 'input',
          grantInfo: {
            minGrant: 25000,
            maxGrant: 300000,
            grantPercentage: 40,
            cappedGrant: true
          },
          label: {
            text: 'What is the total estimated cost of the items?',
            classes: 'govuk-label--l',
            isPageHeading: true
          },
          hint: {
            html: `
              You can only apply for a grant of up to 40% of the estimated costs.
              <br/>The minimum grant you can apply for this project is £25,000 (40% of £62,500).
              <br/>The maximum grant is £300,000.
              <br/><br/>Do not include VAT.
              <br/><br/>Enter amount, for example 95,000`
          },
          eliminationAnswerKeys: '',
          ineligibleContent: {
            messageContent: 'You can only apply for a grant of up to 40% of the estimated costs.',
            insertText: { text: 'The minimum grant you can apply for is £25,000 (40% of £62,500). The maximum grant is £300,000.' },
            messageLink: {
              url: 'https://www.gov.uk/topic/farming-food-grants-payments/rural-grants-payments',
              title: 'See other grants you may be eligible for.'
            }
          },
          sidebar: {
            values: [
              {
                heading: 'Selected items',
                content: [{
                  para: '',
                  items: [],
                  dependentAnswerExceptThese: ['storage-A2']
                }]
              }
            ],
            dependentYarKeys: ['projectItems', 'storage'],
            dependentQuestionKeys: ['project-items', 'storage']

          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Enter the estimated cost for the items'
            },
            {
              type: 'REGEX',
              regex: CURRENCY_FORMAT,
              error: 'Enter a whole number in correct format'
            },
            {
              type: 'REGEX',
              regex: CHARS_MAX_10,
              error: 'Enter a whole number with a maximum of 10 digits'
            }
          ],
          answers: [],
          yarKey: 'projectCost'
        },
        {
          key: 'potential-amount',
          order: 91,
          url: 'potential-amount',
          backUrl: 'project-cost',
          nextUrl: 'remaining-costs',
          preValidationKeys: ['projectCost'],
          maybeEligible: true,
          maybeEligibleContent: {
            messageHeader: 'Potential grant funding',
            messageContent: 'You may be able to apply for a grant of up to £{{_calculatedGrant_}}, based on the estimated cost of £{{_projectCost_}}.',
            warning: {
              text: 'There’s no guarantee the project will receive a grant.',
              iconFallbackText: 'Warning'
            }
          }
        },
        {
          key: 'remaining-costs',
          order: 110,
          title: 'Can you pay the remaining costs of £{{_remainingCost_}}?',
          pageTitle: '',
          url: 'remaining-costs',
          baseUrl: 'remaining-costs',
          backUrl: 'project-cost',
          nextUrl: 'produce-processed',
          eliminationAnswerKeys: '',
          ineligibleContent: {
            messageContent: `You cannot use public money (for example, grant funding from government or local authorities) towards the project costs.
            <br/><br/>You also cannot use money from a producer organisation under the Fresh Fruit and Vegetable Aid Scheme.`,
            insertText: {
              html: `You can use:
              <ul>
              <li>loans</li>
              <li>overdrafts</li>
              <li>the Basic Payment Scheme</li>
              <li> agri-environment schemes such as the Countryside Stewardship Scheme</li>
              </ul>`
            },
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
                  
                  You also cannot use money from a producer organisation under the Fresh Fruit and Vegetable Aid Scheme.
                  
                  You can use:`,
                  items: [
                    'loans',
                    'overdrafts',
                    'the Basic Payment Scheme',
                    'agri-environment schemes such as the Countryside Stewardship Scheme'
                  ]
                }]
              }
            ]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if you can pay the remaining costs without using any other grant money'
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
          yarKey: 'canPayRemainingCost'

        },
        {
          key: 'products-processed',
          order: 120,
          title: 'What type of produce is being processed?',
          pageTitle: '',
          hint: {
            text: 'Select one option'
          },
          url: 'produce-processed',
          baseUrl: 'produce-processed',
          backUrl: 'remaining-costs',
          nextUrl: 'how-adding-value',
          preValidationKeys: ['canPayRemainingCost'],
          score: {
            isScore: true,
            isDisplay: true,
            title: 'Produce processed'
          },
          ineligibleContent: {
            messageContent: '',
            insertText: { text: '' },
            messageLink: {
              url: '',
              title: ''
            }
          },
          sidebar: {
            values: [{
              heading: 'Funding priorities',
              content: [{
                para: 'RPA wants to fund projects that:',
                items: [
                  'create and expand processing capacity to provide more English-grown food for consumers to buy'
                ]
              }]
            }]
          },
          fundingPriorities: 'Create and expand processing capacity to provide more English-grown food for consumers to buy',
          type: 'single-answer',
          classes: 'govuk-fieldset__legend--l',
          minAnswerCount: 1,
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select the type of produce being processed'
            }
          ],
          answers: [
            {
              key: 'products-processed-A1',
              value: 'Arable produce',
              hint: {
                text: 'For example, crushing of oilseeds, rolling or flaking of grains as food ingredients'
              }
            },
            {
              key: 'products-processed-A2',
              value: 'Horticultural produce',
              hint: {
                text: 'For example, grading and packing of soft fruit, washing and packing vegetables, packing salad crops'
              }
            },
            {
              key: 'products-processed-A3',
              value: 'Dairy or meat produce',
              hint: {
                text: 'For example, processing and bottling milk or slaughtering, cutting, processing and packing meat'
              }
            },
            {
              key: 'products-processed-A5',
              value: 'Fodder produce',
              hint: {
                text: 'For example, processing and repacking hay and straw for specialist markets or retail sale'
              }
            },
            {
              key: 'products-processed-A6',
              value: 'Non-edible produce',
              hint: {
                text: 'For example, processing and packing ornamental flowers and bulbs after harvesting'
              }
            },
            {
              key: 'products-processed-A7',
              value: 'Fibre produce',
              hint: {
                text: 'For example, processing animal hides and leather, processing fibres such as flax and hemp'
              }
            }
          ],
          yarKey: 'productsProcessed'
        },
        {
          key: 'how-adding-value',
          order: 130,
          title: 'How will your project add value to the produce?',
          pageTitle: '',
          url: 'how-adding-value',
          baseUrl: 'how-adding-value',
          backUrl: 'produce-processed',
          nextUrl: 'project-impact',
          score: {
            isScore: true,
            isDisplay: true,
            title: 'Adding value'
          },
          hint: {
            text: 'Select the main option that applies'
          },
          eliminationAnswerKeys: '',
          preValidationKeys: ['productsProcessed'],
          ineligibleContent: {
            messageContent: '',
            insertText: { text: '' },
            messageLink: {
              url: '',
              title: ''
            }
          },
          sidebar: {
            values: [{
              heading: 'Funding priorities',
              content: [{
                para: 'RPA wants to fund projects that:',
                items: [
                  'improve processing and supply chains',
                  'grow your business']
              }]
            }]
          },
          fundingPriorities: 'Improve processing and supply chains<br/><br/>Grow your business',
          type: 'single-answer',
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          minAnswerCount: 1,
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select how you will add value to the produce'
            }
          ],
          answers: [
            {
              key: 'how-adding-value-A1',
              value: 'Creating a new product',
              hint: {
                text: 'For example, slaughtering, cut and packed meat, yogurt to cheese, brewing or distilling'
              }
            },
            {
              key: 'how-adding-value-A2',
              value: 'Grading or sorting produce',
              hint: {
                text: 'For example, washing and grading vegetables, egg grading, optical grading of top fruit'
              }
            },
            {
              key: 'how-adding-value-A3',
              value: 'Packing produce',
              hint: {
                text: 'For example, packing top fruit, bagging vegetables, bottling wine'
              }
            },
            {
              key: 'how-adding-value-A5',
              value: 'New retail facility to sell direct to consumers'
            }
          ],
          yarKey: 'howAddingValue'
        },
        {
          key: 'project-impact',
          order: 140,
          title: 'What impact will the project have?',
          pageTitle: '',
          url: 'project-impact',
          baseUrl: 'project-impact',
          backUrl: 'how-adding-value',
          nextUrl: 'future-customers',
          score: {
            isScore: true,
            isDisplay: true,
            title: 'Project impact'
          },
          hint: {
            text: 'Select all that apply'
          },
          eliminationAnswerKeys: '',
          preValidationKeys: ['howAddingValue'],
          ineligibleContent: {},
          ga: [
            { dimension: 'cm2', value: { type: 'journey-time' } }
          ],
          sidebar: {
            values: [{
              heading: 'Funding priorities',
              content: [{
                para: 'RPA wants to fund projects that:',
                items: ['improve processing and supply chains',
                  'grow your business']
              }]
            }]
          },
          fundingPriorities: 'Improve processing and supply chains<br/><br/>Grow your business',
          type: 'multi-answer',
          minAnswerCount: 1,
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select the impact your project will have'
            },
            {
              type: 'COMBINATION_ANSWER',
              error: 'You cannot select that combination of options',
              combinationObject: {
                questionKey: 'project-impact',
                combinationAnswerKeys: ['project-impact-A1', 'project-impact-A4']
              }
            }
          ],
          answers: [
            {
              key: 'project-impact-A1',
              value: 'Creating added-value products for the first time'
            },
            {
              key: 'project-impact-A2',
              value: 'Increasing volume of added-value products'
            },
            {
              key: 'project-impact-A3',
              value: 'Increasing range of added-value products'
            },
            {
              key: 'project-impact-A4',
              value: 'Allow selling direct to consumer'
            }
          ],
          yarKey: 'projectImpact'
        },
        {
          key: 'future-customers',
          order: 160,
          title: 'Who will your new customers be after the project?',
          pageTitle: '',
          url: 'future-customers',
          baseUrl: 'future-customers',
          backUrl: 'project-impact',
          nextUrl: 'collaboration',
          preValidationKeys: ['projectImpact'],
          eliminationAnswerKeys: '',
          score: {
            isScore: true,
            isDisplay: true,
            title: 'Future customers'
          },
          hint: {
            html: `For example, you will now sell directly to retailers 
                  <br/><br/>Select all that apply`
          },
          ineligibleContent: {
            messageContent: '',
            insertText: { text: '' },
            messageLink: {
              url: '',
              title: ''
            }
          },
          sidebar: {
            values: [{
              heading: 'Funding priorities',
              content: [{
                para: 'RPA wants to fund projects that:',
                items: ['improve processing and supply chains',
                  'grow your business']
              }]
            }]
          },
          fundingPriorities: 'Improve processing and supply chains<br/><br/>Grow your business',
          type: 'multi-answer',
          minAnswerCount: 1,
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select all options that apply'
            },
            {
              type: 'STANDALONE_ANSWER',
              error: 'You cannot select ‘No change’ and another option',
              standaloneObject: {
                questionKey: 'future-customers',
                answerKey: 'future-customers-A6'
              }
            }
          ],
          answers: [
            {
              key: 'future-customers-A1',
              value: 'Producers or growers'
            },
            {
              key: 'future-customers-A2',
              value: 'Processors'
            },
            {
              key: 'future-customers-A3',
              value: 'Wholesalers'
            },
            {
              key: 'future-customers-A4',
              value: 'Retailers'
            },
            {
              key: 'future-customers-A5',
              value: 'Selling direct to consumers'
            },
            {
              value: 'divider'
            },
            {
              key: 'future-customers-A6',
              value: 'No change'
            }
          ],
          yarKey: 'futureCustomers'
        },
        {
          key: 'collaboration',
          order: 170,
          title: 'Will you work in partnership or collaborate with other farmers or producers?',
          hint: {
            text: 'For example, in a formal partnership or contract supply arrangement for raw materials'
          },
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          pageTitle: '',
          url: 'collaboration',
          baseUrl: 'collaboration',
          backUrl: 'future-customers',
          nextUrl: 'environmental-impact',
          score: {
            isScore: true,
            isDisplay: true,
            title: 'Collaboration'
          },
          eliminationAnswerKeys: '',
          preValidationKeys: ['futureCustomers'],
          ineligibleContent: {
            messageContent: '',
            insertText: { text: '' },
            messageLink: {
              url: '',
              title: ''
            }
          },
          sidebar: {
            values: [{
              heading: 'Funding priorities',
              content: [{
                para: 'RPA wants to fund projects that:',
                items: ['improve processing and supply chains', 'encourage collaboration and partnerships']
              }]
            }]
          },
          fundingPriorities: 'Improve processing and supply chains<br/><br/>Encourage collaboration and partnerships',
          type: 'single-answer',
          minAnswerCount: 1,
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if you will be buying materials from other farmers'
            }
          ],
          answers: [
            {
              key: 'collaboration-A1',
              value: 'Yes'
            },
            {
              key: 'collaboration-A2',
              value: 'No'
            }
          ],
          yarKey: 'collaboration'
        },
        {
          key: 'environmental-impact',
          order: 200,
          title: 'How will the project improve the environment?',
          pageTitle: '',
          url: 'environmental-impact',
          baseUrl: 'environmental-impact',
          backUrl: 'collaboration',
          nextUrl: 'score',
          score: {
            isScore: true,
            isDisplay: true,
            title: 'Environmental impact'
          },
          hint: {
            text: 'Select all that apply'
          },
          eliminationAnswerKeys: '',
          preValidationKeys: ['collaboration'],
          ineligibleContent: {
            messageContent: '',
            insertText: { text: '' },
            messageLink: {
              url: '',
              title: ''
            }
          },
          sidebar: {
            values: [{
              heading: 'Funding priorities',
              content: [{
                para: 'RPA wants to fund projects that:',
                items: ['improve the environment']
              }]
            }]
          },
          fundingPriorities: 'Improve the environment',
          type: 'multi-answer',
          minAnswerCount: 1,
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select all options that apply'
            },
            {
              type: 'STANDALONE_ANSWER',
              error: 'You cannot select that combination of options',
              standaloneObject: {
                questionKey: 'environmental-impact',
                answerKey: 'environmental-impact-A7'
              }
            }
          ],
          answers: [
            {
              key: 'environmental-impact-A1',
              value: 'Renewable energy',
              hint: {
                text: 'For example, majority of energy for the project is generated on site'
              }
            },
            {
              key: 'environmental-impact-A2',
              value: 'Energy efficiency',
              hint: {
                text: 'For example, using variable speed motors or heat exchangers'
              }
            },
            {
              key: 'environmental-impact-A3',
              value: 'Water efficiency',
              hint: {
                text: 'For example, majority of water for the project is harvested or recycled on site'
              }
            },
            {
              key: 'environmental-impact-A4',
              value: 'Waste efficiency',
              hint: {
                text: 'For example, majority of project waste is recycled or reused instead of going to landfill'
              }
            },
            {
              key: 'environmental-impact-A5',
              value: 'Sustainable packaging measures',
              hint: {
                text: 'For example, removing unnecessary packaging, replacing plastic packaging'
              }
            },
            {
              key: 'environmental-impact-A6',
              value: 'Reduce harmful emissions or pollutants',
              hint: {
                text: 'For example, reducing pollutants in waste water'
              }
            },
            {
              value: 'divider'
            },
            {
              key: 'environmental-impact-A7',
              value: 'My project will not improve the environment'
            }
          ],
          yarKey: 'environmentalImpact'
        },

        /// ////// ***************** After Score  ************************************/////////////////////
        {
          key: 'business-details',
          order: 180,
          title: 'Business details',
          pageTitle: 'Crops',
          url: 'business-details',
          baseUrl: 'business-details',
          backUrl: 'score',
          nextUrl: 'applying',
          preValidationKeys: ['current-score'],
          ga: [
            { dimension: 'cd2', value: { type: 'score' } },
            { dimension: 'cm1', value: { type: 'journey-time' } }
          ],
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
              label: {
                text: 'Project name',
                classes: 'govuk-label'
              },
              hint: {
                text: 'For example, Browns Hill Farm vegetable washing and sorting project'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter a project name'
                }
              ]
            },
            {
              yarKey: 'businessName',
              type: 'text',
              label: {
                text: 'Business name',
                classes: 'govuk-label'
              },
              hint: {
                text: 'If you’re registered on the Rural Payments system, enter business name as registered'
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
                text: 'Business turnover (£)',
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
              title: 'Single Business Identifier (SBI) (Optional)',
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

              ],
              answers: []
            }
          ],
          yarKey: 'businessDetails'
        },
        {
          key: 'applying',
          order: 190,
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
              redirectUrl: 'agents-details'
            }
          ],
          yarKey: 'applying'
        },
        {
          key: 'farmer-details',
          order: 200,
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
              thenUrl: 'agents-details',
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
                text: 'We will only use this to send you a confirmation'
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
              classes: 'govuk-input--width-20',
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
              classes: 'govuk-input--width-20',
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
          key: 'agents-details',
          order: 202,
          title: 'Agent’s details',
          pageTitle: '',
          url: 'agents-details',
          baseUrl: 'agents-details',
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
                  type: 'REGEX',
                  regex: CHARS_MAX_100,
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
                text: 'We will only use this to send you a confirmation'
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
              classes: 'govuk-input--width-20',
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
              classes: 'govuk-input--width-20',
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
          order: 210,
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
            agentDetailsLink: 'agents-details',
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
          order: 220,
          url: 'confirm',
          backUrl: 'check-details',
          nextUrl: 'confirmation',
          preValidationKeys: ['farmerDetails'],
          preValidationKeysRule: { condition: 'ANY' },
          maybeEligible: true,
          maybeEligibleContent: {
            messageHeader: 'Confirm and send',
            messageContent: `<ul class="govuk-list"> <li>I confirm that, to the best of my knowledge, the details I have provided are correct.</li>
            <li> I understand the score was based on the answers I provided.</li>
            <li> I am aware the information I submit will be checked.</li>
            <li> I am happy to be contacted by Defra and RPA (or a third-party on their behalf) about my application.</li></ul>
            <br/>So that we can continue to improve our services and schemes, we may wish to contact you in the future. Please confirm if you are happy for us, or a third-party working for us, to contact you.`
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
          order: 230,
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
            <p>1. RPA will be in touch when the full application period opens. They will tell you if your project scored well enough to get the full application form.</p>
            <p>2. If you submit an application, RPA will assess it against other projects and value for money. You will not automatically get a grant.
            The grant is expected to be highly competitive and you are competing against other projects.</p>
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

const YAR_KEYS = ['remainingCost', 'calculatedGrant']
ALL_QUESTIONS.forEach(item => YAR_KEYS.push(item.yarKey))
module.exports = {
  questionBank,
  ALL_QUESTIONS,
  YAR_KEYS,
  ALL_URLS
}
