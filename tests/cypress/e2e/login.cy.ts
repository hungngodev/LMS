const LOGIN_FAIL_ALERT_TITLE = "Incorrect email or password";
const LOGIN_FAIL_ALERT_ACTION = "Please try again";
const LOGIN_FAIL_INVALID_EMAIL = "Invalid email address";
const LOGIN_FAIL_PASSWORD_CHARACTER_LIMIT =
	"Must be at least 8 characters long";
const LOGIN_FAIL_ALERT_BACKEND_ERROR_TITLE =
	"Uh oh, something went wrong on our end";
const LOGIN_FAIL_ALERT_BACKEND_ERROR_ACTION =
	"There was a problem with our system, please try again later";
const LOGIN_FAIL_ALERT_CLIENT_TOO_MANY_FAILS_TITLE =
	"Too many failed login attempts!!!";
const LOGIN_FAIL_ALERT_CLIENT_TOO_MANY_FAILS_ACTION =
	"This account is temporarily locked, please try again later";
const LOGIN_EMAIL_INPUT = 'input[name="email"]';
const LOGIN_PASSWORD_INPUT = 'input[name="password"]';

describe("Login Happy Cases", () => {
	it("TC1 - Able to login with correct credentials", () => {
		Cypress.on("uncaught:exception", (err, runnable) => {
			// returning false here prevents Cypress from
			// failing the test
			return false;
		});
		cy.visit(Cypress.config().baseUrl + "/login");
		cy.get(LOGIN_EMAIL_INPUT).type(Cypress.env("initAdminEmail"));
		cy.get(LOGIN_PASSWORD_INPUT).type(Cypress.env("initAdminPassword"));
		cy.get("button").contains("Log In").click();

		//Verify successfully login and see the default h4
		cy.wait(5000);
		cy.get("h4").contains("Main Menu").should("be.visible");
	});
});

describe("Login Edge Cases", () => {
	it("TC2.1 - Wrong email format", () => {
		Cypress.on("uncaught:exception", (err, runnable) => {
			// returning false here prevents Cypress from
			// failing the test
			return false;
		});

		//Visit login url
		cy.visit(Cypress.config().baseUrl + "/login");
		cy.wait(2000);

		//Input email without domain
		cy.log("Input email without domain");
		cy.get(LOGIN_EMAIL_INPUT).type(
			Cypress.env("initAdminEmail").split("@")[0]
		);
		cy.get(LOGIN_PASSWORD_INPUT).type(Cypress.env("initAdminPassword"));
		cy.get("button").contains("Log In").click();
		cy.wait(2000);

		cy.get("p").contains(LOGIN_FAIL_INVALID_EMAIL).should("be.visible");

		//Input email without @
		cy.log("Input email without @");
		cy.get(LOGIN_EMAIL_INPUT)
			.clear()
			.type(Cypress.env("initAdminEmail").replace("@", "-"));
		cy.get("button").contains("Log In").click();
		cy.get("p").contains(LOGIN_FAIL_INVALID_EMAIL).should("be.visible");

		//Input nothing to email field
		cy.log("Input nothing to email field");
		cy.get(LOGIN_EMAIL_INPUT).clear();
		cy.get("button").contains("Log In").click();
		cy.get("p").contains(LOGIN_FAIL_INVALID_EMAIL).should("be.visible");
	});

	it("TC2.2 - Wrong password format", () => {
		Cypress.on("uncaught:exception", (err, runnable) => {
			// returning false here prevents Cypress from
			// failing the test
			return false;
		});

		//Visit login url
		cy.visit(Cypress.config().baseUrl + "/login");
		cy.wait(2000);

		//Input password < 8 characters (7 chars)
		cy.log("Input password < 8 characters (7 chars)");
		cy.get(LOGIN_EMAIL_INPUT).type(Cypress.env("initAdminEmail"));
		cy.get(LOGIN_PASSWORD_INPUT).type("shortpw");
		cy.get("button").contains("Log In").click();
		cy.get("p")
			.contains(LOGIN_FAIL_PASSWORD_CHARACTER_LIMIT)
			.should("be.visible");

		//Input wrong password 8 characters (8 chars) should show alert
		cy.log("Input wrong password 8 characters (8 chars) should show alert");
		cy.get(LOGIN_PASSWORD_INPUT)
			.clear()
			.type("intentionally wrong password");
		cy.get("button").contains("Log In").click();
		cy.wait(2000);

		cy.get("div").contains(LOGIN_FAIL_ALERT_ACTION).should("be.visible");
		cy.get("div").contains(LOGIN_FAIL_ALERT_TITLE).should("be.visible");
	});

	it("TC3.1 - Too many fail requests user block", () => {
		//Visit login url
		cy.visit(Cypress.config().baseUrl + "/login");
		cy.intercept(
			"POST",
			Cypress.config().baseUrl + "/api/users/login",
			(req) => {
				req.reply({
					statusCode: 429,
					body: {
						errors: [
							{
								message:
									"This user is locked locked due to many failed login attempts"
							}
						]
					}
				});
			}
		);
		cy.get(LOGIN_EMAIL_INPUT).type(Cypress.env("initAdminEmail"));
		cy.get(LOGIN_PASSWORD_INPUT).type("any password");
		cy.get("button").contains("Log In").click();
		cy.wait(1000);

		cy.get("div")
			.contains(LOGIN_FAIL_ALERT_CLIENT_TOO_MANY_FAILS_TITLE)
			.should("be.visible");
		cy.get("div")
			.contains(LOGIN_FAIL_ALERT_CLIENT_TOO_MANY_FAILS_ACTION)
			.should("be.visible");
	});

	it("TC3.2 - Error from back-end", () => {
		//Visit login url
		cy.visit(Cypress.config().baseUrl + "/login");
		cy.intercept(
			"POST",
			Cypress.config().baseUrl + "/api/users/login",
			(req) => {
				req.reply({
					statusCode: 500,
					body: {
						errors: [{ message: "Unexpected Error from Backend" }]
					}
				});
			}
		);
		cy.get(LOGIN_EMAIL_INPUT).type(Cypress.env("initAdminEmail"));
		cy.get(LOGIN_PASSWORD_INPUT).type("any password");
		cy.get("button").contains("Log In").click();

		cy.get("div")
			.contains(LOGIN_FAIL_ALERT_BACKEND_ERROR_ACTION)
			.should("be.visible");
		cy.get("div")
			.contains(LOGIN_FAIL_ALERT_BACKEND_ERROR_TITLE)
			.should("be.visible");
	});
});
