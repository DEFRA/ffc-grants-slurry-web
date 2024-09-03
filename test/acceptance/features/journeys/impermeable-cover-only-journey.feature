Feature: Impermeable Cover Only Journey

    Scenario: Successfully apply for a Slurry Infrastructure R3 grant for an impermeable cover only
        - as a dairy farmer
        - as a landowner
        - with a fit for purpose existing store
        - without a separator
        - as the applicant

        # login/start
        Given the user navigates to "/slurry-infrastructure/start"
        And completes any login process
        And clicks on "Accept analytics cookies"
        Then the user should see heading "Check if you can apply for a Slurry Infrastructure Grant"
        When the user clicks on "Start now"

        # applicant-type
        Then the user should be at URL "applicant-type"
        And should see heading "Which livestock do you farm mainly?"
        When the user selects "Dairy"
        And continues

        # legal-status
        Then the user should be at URL "legal-status"
        And should see heading "What is the legal status of the business?"
        When the user selects "Trust"
        And continues

        # country
        Then the user should be at URL "country"
        And should see heading "Is the planned project in England?"
        When the user selects "Yes"
        And continues

        # project-started
        Then the user should be at URL "project-started"
        And should see heading "Have you already started work on the project?"
        When the user selects "No, we have not done any work on this project yet"
        And continues

        # tenancy
        Then the user should be at URL "tenancy"
        And should see heading "Is the planned project on land the business owns?"
        When the user selects "Yes"
        And continues

        # system-type
        Then the user should be at URL "system-type"
        And should see heading "What is your current manure management system?"
        When the user selects "Farmyard manure and slurry system"
        And continues

        # existing-storage-capacity
        Then the user should be at URL "existing-storage-capacity"
        And should see heading "How many months’ slurry storage capacity do you have?"
        When the user selects "6 months or more, but it is no longer fit for purpose"
        And continues

        # planned-storage-capacity
        Then the user should be at URL "planned-storage-capacity"
        And should see heading "How many months’ slurry storage capacity will you have after the project?"
        When the user selects "More than 6 months"
        And continues

        # applying-for
        Then the user should be at URL "applying-for"
        And should see heading "What are you applying for?"
        When the user selects "An impermeable cover only"
        And continues

        # fit-for-purpose
        Then the user should be at URL "fit-for-purpose"
        And should see heading "Is the existing store you want to cover fit for purpose?"
        When the user selects "Yes"
        And continues

        # estimated-grant
        Then the user should be at URL "estimated-grant"
        And should see heading "Estimate how much grant you could get"
        And continues

        # reference-cost
        Then the user should be at URL "reference-cost"
        And should see heading "Grant amounts for eligible items"
        And continues

        # existing-cover-type
        Then the user should be at URL "existing-cover-type"
        And should see heading "What type of cover will you have on your existing store?"
        When the user selects "Floating flexible cover"
        And continues

        # existing-cover-size
        Then the user should be at URL "existing-cover-size"
        And should see heading label "How big will the cover be?"
        When the user enters "3500" in "existingCoverSize"
        And continues

        # separator
        Then the user should be at URL "separator"
        And should see heading "Do you want to add a slurry separator to your project?"
        When the user selects "No"
        And continues

        # other-items
        Then the user should be at URL "other-items"
        And should see heading "What other items do you need?"
        When the user selects the following
            | None of the above |
        And continues

        # project-summary
        Then the user should be at URL "project-summary"
        And should see heading "Your project items"
        When the user continues

        # potential-amount
        Then the user should be at URL "potential-amount"
        And should see heading "Potential grant funding"
        When the user continues

        # remaining-costs
        Then the user should be at URL "remaining-costs"
        And should see heading "Can you pay the remaining costs?"
        When the user selects "Yes"
        And continues

        # grid-reference
        Then the user should be at URL "grid-reference"
        And should see heading "What is the OS grid reference for your slurry store?"
        When the user enters "SP 83498 61506" in "existingGridReference"
        And enters "SP 83498 61507" in "newGridReference"
        And continues

        # planning-permission-summary
        Then the user should be at URL "planning-permission-summary"
        And should see heading "Check your answers before getting your results"
        When the user continues to their results

        # result-page
        Then the user should be at URL "result-page"
        And should see heading "Your results"
        And should see "Eligible to apply" for their eligibility result
        And continues

        # business-details
        Then the user should be at URL "business-details"
        And should see heading "Business details"
        When the user enters the following
            | FIELD                            | VALUE          | ID               |
            | Project name                     | Slurry Project | projectName      |
            | Business name                    | Test Farm Ltd  | businessName     |
            | Number of employees              | 5              | numberEmployees  |
            | Annual business turnover (£)     | 750000         | businessTurnover |
            | Single Business Identifier (SBI) | 123456789      | sbi              |
        And continues

        # applying
        Then the user should be at URL "applying"
        And should see heading "Who is applying for this grant?"
        When the user selects "Applicant"
        And continues

        # applicant-details
        Then the user should be at URL "applicant-details"
        And should see heading "Applicant's details"
        When the user enters the following
            | FIELD               | VALUE                                                          | ID              |
            | First name          | James                                                          | firstName       |
            | Last name           | Test-Farmer                                                    | lastName        |
            | Email address       | cl-defra-tactical-grants-test-applicant-email@equalexperts.com | emailAddress    |
            | Mobile phone number | 07777 123456                                                   | mobileNumber    |
            | Landline number     | 01604 123456                                                   | landlineNumber  |
            | Address line 1      | Test Farm                                                      | address1        |
            | Address line 2      | Cogenhoe                                                       | address2        |
            | Town                | Northampton                                                    | town            |
            | County              | Northamptonshire                                               | county          |
            | Postcode            | NN7 1NN                                                        | postcode        |
            | Project postcode    | NN7 2NN                                                        | projectPostcode |
        And continues

        # check-details
        Then the user should be at URL "check-details"
        And should see heading "Check your details"
        And continues

        # confirm
        Then the user should be at URL "confirm"
        And should see heading "Confirm and send"
        And confirms and sends

        # confirmation
        Then the user should be at URL "confirmation"
        And should see heading "Details submitted"
        And should see a reference number for their application
        Then a spreadsheet should be generated with the following values
            | ROW NO | FIELD NAME                                           | FIELD VALUE                                                    | DATA TYPE        |
            | 2      | FA or OA                                             | Outline Application                                            |                  |
            | 4      | Single business identifier (SBI)                     | 123456789                                                      |                  |
            | 5      | Surname                                              | Test-Farmer                                                    |                  |
            | 6      | Forename                                             | James                                                          |                  |
            | 7      | Business name                                        | Test Farm Ltd                                                  |                  |
            | 8      | Address line 1                                       | Test Farm                                                      |                  |
            | 9      | Address line 2                                       | Cogenhoe                                                       |                  |
            | 10     | Address line 3                                       |                                                                |                  |
            | 11     | Address line 4 (town)                                | Northampton                                                    |                  |
            | 12     | Address line 5 (county)                              | Northamptonshire                                               |                  |
            | 13     | Postcode (use capitals)                              | NN7 1NN                                                        |                  |
            | 16     | Landline number                                      | 01604 123456                                                   |                  |
            | 17     | Mobile number                                        | 07777 123456                                                   |                  |
            | 18     | Email                                                | cl-defra-tactical-grants-test-applicant-email@equalexperts.com |                  |
            | 20     | Business size                                        | Micro                                                          |                  |
            | 22     | Employees                                            | 5                                                              |                  |
            | 23     | Status of applicant                                  | Trust                                                          |                  |
            | 26     | Agent Surname                                        |                                                                |                  |
            | 27     | Agent Forename                                       |                                                                |                  |
            | 28     | Agent Business Name                                  |                                                                |                  |
            | 29     | Agent Address line 1                                 |                                                                |                  |
            | 30     | Agent Address line 2                                 |                                                                |                  |
            | 31     | Agent Address line 3                                 |                                                                |                  |
            | 32     | Agent Address line 4 (town)                          |                                                                |                  |
            | 33     | Agent Address line 5 (County)                        |                                                                |                  |
            | 34     | Agent Postcode (use capitals)                        |                                                                |                  |
            | 35     | Agent Landline number                                |                                                                |                  |
            | 36     | Agent Mobile number                                  |                                                                |                  |
            | 37     | Agent Email                                          |                                                                |                  |
            | 39     | Sub scheme                                           | FTF-Slurry Infrastructure Round 3                              |                  |
            | 40     | Scheme                                               | Farming Investment Fund                                        |                  |
            | 41     | Owner                                                | RD                                                             |                  |
            | 42     | Project name                                         | Slurry Project                                                 |                  |
            | 43     | Theme                                                | Slurry Infrastructure Grants                                   |                  |
            | 44     | Project Items                                        | \|\|Floating flexible cover~3500\|\|                           |                  |
            | 45     | Location of project (postcode)                       | NN7 2NN                                                        |                  |
            | 53     | Business type                                        | Dairy Farmer                                                   |                  |
            | 54     | Electronic OA received date                          | ?                                                              | CURRENT-DATE     |
            | 55     | Total project expenditure                            | 55930.00                                                       |                  |
            | 56     | Grant amount requested                               | 27965                                                          | INTEGER          |
            | 57     | Grant rate                                           | 50                                                             |                  |
            | 85     | Full Application Submission Date                     | 31/03/2026                                                     |                  |
            | 89     | Customer Marketing Indicator                         | No                                                             |                  |
            | 90     | Project type                                         | Slurry Store and Cover                                         |                  |
            | 91     | Are you an AGENT applying on behalf of your customer | No                                                             |                  |
            | 92     | RAG rating                                           | Green                                                          |                  |
            | 93     | RAG date reviewed                                    | ?                                                              | CURRENT-DATE     |
            | 94     | Current location of file                             | NA Automated                                                   |                  |
            | 341    | Grant Launch Date                                    | 11/07/2024                                                     |                  |
            | 342    | Land owned by Farm                                   | Yes                                                            |                  |
            | 343    | Tenancy for next 5 years                             |                                                                |                  |
            | 345    | Remaining Cost to Farmer                             | 0.00                                                           |                  |
            | 346    | Planning Permission Status                           | Not Needed                                                     |                  |
            | 365    | OA score                                             | 0                                                              | INTEGER          |
            | 366    | Date of OA decision                                  |                                                                |                  |
            | 367    | Annual Turnover                                      | 750000                                                         |                  |
            | 368    | Date ready for QC or decision                        | ?                                                              | CURRENT-DATE     |
            | 369    | Eligibility Reference No.                            | ?                                                              | REFERENCE-NUMBER |
            | 370    | Status                                               | Pending RPA review                                             |                  |
            | 375    | OA percent                                           | 0                                                              | INTEGER          |
            | 376    | Project Started                                      | No, we have not done any work on this project yet              |                  |
            | 395    | System Type                                          | Farmyard manure and slurry system                              |                  |
            | 396    | Existing Storage Capacity                            | 6 months or more, but it is no longer fit for purpose          |                  |
            | 397    | Planned Storage Capacity                             | More than 6 months                                             |                  |
            | 398    | Slurry Storage Improvement Method                    | N/A                                                            |                  |
            | 399    | Impermeable Cover                                    | N/A                                                            |                  |
            | 400    | Planning Authority                                   |                                                                |                  |
            | 401    | Planning Reference No                                |                                                                |                  |
            | 402    | Existing store OS grid reference                     | SP8349861506                                                   |                  |
            | 463    | Environmental permit                                 | N/A                                                            |                  |
            | 464    | Project Responsibility                               | N/A                                                            |                  |
            | 465    | Applying for                                         | An impermeable cover only                                      |                  |
            | 466    | Fit for purpose                                      | Yes                                                            |                  |
            | 467    | Existing Store Cover                                 | N/A                                                            |                  |
            | 521    | New store OS grid reference                          | SP8349861507                                                   |                  |