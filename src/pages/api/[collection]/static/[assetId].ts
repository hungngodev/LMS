import authenticate from "@/middlewares/authenticate";
import convertPayloadJSONBody from "@/middlewares/convertPayloadJSONBody";
import withDataLoader from "@/middlewares/dataLoader";
import withFileUpload from "@/middlewares/fileUpload";
import i18n from "@/middlewares/i18n";
import initializePassport from "@/middlewares/initPassport";
import withPayload from "@/middlewares/withPayload";
import { CollectionSchema } from "@/models/cms/collections";
import { env } from "@/payload/env";
import AWS from "aws-sdk";
import { Response } from "express";
import { PayloadRequest } from "payload/types";
import { z } from "zod";

export const config = {
	api: {
		bodyParser: false,
		externalResolver: true
	}
};

const handler = async (req: PayloadRequest, res: Response) => {
	try {
		// parse query params
		const { collection, assetId } = z
			.object({
				collection: CollectionSchema,
				assetId: z.string()
			})
			.parse(req.query);
		const doc = await req.payload.findByID({
			req,
			collection,
			id: assetId,
			overrideAccess: false
		});
		const { prefix, filename } = z
			.object({ prefix: z.string().default(""), filename: z.string() })
			.parse(doc);
		const s3 = new AWS.S3({
			credentials: {
				accessKeyId: env.S3_ACCESS_KEY_ID,
				secretAccessKey: env.S3_SECRET_ACCESS_KEY
			},
			endpoint: env.S3_ENDPOINT,
			region: env.S3_REGION
		});

		s3.getObject({
			Bucket: env.S3_BUCKET,
			Key: `${prefix}/${filename}`
		})
			.createReadStream()
			.on("data", (object) => {
				if (object.AcceptRanges)
					res.setHeader("Accept-Ranges", object.AcceptRanges);
				if (object.ContentLength)
					res.setHeader("Content-Length", object.ContentLength);
				if (object.ContentType)
					res.setHeader("Content-Type", object.ContentType);
				if (object.ETag) res.setHeader("ETag", object.ETag);
			})
			.pipe(res);
	} catch (err: any) {
		if ("status" in err) {
			if (err.status === 404) return res.status(404).send("Not Found");
			if (err.status === 403) return res.status(403).send("Forbidden");
		}
		console.error(err);
		return res.status(500).send("Error");
	}
};

export default withPayload(
	withDataLoader(
		withFileUpload(
			convertPayloadJSONBody(
				i18n(initializePassport(authenticate(handler)))
			)
		)
	)
);
