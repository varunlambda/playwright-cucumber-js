Feature: DuckDuckGo Search

  Scenario: Search results should match
    Given Open Google Website
    When Search for LambdaTest
    Then Title should match

