import { Assignment0Schema } from "@/models/cms/assignment-0";
import { getAddedAndRemovedIds } from "@/payload/utils/get-added-and-removed-ids";
import { injectCreatedByUpdatedByBeforeValidate } from "@/payload/utils/inject-created-by-updated-by-before-validate";
import { CollectionHooks } from "@/types";

export const assignmentHooks: CollectionHooks<Assignment0Schema> = {
	beforeValidate: [injectCreatedByUpdatedByBeforeValidate],
	afterChange: [
		async ({
			doc, // full document data
			req, // full express request
			previousDoc, // document data before updating the collection
			operation // name of the operation ie. 'create', 'update'
		}) => {
			if (operation === "create") {
				if (!doc.documents) return;
				await Promise.all(
					doc.documents.map(async (document) => {
						await req.payload.update({
							collection: "assignmentsMedia",
							id: document,
							data: { assignment: doc.id }
						});
					})
				);
			}
			if (operation === "update") {
				const { addedIds, removedIds } = getAddedAndRemovedIds(
					previousDoc.documents ?? [],
					doc.documents ?? []
				);
				await req.payload.delete({
					collection: "assignmentsMedia",
					where: { id: { in: removedIds.join(",") } }
				});
				await req.payload.update({
					collection: "assignmentsMedia",
					where: { id: { in: addedIds.join(",") } },
					data: { assignment: doc.id }
				});
			}
		}
	],
	afterDelete: [
		async ({
			req, // full express request
			id, // id of document to delete
			doc // deleted document
		}) => {
			if (!doc.documents) return;
			await req.payload.delete({
				collection: "assignmentsMedia",
				where: { id: { in: doc.documents.join(",") } }
			});
		}
	]
};
