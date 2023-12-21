const NEW_PASSWORD_INPUT = 'input[name="newPassword"]';
const CONFIRM_PASSWORD_INPUT = 'input[name="confirmNewPassword"]';
const RESET_PASSWORD_ALERT_SUCCESS = "New Password Set";
const RESET_PASSWORD_ALERT_BE_ERROR_TITLE = "Uh oh, something bad happened";
const RESET_PASSWORD_ALERT_BE_ERROR_ACTION =
	"There was a problem in our system, please try again later";
const RESET_PASSWORD_ALERT_INVALID_LINK_TITLE =
	"Uh oh, the link you clicked is no longer valid";
describe("Reset Password Happy Cases", () => {
	it("TC1 - Able to send the reset password request with correct payload", () => {
		Cypress.on("uncaught:exception", (err, runnable) => {
			// returning false here prevents Cypress from failing the test
			return false;
		});
		cy.visit(Cypress.config().baseUrl + "/reset-password?token=SOME_TOKEN");

		cy.get(NEW_PASSWORD_INPUT).type("any password");
		cy.get(CONFIRM_PASSWORD_INPUT).type("any password");

		//Verify payload
		cy.intercept(
			"POST",
			Cypress.config().baseUrl + "/api/users/reset-password",
			(req) => {
				req.reply({
					statusCode: 200
				});
				expect(req.body.password).equal("any password");
				expect(req.body.token).equal("SOME_TOKEN");
			}
		);
		cy.get("button").contains("Reset Password").click();
		cy.wait(3000);

		//Verify response alert
		cy.get("div")
			.contains(RESET_PASSWORD_ALERT_SUCCESS)
			.should("be.visible");
	});
});

describe("Reset Password Edge Cases", () => {
	it("TC2.1 - Error from Back-end Alert Verification", () => {
		Cypress.on("uncaught:exception", (err, runnable) => {
			// returning false here prevents Cypress from failing the test
			return false;
		});
		cy.visit(Cypress.config().baseUrl + "/reset-password?token=SOME_TOKEN");

		cy.get(NEW_PASSWORD_INPUT).type("any password");
		cy.get(CONFIRM_PASSWORD_INPUT).type("any password");
		cy.get("button").contains("Reset Password").click();
		cy.wait(5000);

		cy.get("div")
			.contains(RESET_PASSWORD_ALERT_BE_ERROR_TITLE)
			.should("be.visible");
		cy.get("div")
			.contains(RESET_PASSWORD_ALERT_BE_ERROR_ACTION)
			.should("be.visible");
	});
	it("TC2.2 - Error from Back-end Alert Verification", () => {
		Cypress.on("uncaught:exception", (err, runnable) => {
			// returning false here prevents Cypress from failing the test
			return false;
		});
		cy.visit(Cypress.config().baseUrl + "/reset-password");

		cy.get(NEW_PASSWORD_INPUT).type("any password");
		cy.get(CONFIRM_PASSWORD_INPUT).type("any password");

		cy.get("button").contains("Reset Password").click();
		cy.get("div")
			.contains(RESET_PASSWORD_ALERT_INVALID_LINK_TITLE)
			.should("be.visible");
	});
	it("TC2.3 - Confirm password not matching", () => {
		//No validation yet
	});
});
