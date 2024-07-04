const zapier = require("zapier-platform-core");

const App = require("../index");
const appTester = zapier.createAppTester(App);

describe("custom auth", () => {
	zapier.tools.env.inject();
	it("passes authentication and returns json", async () => {
		const bundle = {
			authData: {
				apiKey: process.env.API_TOKEN,
			},
		};

		const response = await appTester(App.authentication.test, bundle);
		expect(response).toHaveProperty("app");
		expect(response).toHaveProperty("org");
	});

	it("fails on bad auth", async () => {
		const bundle = {
			authData: {
				apiKey: "bad",
			},
		};

		try {
			await appTester(App.authentication.test, bundle);
		} catch (error) {
			expect(error.message).toContain(
				"Message: Request failed with status code 401"
			);
			return;
		}
		throw new Error("appTester should have thrown");
	});
});
