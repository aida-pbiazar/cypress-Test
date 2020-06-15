describe("e2e Test", () => {

  //opening url, loading json data from fixtures, and login are in before function
  before(function () {
    // open baseURL declared in cypress.json file
    cy.visit("/");

    cy.fixture('users.json').as('data')

    cy.get('@data').then((data) => {
      //login with data from users json file
      cy.contains("Login").click()
      cy.get('input[name="username"]')
        .type(data.email)

      cy.get('input[name="username"]').should('have.value', data.email)

      cy.get('input[name="password"]')
        .type(data.password)
      cy.get('input[name="password"]').should('have.value', data.password)
      cy.get("form").submit();
      //cy.wait(20000)
      cy.url().should('include', '/dashboard')
    })
  })

  it("Add and Delete employee end to end scenario with assertions", () => {
    //go to view team page
    cy.get('a[data-external-id="view-team-link"]').click()
    // verify in employee table, name column and hire date exist for employees
    // I assert the elements of table for employees as there might be no employee as data here then my test will fail
    cy.get('table').contains('th', 'Name').should('be.visible')
    cy.get('table').contains('th', 'Hire Date').should('be.visible')


    //generate random strings for firstnames and last names for new employees to pass to add new employee function
    var firstNameVal = generateRandomString(10);
    var lastNameVal = generateRandomString(10);

    addEmployee(firstNameVal, lastNameVal)
    cy.wait(20000)

    //generate 2nd random employee names as mentioned in the test
    var firstNameVal = generateRandomString(10);
    var lastNameVal = generateRandomString(10);

    addEmployee(firstNameVal, lastNameVal)
    cy.wait(30000)
    cy.get('a[data-external-id="view-team-link"]').click()
    //verify new employee added exists in view team page
    cy.contains(firstNameVal + " " + lastNameVal, { matchCase: false })

    //search for new employee added
    cy.get('input[placeholder ="Search by employee name"]').type(firstNameVal + " " + lastNameVal)
    cy.wait(20000)
    //verify new employee exists in the filtered result page
    cy.get('table').contains('td', firstNameVal, { matchCase: false }).should('be.visible')
    //select all employess filtered on the page to be deleted
    cy.get('div.pad-btm > table > thead > tr > th:nth-child(1) > i').click()
    cy.wait(10000)

    //click on delete button 
    cy.get('button[type="button"]').eq(6).click()
    //click on submit button on delete pop up to confirm
    cy.get('button[data-external-id="submit-button"]').click()
    //verify employee deleted does not exist anymore on the page
    cy.get('table').contains('td', firstNameVal, { matchCase: false }).should('not.exist');
    //logout
    cy.get('a[data-external-id="logout-link"]').click()
    //verify login url after logout
    cy.url().should('include', 'dashboard/login')
    //verify login button exists after logout
    cy.get('button[type="submit"]').contains("Log In").should('be.visible')
  })

})

function generateRandomString(length) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

function addEmployee(firstNameVal, lastNameVal) {

  cy.get('a[data-external-id="add-employees-link"]').click()
  cy.get('a[href*="/enterprise/dashboard/employees/create"]').click()

  //create random firstname, lastname, work email for add employee
  cy.get('input[name="firstName"]')
    .type(firstNameVal)
  cy.get('input[name="lastName"]')
    .type(lastNameVal)
  cy.get('input[name="workEmail"]')
    .type(generateRandomString(5) + "@test.com")
  cy.contains("Create").click()
}
