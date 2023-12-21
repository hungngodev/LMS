import { CollectionConfig } from "payload/types";

export const hooks: CollectionConfig["hooks"] = {
	beforeValidate: [
		async ({ data, req, operation, originalDoc }) => {
			if (!req) return data;
			if (operation === "create") {
				(data as any).author = req.user.id;
			}
			return data;
		}
	],
	afterChange: [
		async ({ doc, req, previousDoc, operation }) => {
			if (operation === "create") {
				await req.payload.update({
					collection: "submissionsMedia",
					id: doc.id,
					data: {
						url: `api/submissionsMedia/static/${doc.id}`
					}
				});
			}
			return doc;
		}
	]
};
