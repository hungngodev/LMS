import { env } from "@/payload/env";
import { s3Adapter } from "@payloadcms/plugin-cloud-storage/s3";

export const storageAdapter = s3Adapter({
	config: {
		forcePathStyle: true,
		region: env.S3_REGION,
		credentials: {
			accessKeyId: env.S3_ACCESS_KEY_ID,
			secretAccessKey: env.S3_SECRET_ACCESS_KEY
		},
		endpoint: env.S3_ENDPOINT
	},
	bucket: env.S3_BUCKET as string
});
