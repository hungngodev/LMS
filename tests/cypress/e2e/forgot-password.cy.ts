const RESET_PASSWORD_ALERT_TITLE = "Recovery Email Sent";
const RESET_PASSWORD_ALERT_ACTION =
	"Check your inbox, it should arrive within the next 30 seconds. If it does not, please try again in 30 seconds.";
const RESET_PASSWORD_FAIL_INVALID_EMAIL = "Invalid email";
const FORGET_PASSWORD_EMAIL_INPUT = 'input[name="email"]';
describe("Forgot Password Happy Cases", () => {
	it("TC1 - Able to request FORGOT PASSWORD with correct email", () => {
		Cypress.on("uncaught:exception", (err, runnable) => {
			// returning false here prevents Cypress from
			// failing the test
			return false;
		});
		cy.visit(Cypress.config().baseUrl + "/login");
		cy.wait(2000);
		cy.get("a").contains("Forgot Your Password?").click();
		cy.get("h2")
			.contains("Recover Password To Seamless LMS")
			.should("be.visible");

		cy.get(FORGET_PASSWORD_EMAIL_INPUT).type(Cypress.env("initAdminEmail"));
		cy.get("button").contains("Send Recovery Email").click();
		cy.wait(5000);

		cy.get("div").contains(RESET_PASSWORD_ALERT_TITLE).should("be.visible");
		cy.get("div")
			.contains(RESET_PASSWORD_ALERT_ACTION)
			.should("be.visible");
	});
});

describe("Forgot Password Edge Cases", () => {
	it("TC2 - Wrong email format", () => {
		Cypress.on("uncaught:exception", (err, runnable) => {
			// returning false here prevents Cypress from
			// failing the test
			return false;
		});

		//Visit login url
		cy.visit(Cypress.config().baseUrl + "/login");
		cy.get("a").contains("Forgot Your Password?").click();
		cy.wait(2000);

		//Input email without domain
		cy.log("Input email without domain");
		cy.get(FORGET_PASSWORD_EMAIL_INPUT).type("student");
		cy.get("button").contains("Send Recovery Email").click();
		cy.wait(3000);

		cy.get("p")
			.contains(RESET_PASSWORD_FAIL_INVALID_EMAIL)
			.should("be.visible");

		//Input email without @
		cy.log("Input email without @");
		cy.get(FORGET_PASSWORD_EMAIL_INPUT)
			.clear()
			.type("studentseamlesstech.io");
		cy.get("button").contains("Send Recovery Email").click();
		cy.wait(2000);
		cy.get("p")
			.contains(RESET_PASSWORD_FAIL_INVALID_EMAIL)
			.should("be.visible");

		//Input nothing to email field
		cy.log("Input nothing to email field");
		cy.get(FORGET_PASSWORD_EMAIL_INPUT).clear();
		cy.get("button").contains("Send Recovery Email").click();
		cy.wait(3000);
		cy.get("p")
			.contains(RESET_PASSWORD_FAIL_INVALID_EMAIL)
			.should("be.visible");
	});
});
