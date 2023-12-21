import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

export const env = z
	.object({
		NODE_ENV: z
			.union([
				z.literal("development"),
				z.literal("staging"),
				z.literal("production")
			])
			.default("development"),
		MONGODB_URI: z.string(),
		PAYLOAD_SECRET: z.string(),
		INIT_ADMIN_EMAIL: z.string(),
		INIT_ADMIN_PASSWORD: z.string(),
		APP_URL: z.string(),
		SES_REGION: z.string(),
		SES_ACCESS_KEY: z.string(),
		SES_SECRET_ACCESS_KEY: z.string(),
		S3_REGION: z.string(),
		S3_ACCESS_KEY_ID: z.string(),
		S3_SECRET_ACCESS_KEY: z.string(),
		S3_ENDPOINT: z.string(),
		S3_BUCKET: z.string()
	})
	.parse(process.env);
