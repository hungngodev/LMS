import { env } from "@/payload/env";
import * as aws from "@aws-sdk/client-ses";
import nodemailer from "nodemailer";

const ses = new aws.SES({
	apiVersion: "2010-12-01",
	region: env.SES_REGION,
	credentials: {
		accessKeyId: env.SES_ACCESS_KEY,
		secretAccessKey: env.SES_SECRET_ACCESS_KEY
	}
});

export const transport = nodemailer.createTransport({
	SES: { ses, aws }
});
