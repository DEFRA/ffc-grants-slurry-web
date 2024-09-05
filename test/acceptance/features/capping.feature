Feature: Capping

    Scenario: Total grant funding is capped at £250,000
        # login/start
        Given the user navigates to "/slurry-infrastructure/start"
        And completes any login process
        And clicks on "Accept analytics cookies"
        Then the user should see heading "Check if you can apply for a Slurry Infrastructure Grant"
        When the user clicks on "Start now"

        # applicant-type
        Then the user should be at URL "applicant-type"
        And should see heading "Which livestock do you farm mainly?"
        When the user selects "Beef"
        And continues

        # legal-status
        Then the user should be at URL "legal-status"
        And should see heading "What is the legal status of the business?"
        When the user selects "Co-operative society (Co-Op)"
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
        When the user selects "Slurry-based system"
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
        When the user selects "Yes, I already have a cover"
        And continues

        # existing-cover
        Then the user should be at URL "existing-cover"
        And should see heading "Do you want to apply for a cover for existing stores?"
        When the user selects "No"
        And continues

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
        When the user selects "In-situ cast-reinforced concrete slurry store"
        And continues

        # capacity-increase-replace
        Then the user should be at URL "capacity-increase-replace"
        And should see heading label "What estimated volume do you need to have 6 months’ storage?"
        When the user enters "3500" in "serviceCapacityIncrease"
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
        And should see the total requested grant amount is greater than "£250,000"
        And continues

        # potential-amount
        Then the user should be at URL "potential-amount"
        And should see heading "Potential grant funding"
        And should see body "Based on the reference cost for each item and the approximate size and quantities you entered, we estimate you could be eligible for a grant of £250,000"

    Scenario: Applicants are eliminated if total grant funding is less than £25,000
        # login/start
        Given the user navigates to "/slurry-infrastructure/start"
        And completes any login process
        And clicks on "Accept analytics cookies"
        Then the user should see heading "Check if you can apply for a Slurry Infrastructure Grant"
        When the user clicks on "Start now"

        # applicant-type
        Then the user should be at URL "applicant-type"
        And should see heading "Which livestock do you farm mainly?"
        When the user selects "Beef"
        And continues

        # legal-status
        Then the user should be at URL "legal-status"
        And should see heading "What is the legal status of the business?"
        When the user selects "Co-operative society (Co-Op)"
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
        When the user selects "Slurry-based system"
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
        When the user selects "Yes, I already have a cover"
        And continues

        # existing-cover
        Then the user should be at URL "existing-cover"
        And should see heading "Do you want to apply for a cover for existing stores?"
        When the user selects "No"
        And continues

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
        When the user selects "In-situ cast-reinforced concrete slurry store"
        And continues

        # capacity-increase-replace
        Then the user should be at URL "capacity-increase-replace"
        And should see heading label "What estimated volume do you need to have 6 months’ storage?"
        When the user enters "100" in "serviceCapacityIncrease"
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
        And should see the total requested grant amount is less than "£25,000"
        When the user continues

        # potential-amount
        Then the user should be at URL "potential-amount"
        And should see heading "You cannot apply for a grant from this scheme"
        And should see body "The minimum grant you can claim is £25,000."

    Scenario: Concrete Bunker grant contribution is capped at a maximum of 100m² equivalent to £16,818
        # login/start
        Given the user navigates to "/slurry-infrastructure/start"
        And completes any login process
        And clicks on "Accept analytics cookies"
        Then the user should see heading "Check if you can apply for a Slurry Infrastructure Grant"
        When the user clicks on "Start now"

        # applicant-type
        Then the user should be at URL "applicant-type"
        And should see heading "Which livestock do you farm mainly?"
        When the user selects "Beef"
        And continues

        # legal-status
        Then the user should be at URL "legal-status"
        And should see heading "What is the legal status of the business?"
        When the user selects "Co-operative society (Co-Op)"
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
        When the user selects "Slurry-based system"
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
        When the user selects "Yes, I already have a cover"
        And continues

        # existing-cover
        Then the user should be at URL "existing-cover"
        And should see heading "Do you want to apply for a cover for existing stores?"
        When the user selects "No"
        And continues

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
        When the user selects "In-situ cast-reinforced concrete slurry store"
        And continues

        # capacity-increase-replace
        Then the user should be at URL "capacity-increase-replace"
        And should see heading label "What estimated volume do you need to have 6 months’ storage?"
        When the user enters "100" in "serviceCapacityIncrease"
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
        When the user selects "No"
        And continues

        # short-term-storage
        Then the user should be at URL "short-term-storage"
        And should see heading "What type of short-term storage do you want for the stackable material from the separator?"
        When the user selects "Concrete bunker"
        And enters "200" in "concreteBunkerSize"
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
        And should see the following items in the breakdown of funding
            | ITEM            | UNIT COST | QUANTITY | TOTAL   |
            | Concrete bunker | £168.18   | 200m²    | £16,818 |
        When the user continues    

        # potential-amount
        Then the user should be at URL "potential-amount"
        And should see heading "Potential grant funding"
        And should see body "The grant contribution for the concrete bunker is capped at £16,818"
