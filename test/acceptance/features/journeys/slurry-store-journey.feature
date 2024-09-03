Feature: Slurry Store Journey

    Scenario: Successfully apply for a Slurry Infrastructure R3 grant to build, replace or expand a slurry store
        - as a pig farmer
        - as a tenant farmer
        - with an unfit for purpose existing store
        - with a separator
        - with other project items
        - replacing an existing store
        - with planning permission
        - as an agent

        # login/start
        Given the user navigates to "/slurry-infrastructure/start"
        And completes any login process
        And clicks on "Accept analytics cookies"
        Then the user should see heading "Check if you can apply for a Slurry Infrastructure Grant"
        When the user clicks on "Start now"

        # applicant-type
        Then the user should be at URL "applicant-type"
        And should see heading "Which livestock do you farm mainly?"
        When the user selects "Pig"
        And continues

        # intensive-farming (pig farmer)
        Then the user should be at URL "intensive-farming"
        And should see heading "Do you have an environmental permit for intensive farming?"
        When the user selects "Yes"
        And continues

        # intensive-farming-condition (pig farmer)
        Then the user should be at URL "intensive-farming-condition"
        And should see heading "You may need to apply for a change to your intensive farming permit"
        When the user continues

        # legal-status
        Then the user should be at URL "legal-status"
        And should see heading "What is the legal status of the business?"
        When the user selects "Sole trader"
        And continues

        # country
        Then the user should be at URL "country"
        And should see heading "Is the planned project in England?"
        When the user selects "Yes"
        And continues

        # project-started
        Then the user should be at URL "project-started"
        And should see heading "Have you already started work on the project?"
        When the user selects "Yes, preparatory work"
        And continues

        # tenancy
        Then the user should be at URL "tenancy"
        And should see heading "Is the planned project on land the business owns?"
        When the user selects "No"
        And continues

        # project-responsibility (tenant farmer)
        Then the user should be at URL "project-responsibility"
        And should see heading "Will you take full responsibility for your project?"
        When the user selects "Yes, I plan to take full responsibility for my project"
        And continues

        # system-type
        Then the user should be at URL "system-type"
        And should see heading "What is your current manure management system?"
        When the user selects "Slurry-based system"
        And continues

        # pig-existing-storage-capacity (pig farmer)
        Then the user should be at URL "pig-existing-storage-capacity"
        And should see heading "How many months’ slurry storage capacity do you have?"
        When the user selects "Less than 8 months"
        And continues

        # pig-planned-storage-capacity (pig farmer)
        Then the user should be at URL "pig-planned-storage-capacity"
        And should see heading "How many months’ slurry storage capacity will you have after the project?"
        When the user selects "8 months"
        And continues

        # applying-for
        Then the user should be at URL "applying-for"
        And should see heading "What are you applying for?"
        When the user selects "Building a new store, replacing or expanding an existing store"
        And continues

        # project-type
        Then the user should be at URL "project-type"
        And should see heading "How will you increase your storage capacity?"
        When the user selects "Replace an existing store that is no longer fit for purpose with a new store"
        And continues

        # grant-funded-cover
        Then the user should be at URL "grant-funded-cover"
        And should see heading "Will the grant-funded store have an impermeable cover?"
        When the user selects "Yes, I need a cover"
        And continues

        # existing-cover-pig (pig farmer)
        Then the user should be at URL "existing-cover-pig"
        And should see heading "Do you want to apply for a cover for existing stores?"
        When the user selects "Yes"
        And continues

        # fit-for-purpose
        Then the user should be at URL "fit-for-purpose"
        And should see heading "Is the existing store you want to cover fit for purpose?"
        When the user selects "No"
        And continues

        # fit-for-purpose-conditional
        Then the user should be at URL "fit-for-purpose-conditional"
        And should see heading "You may be able to apply for a grant from this scheme"
        When the user continues

        # estimated-grant
        Then the user should be at URL "estimated-grant"
        And should see heading "Estimate how much grant you could get"
        And continues

        # reference-cost
        Then the user should be at URL "reference-cost"
        And should see heading "Grant amounts for eligible items"
        And continues

        # storage-type
        Then the user should be at URL "storage-type"
        And should see heading "What type of store do you want?"
        When the user selects "Above-ground steel slurry store"
        And continues

        # pig-capacity-increase-replace (pig farmer)
        Then the user should be at URL "pig-capacity-increase-replace"
        And should see heading label "What estimated volume do you need to have 8 months’ storage?"
        When the user enters "1000" in "serviceCapacityIncrease"
        And continues

        # cover-type
        Then the user should be at URL "cover-type"
        And should see heading "What type of cover will you have on your grant-funded store?"
        When the user selects "Fixed flexible cover"
        And continues

        # existing-cover-type
        Then the user should be at URL "existing-cover-type"
        And should see heading "What type of cover will you have on your existing store?"
        When the user selects "Fixed flexible cover"
        And continues

        # existing-grant-funded-cover-size
        Then the user should be at URL "existing-grant-funded-cover-size"
        And should see heading "How big will the covers be?"
        When the user enters "100" in "coverSize"
        And enters "50" in "existingCoverSize"
        And continues

        # separator
        Then the user should be at URL "separator"
        And should see heading "Do you want to add a slurry separator to your project?"
        When the user selects "Yes"
        And continues

        # separator-type
        Then the user should be at URL "separator-type"
        And should see heading "What type of slurry separator will you have?"
        When the user selects "Roller screen press"
        And continues

        # gantry
        Then the user should be at URL "gantry"
        And should see heading "Do you want to add a gantry?"
        When the user selects "Yes"
        And continues

        # short-term-storage
        Then the user should be at URL "short-term-storage"
        And should see heading "What type of short-term storage do you want for the stackable material from the separator?"
        When the user selects "Concrete pad"
        And continues

        # other-items
        Then the user should be at URL "other-items"
        And should see heading "What other items do you need?"
        When the user selects the following
            | Reception pit            |
            | Centrifugal chopper pump |
        And continues

        # item-sizes-quantities
        Then the user should be at URL "item-sizes-quantities"
        And should see heading "Item sizes and quantities"
        When the user enters "100" in "Receptionpit"
        And enters "200" in "Centrifugalchopperpump"
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

        # planning-permission
        Then the user should be at URL "planning-permission"
        And should see heading "Does the project have planning permission?"
        When the user selects "Approved"
        And continues

        # planning-permission-evidence
        Then the user should be at URL "planning-permission-evidence"
        And should see heading "Your planning permission"
        When the user enters "Northants" in "planningAuthority"
        And enters "NN12345" in "planningReferenceNumber"
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
        When the user selects "Agent"
        And continues

        # agent-details
        Then the user should be at URL "agent-details"
        And should see heading "Agent's details"
        When the user enters the following
            | FIELD               | VALUE                                                      | ID             |
            | First name          | John                                                       | firstName      |
            | Last name           | Test-Agent                                                 | lastName       |
            | Business name       | Test Agency Ltd                                            | businessName   |
            | Email address       | cl-defra-tactical-grants-test-agent-email@equalexperts.com | emailAddress   |
            | Mobile phone number | 07777 654321                                               | mobileNumber   |
            | Landline number     | 01604 654321                                               | landlineNumber |
            | Address line 1      | High Street                                                | address1       |
            | Address line 2      | Denton                                                     | address2       |
            | Town                | Northampton                                                | town           |
            | County              | Northamptonshire                                           | county         |
            | Postcode            | NN7 3NN                                                    | postcode       |
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
            | ROW NO | FIELD NAME                                           | FIELD VALUE                                                                                                                                                                                          | DATA TYPE        |
            | 2      | FA or OA                                             | Outline Application                                                                                                                                                                                  |                  |
            | 4      | Single business identifier (SBI)                     | 123456789                                                                                                                                                                                            |                  |
            | 5      | Surname                                              | Test-Farmer                                                                                                                                                                                          |                  |
            | 6      | Forename                                             | James                                                                                                                                                                                                |                  |
            | 7      | Business name                                        | Test Farm Ltd                                                                                                                                                                                        |                  |
            | 8      | Address line 1                                       | Test Farm                                                                                                                                                                                            |                  |
            | 9      | Address line 2                                       | Cogenhoe                                                                                                                                                                                             |                  |
            | 10     | Address line 3                                       |                                                                                                                                                                                                      |                  |
            | 11     | Address line 4 (town)                                | Northampton                                                                                                                                                                                          |                  |
            | 12     | Address line 5 (county)                              | Northamptonshire                                                                                                                                                                                     |                  |
            | 13     | Postcode (use capitals)                              | NN7 1NN                                                                                                                                                                                              |                  |
            | 16     | Landline number                                      | 01604 123456                                                                                                                                                                                         |                  |
            | 17     | Mobile number                                        | 07777 123456                                                                                                                                                                                         |                  |
            | 18     | Email                                                | cl-defra-tactical-grants-test-applicant-email@equalexperts.com                                                                                                                                       |                  |
            | 20     | Business size                                        | Micro                                                                                                                                                                                                |                  |
            | 22     | Employees                                            | 5                                                                                                                                                                                                    |                  |
            | 23     | Status of applicant                                  | Sole trader                                                                                                                                                                                          |                  |
            | 26     | Agent Surname                                        | Test-Agent                                                                                                                                                                                           |                  |
            | 27     | Agent Forename                                       | John                                                                                                                                                                                                 |                  |
            | 28     | Agent Business Name                                  | Test Agency Ltd                                                                                                                                                                                      |                  |
            | 29     | Agent Address line 1                                 | High Street                                                                                                                                                                                          |                  |
            | 30     | Agent Address line 2                                 | Denton                                                                                                                                                                                               |                  |
            | 31     | Agent Address line 3                                 |                                                                                                                                                                                                      |                  |
            | 32     | Agent Address line 4 (town)                          | Northampton                                                                                                                                                                                          |                  |
            | 33     | Agent Address line 5 (County)                        | Northamptonshire                                                                                                                                                                                     |                  |
            | 34     | Agent Postcode (use capitals)                        | NN7 3NN                                                                                                                                                                                              |                  |
            | 35     | Agent Landline number                                | 01604 654321                                                                                                                                                                                         |                  |
            | 36     | Agent Mobile number                                  | 07777 654321                                                                                                                                                                                         |                  |
            | 37     | Agent Email                                          | cl-defra-tactical-grants-test-agent-email@equalexperts.com                                                                                                                                           |                  |
            | 39     | Sub scheme                                           | FTF-Slurry Infrastructure Round 3                                                                                                                                                                    |                  |
            | 40     | Scheme                                               | Farming Investment Fund                                                                                                                                                                              |                  |
            | 41     | Owner                                                | RD                                                                                                                                                                                                   |                  |
            | 42     | Project name                                         | Slurry Project                                                                                                                                                                                       |                  |
            | 43     | Theme                                                | Slurry Infrastructure Grants                                                                                                                                                                         |                  |
            | 44     | Project Items                                        | Above-ground steel slurry store~1000\|Fixed flexible cover~100\|Fixed flexible cover~50\|Roller screen press~1\|Gantry~1\|Concrete pad~1\|Reception pit~100~m³\|Centrifugal chopper pump~200~item(s) |                  |
            | 45     | Location of project (postcode)                       | NN7 2NN                                                                                                                                                                                              |                  |
            | 53     | Business type                                        | Pig Farmer                                                                                                                                                                                           |                  |
            | 54     | Electronic OA received date                          | ?                                                                                                                                                                                                    | CURRENT-DATE     |
            | 55     | Total project expenditure                            | 2428741.00                                                                                                                                                                                           |                  |
            | 56     | Grant amount requested                               | 250000                                                                                                                                                                                               | DECIMAL          |
            | 57     | Grant rate                                           | 50                                                                                                                                                                                                   |                  |
            | 85     | Full Application Submission Date                     | 31/03/2026                                                                                                                                                                                           |                  |
            | 89     | Customer Marketing Indicator                         | No                                                                                                                                                                                                   |                  |
            | 90     | Project type                                         | Slurry Store and Cover                                                                                                                                                                               |                  |
            | 91     | Are you an AGENT applying on behalf of your customer | Yes                                                                                                                                                                                                  |                  |
            | 92     | RAG rating                                           | Green                                                                                                                                                                                                |                  |
            | 93     | RAG date reviewed                                    | ?                                                                                                                                                                                                    | CURRENT-DATE     |
            | 94     | Current location of file                             | NA Automated                                                                                                                                                                                         |                  |
            | 341    | Grant Launch Date                                    | 11/07/2024                                                                                                                                                                                           |                  |
            | 342    | Land owned by Farm                                   | No                                                                                                                                                                                                   |                  |
            | 343    | Tenancy for next 5 years                             |                                                                                                                                                                                                      |                  |
            | 345    | Remaining Cost to Farmer                             | 964370.50                                                                                                                                                                                            |                  |
            | 346    | Planning Permission Status                           | Approved                                                                                                                                                                                             |                  |
            | 365    | OA score                                             | 0                                                                                                                                                                                                    | INTEGER          |
            | 366    | Date of OA decision                                  |                                                                                                                                                                                                      |                  |
            | 367    | Annual Turnover                                      | 750000                                                                                                                                                                                               |                  |
            | 368    | Date ready for QC or decision                        | ?                                                                                                                                                                                                    | CURRENT-DATE     |
            | 369    | Eligibility Reference No.                            | ?                                                                                                                                                                                                    | REFERENCE-NUMBER |
            | 370    | Status                                               | Pending RPA review                                                                                                                                                                                   |                  |
            | 375    | OA percent                                           | 0                                                                                                                                                                                                    | INTEGER          |
            | 376    | Project Started                                      | Yes, preparatory work                                                                                                                                                                                |                  |
            | 395    | System Type                                          | Slurry-based system                                                                                                                                                                                  |                  |
            | 396    | Existing Storage Capacity                            | Less than 8 months                                                                                                                                                                                   |                  |
            | 397    | Planned Storage Capacity                             | 8 months                                                                                                                                                                                             |                  |
            | 398    | Slurry Storage Improvement Method                    | Replace an existing store that is no longer fit for purpose with a new store                                                                                                                         |                  |
            | 399    | Impermeable Cover                                    | Yes, I need a cover                                                                                                                                                                                  |                  |
            | 400    | Planning Authority                                   | NORTHANTS                                                                                                                                                                                            |                  |
            | 401    | Planning Reference No                                | NN12345                                                                                                                                                                                              |                  |
            | 402    | Existing store OS grid reference                     | SP8349861506                                                                                                                                                                                         |                  |
            | 463    | Environmental permit                                 | Yes                                                                                                                                                                                                  |                  |
            | 464    | Project Responsibility                               | Yes, I plan to take full responsibility for my project                                                                                                                                               |                  |
            | 465    | Applying for                                         | Building a new store, replacing or expanding an existing store                                                                                                                                       |                  |
            | 466    | Fit for purpose                                      | No                                                                                                                                                                                                   |                  |
            | 467    | Existing Store Cover                                 | Yes                                                                                                                                                                                                  |                  |
            | 521    | New store OS grid reference                          | SP8349861507                                                                                                                                                                                         |                  |