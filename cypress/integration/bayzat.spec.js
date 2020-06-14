describe("e2e Test", () => {

 before (function(){
    // open URL and load example.json fixture file to login before test
    cy.visit("/");
    cy.fixture('users.json').as('data')
    
    cy.get('@data').then((data) => {
    cy.contains("Login").click()
     cy.get('input[name="username"]')
       .type(data.email)
     cy.get('input[name="password"]')
       .type(data.password)
     cy.get("form").submit();
     cy.wait(20000)
     cy.url().should('include', '/dashboard') 
  })
  })
  
    it("Add and Delete employee end to end scenario", () => {
   
      cy.get('a[data-external-id="view-team-link"]').click()
     
     cy.get('table').contains('th', 'Name').should('be.visible')
    
     cy.contains("Hire Date").should('be.visible')
    
      cy.get('a[data-external-id="add-employees-link"]').click()
      cy.get('a[href*="/enterprise/dashboard/employees/create"]').click()
      //create random firstname, lastname, work email for add employee
      cy.get('input[name="firstName"]')
        .type("aida"+ Math.random().toString(20).substr(2, 6))
  
      cy.get('input[name="lastName"]')
        .type("aida" + Math.random().toString(20).substr(2, 6))
        
      cy.get('input[name="workEmail"]')
        .type(Math.random().toString(20).substr(2, 6) + "@test.com")
     cy.contains("Create and add another").click()
    
      cy.wait(10000)
      // add 2nd employee with create Btn 
      cy.get('input[name="firstName"]')
      .type("aida"+ Math.random().toString(20).substr(2, 6))
     
      cy.get('input[name="lastName"]')
      .type("aida"+ Math.random().toString(20).substr(2, 6))
   
      cy.get('input[name="workEmail"]')
      .type(Math.random().toString(20).substr(2, 6)+ "@test.com")
      cy.contains("Create").click()
      cy.wait(20000)

      cy.get('a[data-external-id="view-team-link"]').click()
      cy.contains("Aida")
    
     cy.wait(10000)
     cy.get('input[placeholder ="Search by employee name"]').type("Aida")
     cy.wait(30000)
     cy.get('table').contains('td', "Aida").should('be.visible')
     cy.get('div.pad-btm > table > thead > tr > th:nth-child(1) > i').click()
      cy.wait(30000)
      cy.get('button[type="button"]').eq(6).click()
      cy.wait(30000)

      cy.get('button[data-external-id="submit-button"]').click()
      cy.get('a[data-external-id="logout-link"]').click()

      cy.url().should('include', 'dashboard/login') 
      cy.get('button[type="submit"]').contains("Log In").should('be.visible') 
    })  

})