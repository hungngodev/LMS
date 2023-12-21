import { AssignmentMedia0Schema } from "@/models/cms/assignment-media-0";
import { injectCreatedByUpdatedByBeforeValidate } from "@/payload/utils/inject-created-by-updated-by-before-validate";
import { CollectionHooks } from "@/types";

export const hooks: CollectionHooks<AssignmentMedia0Schema> = {
	beforeValidate: [injectCreatedByUpdatedByBeforeValidate],
	afterChange: [
		async ({ doc, req, previousDoc, operation }) => {
			if (operation === "create") {
				await req.payload.update({
					collection: "assignmentsMedia",
					id: doc.id,
					data: {
						url: `api/assignmentsMedia/static/${doc.id}`
					}
				});
			}
		}
	]
};
