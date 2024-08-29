Feature: Common Eligibility and Elimination

    Scenario: Explore all common eligibility questions and elimination routes
        - as a beef farmer
        
        # login/start
        Given the user navigates to "/slurry-infrastructure/start"
        And completes any login process
        And clicks on "Accept analytics cookies"
        Then the user should see heading "Check if you can apply for a Slurry Infrastructure Grant"
        When the user clicks on "Start now"

        # nature-of-business elimination
        Then the user should be at URL "applicant-type"
        And should see heading "Which livestock do you farm mainly?"
        When the user selects "None of the above"
        And continues
        Then the user should be at URL "applicant-type"
        And should see heading "You cannot apply for a grant from this scheme"
        When the user goes back

        # nature-of-business
        Then the user should be at URL "applicant-type"
        And should see heading "Which livestock do you farm mainly?"
        When the user selects "Beef"
        And continues

        # legal-status elimination
        Then the user should be at URL "legal-status"
        And should see heading "What is the legal status of the business?"
        When the user selects "None of the above"
        And continues
        Then the user should be at URL "legal-status"
        And should see heading "You cannot apply for a grant from this scheme"
        When the user goes back

        # legal-status
        Then the user should be at URL "legal-status"
        And should see heading "What is the legal status of the business?"
        When the user selects "Sole trader"
        And continues

        # country elimination
        Then the user should be at URL "country"
        And should see heading "Is the planned project in England?"
        When the user selects "No"
        And continues
        Then the user should be at URL "country"
        And should see heading "You cannot apply for a grant from this scheme"
        When the user goes back

        # country
        Then the user should be at URL "country"
        And should see heading "Is the planned project in England?"
        When the user selects "Yes"
        And continues

        # project-started elimination
        Then the user should be at URL "project-started"
        And should see heading "Have you already started work on the project?"
        When the user selects "Yes, we have begun project work"
        And continues
        Then the user should be at URL "project-started"
        And should see heading "You cannot apply for a grant from this scheme"
        When the user goes back

        # project-started
        Then the user should be at URL "project-started"
        And should see heading "Have you already started work on the project?"

