const zapier = require("zapier-platform-core");

const App = require("../index");
const appTester = zapier.createAppTester(App);

describe("custom auth", () => {
	zapier.tools.env.inject();
	it("passes authentication and returns json", async () => {
		const bundle = {
			authData: {
				apiKey: "a9a5d437-5902-4248-94cc-8ba7027819be",
			},
		};

		const response = await appTester(App.authentication.test, bundle);
		expect(response.status).toBe(200);
		expect(response.data).toHaveProperty("app");
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
			expect(error.message).toContain("The API Key you supplied is incorrect");
			return;
		}
		throw new Error("appTester should have thrown");
	});
});
