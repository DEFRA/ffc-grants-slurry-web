Feature: Tenancy
     Scenario Outline: Choosing Yes land farm business owns
              Given I open the url "/slurry-infrastructure/applicant-type"
              And I pause for 500ms
              When I click on the element "#applicantype-2"  
              When I click on the button "#btnContinue"
              And I pause for 500ms
              When I click on the element "#legalStatus-2"
              And I click on Continue button
              And I pause for 500ms
              And I click on CountryYes button
              And I pause for 500ms
              When I click "<preparatoryWork>" button
              And I click on Continue button
              And I pause for 500ms
              Then I expect that the url contains "/tenancy"
              When I click on yes land ownership button
              And I click on Continue button
              And I pause for 500ms
              Then I expect that the url contains "/system-type"
              Examples:
              |trades  |preparatoryWork|
    #          |sole    |yesPrepWork    |
             

     Scenario: Choosing No land farm business owns with tenancy agreement
              Given I open the url "/slurry-infrastructure/applicant-type"
              And I pause for 500ms
              When I click on the element "#farmingType-2"  
              When I click on the button "#btnContinue"
              And I pause for 500ms
              When I click on the element "#legalStatus-2"
              And I click on Continue button
              And I pause for 500ms
              And I click on CountryYes button
              And I pause for 500ms
              Then I expect that the url contains "/project-started"
              When I click on the element "#projectStarted"
              And I click on Continue button
              And I pause for 500ms
              Then I expect that the url contains "/tenancy"
              When I click on the element "#landOwnership-2"
              And I click on Continue button
              And I pause for 500ms
              Then I expect that the url contains "/tenancy-length"
              When I click on the element "#tenancyLength"
              And I click on Continue button
              And I pause for 500ms
              Then I expect that the url contains "/project-items"

              Scenario: Choosing No land farm business owns with No tenancy agreement
              Given I open the url "/slurry-infrastructure/applicant-type"
              And I pause for 500ms
              When I click on the element "#applicantType-2"  
              When I click on the button "#btnContinue"
              And I pause for 500ms
              When I click on the element "#legalStatus-2"
              And I click on Continue button
              And I pause for 500ms
              And I click on CountryYes button
              And I pause for 500ms
              Then I expect that the url contains "/project-started"
              When I click on the element "#projectStarted"
              And I click on Continue button
              And I pause for 500ms
              Then I expect that the url contains "/tenancy"
              When I click on the element "#landOwnership-2"
              And I click on Continue button
              And I pause for 500ms
              Then I expect that the url contains "/tenancy-length"
              When I click on the element "#tenancyLength-2"
              And I click on Continue button
              And I pause for 500ms
              Then I expect that the url contains "/tenancy-length-condition"
              And I click on Continue button
              And I pause for 500ms
              Then I expect that the url contains "/project-items"
            