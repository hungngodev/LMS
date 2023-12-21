import { defineConfig } from "cypress";

export default defineConfig({
	e2e: {
		baseUrl: "http://localhost:3000",
		defaultCommandTimeout: 10000,
		setupNodeEvents(on, config) {}
	},
	env: {
		initAdminEmail: "admin@seamlesstech.io",
		initAdminPassword: "SOME_PASSWORD"
	},
	fileServerFolder: "tests",
	supportFolder: "tests/cypress/support",
	fixturesFolder: "tests/cypress/fixtures"
});
