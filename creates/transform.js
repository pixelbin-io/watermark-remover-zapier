const perform = async (z, bundle) => {
	imagetobeTransformed = "";
	if (bundle.inputData.url.includes(`${process.env.CDN_URL}`)) {
		imagetobeTransformed = bundle.inputData.url;
	} else {
		try {
			const response = await z.request({
				url: `${process.env.BASE_URL}/service/platform/assets/v1.0/upload/url`,
				method: "POST",
				headers: {
					accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					url: bundle.inputData.url,
					path: "/__zapier/transformations",
					tags: bundle.inputData.tags,
					access: "public-read",
					metadata: {},
					overwrite: true,
					filenameOverride: true,
				}),
			});
			imagetobeTransformed = response.data.url;
		} catch (error) {
			throw new Error(`FAILED to upload image: ${error}`);
		}
	}

	let replacement = "wm.remove(";
	if (bundle.inputData.rem_text)
		replacement += `rem_text:${bundle.inputData.rem_text},`;
	if (bundle.inputData.rem_logo)
		replacement += `rem_logo:${bundle.inputData.rem_logo},`;
	if (bundle.inputData.box1) replacement += `box1:${bundle.inputData.box1},`;
	if (bundle.inputData.box2) replacement += `box2:${bundle.inputData.box2},`;
	if (bundle.inputData.box3) replacement += `box3:${bundle.inputData.box3},`;
	if (bundle.inputData.box4) replacement += `box4:${bundle.inputData.box4},`;
	if (bundle.inputData.box5) replacement += `box5:${bundle.inputData.box5}`;
	replacement += ")";

	imagetobeTransformed = imagetobeTransformed.replace("original", replacement);

	testImageUrl = {
		url: imagetobeTransformed,
		method: "GET",
	};

	let retries = 5;

	async function getStatus() {
		retries -= 1;
		const response = await z.request(testImageUrl);

		try {
			statusCode = response.status;

			if (statusCode === 200) {
				return { url: imagetobeTransformed };
			}
			if (statusCode === 202) {
				setTimeout(() => {
					getStatus();
				}, 5000);
			} else throw reponse;
		} catch (error) {
			throw error;
		}
	}

	return getStatus();
};

module.exports = {
	key: "transform",
	noun: "transform",

	display: {
		label: "Remove Watermarks",
		description: "Transforms Image using Pixelbin.io",
	},

	operation: {
		perform,
		inputFields: [
			{
				key: "url",
				required: true,
				type: "string",
				label: "Image/url",
				helpText: "Image to be transformed.",
			},
			{
				key: "rem_text",
				label: "Remove Text",
				required: false,
				type: "boolean",
			},
			{
				key: "rem_logo",
				label: "Remove Logo",
				required: false,
				type: "boolean",
			},
			{
				key: "box1",
				label: "Box 1",
				required: false,
				type: "string",
				helpText:
					"(x-axis_y-axis_width_height) For full image use: 0_0_100_100.Values should be between 0 and 100.",
			},
			{
				key: "box2",
				label: "Box 2",
				required: false,
				type: "string",
				helpText:
					"(x-axis_y-axis_width_height) For full image use: 0_0_100_100.Values should be between 0 and 100.",
			},
			{
				key: "box3",
				label: "Box 3",
				required: false,
				type: "string",
				helpText:
					"(x-axis_y-axis_width_height) For full image use: 0_0_100_100.Values should be between 0 and 100.",
			},
			{
				key: "box4",
				label: "Box 4",
				required: false,
				type: "string",
				helpText:
					"(x-axis_y-axis_width_height) For full image use: 0_0_100_100.Values should be between 0 and 100.",
			},
			{
				key: "box5",
				label: "Box 5",
				required: false,
				type: "string",
				helpText:
					"(x-axis_y-axis_width_height) For full image use: 0_0_100_100.Values should be between 0 and 100.",
			},
		],
		sample: {
			url: "https://cdn.pixelbin.io/v2/muddy-lab-41820d/t.resize(w:128,h:128)/dummy_image.png",
		},
	},
};
