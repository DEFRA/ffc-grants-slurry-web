Feature: ProjectStart
     Scenario Outline: Choosing different start work on the project
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
              When I click "<preparatoryWork>" button
              And I click on Continue button
              And I pause for 500ms
              Then I expect that the url contains "/tenancy"
              Examples:
              |trades   |preparatoryWork|
#              |sole    |yesPrepWork    |
#              |trust   |noWorkDoneYet  |

#     Scenario: Choosing begun project work
#              Given I open the url "/slurry-infrastructure/applicant-type"
#              And I pause for 500ms
#              When I click on the element "#applicantType-2"  
#              When I click on the button "#btnContinue"
#              And I pause for 500ms
#              When I click on the element "#legalStatus-2"
#              And I click on Continue button
#              And I pause for 500ms
#              And I click on CountryYes button
#              And I pause for 500ms
#              Then I expect that the url contains "/project-started"
#              When I click on the element "#projectStarted-2"
#              And I click on Continue button
#              And I pause for 500ms
#              Then I expect that the url contains "/project-start"

             