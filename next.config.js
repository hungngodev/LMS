const path = require("path");
const { withPayload } = require("@payloadcms/next-payload");

/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "cdn.leonardo.ai",
				port: "",
				pathname:
					"/users/ff3b8a94-d4d5-4d40-b6a6-07261a0346e5/generations/**"
			},
			{
				protocol: "https",
				hostname: "tailwindui.com",
				port: "",
				pathname: "/img/logos/**"
			}
		]
	}
};

const authConfig = {
	// Point to your Payload config (Required)
	configPath: path.resolve(__dirname, "./src/payload/payload-config.ts"),

	// Point to your exported, initialized Payload instance (optional, default shown below`)
	payloadPath: path.resolve(process.cwd(), "./src/payload/payload-client.ts")
};

module.exports = withPayload(nextConfig, authConfig);
