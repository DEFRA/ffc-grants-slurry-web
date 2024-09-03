Feature: Slurry Specific Eligibility and Elimination

    Scenario: Explore all slurry eligibility questions and elimination routes
        - as a dairy farmer

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
        When the user selects "Limited liability partnership"
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

        # slurry eligibility begins

        # system-type elimination 1
        Then the user should be at URL "system-type"
        And should see heading "What is your current manure management system?"
        When the user selects "Farmyard manure system that does not produce slurry"
        And continues
        Then the user should be at URL "system-type"
        And should see heading "You cannot apply for a grant from this scheme"
        When the user goes back

        # system-type elimination 2
        Then the user should be at URL "system-type"
        And should see heading "What is your current manure management system?"
        When the user selects "I do not have a slurry system"
        And continues
        Then the user should be at URL "system-type"
        And should see heading "You cannot apply for a grant from this scheme"
        When the user goes back

        # system-type
        Then the user should be at URL "system-type"
        And should see heading "What is your current manure management system?"
        When the user selects "Farmyard manure and slurry system"
        And continues

        # existing-storage-capacity elimination
        Then the user should be at URL "existing-storage-capacity"
        And should see heading "How many months’ slurry storage capacity do you have?"
        When the user selects "6 months or more, and it is fit for purpose"
        And continues
        Then the user should be at URL "existing-storage-capacity"
        And should see heading "You cannot apply for a grant from this scheme"
        When the user goes back      

        # existing-storage-capacity
        Then the user should be at URL "existing-storage-capacity"
        And should see heading "How many months’ slurry storage capacity do you have?"
        When the user selects "Less than 6 months"
        And continues

        # planned-storage-capacity elimination
        Then the user should be at URL "planned-storage-capacity"
        And should see heading "How many months’ slurry storage capacity will you have after the project?"
        When the user selects "Less than 6 months"
        And continues
        Then the user should be at URL "planned-storage-capacity"
        And should see heading "You cannot apply for a grant from this scheme"
        When the user goes back    

        # planned-storage-capacity
        Then the user should be at URL "planned-storage-capacity"
        And should see heading "How many months’ slurry storage capacity will you have after the project?"
        When the user selects "6 months"
        And continues

        # applying-for elimination
        Then the user should be at URL "applying-for"
        And should see heading "What are you applying for?"
        When the user selects "None of the above"
        And continues
        Then the user should be at URL "applying-for"
        And should see heading "You cannot apply for a grant from this scheme"
        When the user goes back   

        # applying-for
        Then the user should be at URL "applying-for"
        And should see heading "What are you applying for?"
        When the user selects "Building a new store, replacing or expanding an existing store"
        And continues

        # project-type elimination
        Then the user should be at URL "project-type"
        And should see heading "How will you increase your storage capacity?"
        When the user selects "None of the above"
        And continues
        Then the user should be at URL "project-type"
        And should see heading "You cannot apply for a grant from this scheme"
        When the user goes back  

        # project-type
        Then the user should be at URL "project-type"
        And should see heading "How will you increase your storage capacity?"
        When the user selects "Add a new store to increase existing capacity"
        And continues

        # grant-funded-cover elimination
        Then the user should be at URL "grant-funded-cover"
        And should see heading "Will the grant-funded store have an impermeable cover?"
        When the user selects "None of the above"
        And continues
        Then the user should be at URL "grant-funded-cover"
        And should see heading "You cannot apply for a grant from this scheme"
        When the user goes back

        # grant-funded-cover
        Then the user should be at URL "grant-funded-cover"
        And should see heading "Will the grant-funded store have an impermeable cover?"
