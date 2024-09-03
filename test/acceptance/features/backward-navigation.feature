Feature: Backward Navigation

    Scenario: Explore all backward navigation options
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
        When the user goes back
        Then the user should be at URL "start"
        When the user clicks on "Start now"
        Then the user should be at URL "applicant-type"
        And should see heading "Which livestock do you farm mainly?"
        When the user selects "Pig"
        And continues

        # intensive-farming (pig farmer)
        Then the user should be at URL "intensive-farming"
        When the user goes back
        Then the user should be at URL "applicant-type"
        When the user continues
        Then the user should be at URL "intensive-farming"
        And should see heading "Do you have an environmental permit for intensive farming?"
        When the user selects "Yes"
        And continues

        # intensive-farming-condition (pig farmer)
        Then the user should be at URL "intensive-farming-condition"
        When the user goes back
        Then the user should be at URL "intensive-farming"
        When the user continues
        Then the user should be at URL "intensive-farming-condition"
        And should see heading "You may need to apply for a change to your intensive farming permit"
        When the user continues

        # legal-status
        Then the user should be at URL "legal-status"
        When the user goes back
        Then the user should be at URL "intensive-farming-condition"
        When the user continues
        Then the user should be at URL "legal-status"
        And should see heading "What is the legal status of the business?"
        When the user selects "Sole trader"
        And continues

        # country
        Then the user should be at URL "country"
        When the user goes back
        Then the user should be at URL "legal-status"
        When the user continues
        Then the user should be at URL "country"
        And should see heading "Is the planned project in England?"
        When the user selects "Yes"
        And continues

        # project-started
        Then the user should be at URL "project-started"
        When the user goes back
        Then the user should be at URL "country"
        When the user continues
        Then the user should be at URL "project-started"
        And should see heading "Have you already started work on the project?"
        When the user selects "Yes, preparatory work"
        And continues

        # tenancy
        Then the user should be at URL "tenancy"
        When the user goes back
        Then the user should be at URL "project-started"
        When the user continues
        Then the user should be at URL "tenancy"
        And should see heading "Is the planned project on land the business owns?"
        When the user selects "No"
        And continues

        # project-responsibility (tenant farmer)
        Then the user should be at URL "project-responsibility"
        When the user goes back
        Then the user should be at URL "tenancy"
        When the user continues
        Then the user should be at URL "project-responsibility"
        And should see heading "Will you take full responsibility for your project?"
        When the user selects "Yes, I plan to take full responsibility for my project"
        And continues

        # system-type
        Then the user should be at URL "system-type"
        When the user goes back
        Then the user should be at URL "project-responsibility"
        When the user continues
        Then the user should be at URL "system-type"
        And should see heading "What is your current manure management system?"
        When the user selects "Slurry-based system"
        And continues

        # pig-existing-storage-capacity (pig farmer)
        Then the user should be at URL "pig-existing-storage-capacity"
        When the user goes back
        Then the user should be at URL "system-type"
        When the user continues
        Then the user should be at URL "pig-existing-storage-capacity"
        And should see heading "How many months’ slurry storage capacity do you have?"
        When the user selects "Less than 8 months"
        And continues

        # pig-planned-storage-capacity (pig farmer)
        Then the user should be at URL "pig-planned-storage-capacity"
        When the user goes back
        Then the user should be at URL "pig-existing-storage-capacity"
        When the user continues
        Then the user should be at URL "pig-planned-storage-capacity"
        And should see heading "How many months’ slurry storage capacity will you have after the project?"
        When the user selects "8 months"
        And continues

        # applying-for
        Then the user should be at URL "applying-for"
        When the user goes back
        Then the user should be at URL "pig-planned-storage-capacity"
        When the user continues
        Then the user should be at URL "applying-for"
        And should see heading "What are you applying for?"
        When the user selects "Building a new store, replacing or expanding an existing store"
        And continues

        # project-type
        Then the user should be at URL "project-type"
        When the user goes back
        Then the user should be at URL "applying-for"
        When the user continues
        Then the user should be at URL "project-type"
        And should see heading "How will you increase your storage capacity?"
        When the user selects "Replace an existing store that is no longer fit for purpose with a new store"
        And continues

        # grant-funded-cover
        Then the user should be at URL "grant-funded-cover"
        When the user goes back
        Then the user should be at URL "project-type"
        When the user continues
        Then the user should be at URL "grant-funded-cover"
        And should see heading "Will the grant-funded store have an impermeable cover?"
        When the user selects "Yes, I need a cover"
        And continues

        # existing-cover-pig (pig farmer)
        Then the user should be at URL "existing-cover-pig"
        When the user goes back
        Then the user should be at URL "grant-funded-cover"
        When the user continues
        Then the user should be at URL "existing-cover-pig"
        And should see heading "Do you want to apply for a cover for existing stores?"
        When the user selects "Yes"
        And continues

        # fit-for-purpose
        Then the user should be at URL "fit-for-purpose"
        When the user goes back
        Then the user should be at URL "existing-cover-pig"
        When the user continues
        Then the user should be at URL "fit-for-purpose"
        And should see heading "Is the existing store you want to cover fit for purpose?"
        When the user selects "No"
        And continues

        # fit-for-purpose-conditional
        Then the user should be at URL "fit-for-purpose-conditional"
        When the user goes back
        Then the user should be at URL "fit-for-purpose"
        When the user continues
        Then the user should be at URL "fit-for-purpose-conditional"
        And should see heading "You may be able to apply for a grant from this scheme"
        When the user continues

        # estimated-grant
        Then the user should be at URL "estimated-grant"
        When the user goes back
        Then the user should be at URL "fit-for-purpose-conditional"
        When the user continues
        Then the user should be at URL "estimated-grant"
        And should see heading "Estimate how much grant you could get"
        And continues

        # reference-cost
        Then the user should be at URL "reference-cost"
        When the user goes back
        Then the user should be at URL "estimated-grant"
        When the user continues
        Then the user should be at URL "reference-cost"
        And should see heading "Grant amounts for eligible items"
        And continues

        # storage-type
        Then the user should be at URL "storage-type"
        When the user goes back
        Then the user should be at URL "reference-cost"
        When the user continues
        Then the user should be at URL "storage-type"
        And should see heading "What type of store do you want?"
        When the user selects "Above-ground steel slurry store"
        And continues

        # pig-capacity-increase-replace (pig farmer)
        Then the user should be at URL "pig-capacity-increase-replace"
        When the user goes back
        Then the user should be at URL "storage-type"
        When the user continues
        Then the user should be at URL "pig-capacity-increase-replace"
        And should see heading label "What estimated volume do you need to have 8 months’ storage?"
        When the user enters "1000" in "serviceCapacityIncrease"
        And continues

        # cover-type
        Then the user should be at URL "cover-type"
        When the user goes back
        Then the user should be at URL "pig-capacity-increase-replace"
        When the user continues
        Then the user should be at URL "cover-type"
        And should see heading "What type of cover will you have on your grant-funded store?"
        When the user selects "Fixed flexible cover"
        And continues

        # existing-cover-type
        Then the user should be at URL "existing-cover-type"
        When the user goes back
        Then the user should be at URL "cover-type"
        When the user continues
        Then the user should be at URL "existing-cover-type"
        And should see heading "What type of cover will you have on your existing store?"
        When the user selects "Fixed flexible cover"
        And continues

        # existing-grant-funded-cover-size
        Then the user should be at URL "existing-grant-funded-cover-size"
        When the user goes back
        Then the user should be at URL "existing-cover-type"
        When the user continues
        Then the user should be at URL "existing-grant-funded-cover-size"
        And should see heading "How big will the covers be?"
        When the user enters "100" in "coverSize"
        And enters "50" in "existingCoverSize"
        And continues

        # separator
        Then the user should be at URL "separator"
        When the user goes back
        Then the user should be at URL "existing-grant-funded-cover-size"
        When the user continues
        Then the user should be at URL "separator"
        And should see heading "Do you want to add a slurry separator to your project?"
        When the user selects "Yes"
        And continues

        # separator-type
        Then the user should be at URL "separator-type"
        When the user goes back
        Then the user should be at URL "separator"
        When the user continues
        Then the user should be at URL "separator-type"
        And should see heading "What type of slurry separator will you have?"
        When the user selects "Roller screen press"
        And continues

        # gantry
        Then the user should be at URL "gantry"
        When the user goes back
        Then the user should be at URL "separator-type"
        When the user continues
        Then the user should be at URL "gantry"
        And should see heading "Do you want to add a gantry?"
        When the user selects "Yes"
        And continues

        # short-term-storage
        Then the user should be at URL "short-term-storage"
        When the user goes back
        Then the user should be at URL "gantry"
        When the user continues
        Then the user should be at URL "short-term-storage"
        And should see heading "What type of short-term storage do you want for the stackable material from the separator?"
        When the user selects "Concrete pad"
        And continues

        # other-items
        Then the user should be at URL "other-items"
        When the user goes back
        Then the user should be at URL "short-term-storage"
        When the user continues
        Then the user should be at URL "other-items"
        And should see heading "What other items do you need?"
        When the user selects the following
            | Reception pit            |
            | Centrifugal chopper pump |
        And continues

        # item-sizes-quantities
        Then the user should be at URL "item-sizes-quantities"
        When the user goes back
        Then the user should be at URL "other-items"
        When the user continues
        Then the user should be at URL "item-sizes-quantities"
        And should see heading "Item sizes and quantities"
        When the user enters "100" in "Receptionpit"
        And enters "200" in "Centrifugalchopperpump"
        And continues

        # project-summary
        Then the user should be at URL "project-summary"
        When the user goes back
        Then the user should be at URL "item-sizes-quantities"
        When the user continues
        Then the user should be at URL "project-summary"
        And should see heading "Your project items"
        When the user continues

        # potential-amount
        Then the user should be at URL "potential-amount"
        When the user goes back
        Then the user should be at URL "project-summary"
        When the user continues
        Then the user should be at URL "potential-amount"
        And should see heading "Potential grant funding"
        When the user continues

        # remaining-costs
        Then the user should be at URL "remaining-costs"
        When the user goes back
        Then the user should be at URL "potential-amount"
        When the user continues
        Then the user should be at URL "remaining-costs"
        And should see heading "Can you pay the remaining costs?"
        When the user selects "Yes"
        And continues

        # planning-permission
        Then the user should be at URL "planning-permission"
        When the user goes back
        Then the user should be at URL "remaining-costs"
        When the user continues
        Then the user should be at URL "planning-permission"
        And should see heading "Does the project have planning permission?"
        When the user selects "Approved"
        And continues

        # planning-permission-evidence
        Then the user should be at URL "planning-permission-evidence"
        When the user goes back
        Then the user should be at URL "planning-permission"
        When the user continues
        Then the user should be at URL "planning-permission-evidence"
        And should see heading "Your planning permission"
        When the user enters "Northants" in "planningAuthority"
        And enters "NN12345" in "planningReferenceNumber"
        And continues

        # grid-reference
        Then the user should be at URL "grid-reference"
        When the user goes back
        Then the user should be at URL "planning-permission-evidence"
        When the user continues
        Then the user should be at URL "grid-reference"
        And should see heading "What is the OS grid reference for your slurry store?"
        When the user enters "SP 83498 61506" in "existingGridReference"
        And enters "SP 83498 61507" in "newGridReference"
        And continues

        # planning-permission-summary
        Then the user should be at URL "planning-permission-summary"
        When the user goes back
        Then the user should be at URL "grid-reference"
        When the user continues
        Then the user should be at URL "planning-permission-summary"
        And should see heading "Check your answers before getting your results"
        When the user continues to their results

        # result-page
        Then the user should be at URL "result-page"
        When the user goes back
        Then the user should be at URL "planning-permission-summary"
        When the user continues to their results
        Then the user should be at URL "result-page"
        And should see heading "Your results"
        And should see "Eligible to apply" for their eligibility result
        And continues

        # business-details
        Then the user should be at URL "business-details"
        When the user goes back
        Then the user should be at URL "result-page"
        When the user continues
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
        When the user goes back
        Then the user should be at URL "business-details"
        When the user continues
        Then the user should be at URL "applying"
        And should see heading "Who is applying for this grant?"
        When the user selects "Agent"
        And continues

        # agent-details
        Then the user should be at URL "agent-details"
        When the user goes back
        Then the user should be at URL "applying"
        When the user continues
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
        When the user goes back
        Then the user should be at URL "agent-details"
        When the user continues
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
        When the user goes back
        Then the user should be at URL "applicant-details"
        When the user continues
        Then the user should be at URL "check-details"
        And should see heading "Check your details"
        And continues

        # confirm
        Then the user should be at URL "confirm"
        When the user goes back
        Then the user should be at URL "check-details"
        When the user continues
        Then the user should be at URL "confirm"
        And should see heading "Confirm and send"
