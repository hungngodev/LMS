import { Assignment0Schema } from "@/models/cms/assignment-0";
import { Submission0Schema } from "@/models/cms/submission-0";
import { injectCreatedByUpdatedByBeforeValidate } from "@/payload/utils/inject-created-by-updated-by-before-validate";
import { CollectionHooks } from "@/types";
import { z } from "zod";

export const hooks: CollectionHooks<Submission0Schema> = {
	beforeValidate: [injectCreatedByUpdatedByBeforeValidate],
	afterChange: [
		async ({
			doc, // full document data
			req, // full express request
			previousDoc, // document data before updating the collection
			operation // name of the operation ie. 'create', 'update'
		}) => {
			const assignmentId = doc.assignment;
			if (operation === "create") {
				await Promise.all(
					doc.documents?.map(async (documentId) => {
						await req.payload.update({
							collection: "submissionsMedia",
							id: documentId,
							data: {
								submission: doc.id,
								assignment: assignmentId
							}
						});
					}) ?? []
				);
				const currentAssignment = Assignment0Schema.parse(
					await req.payload.findByID({
						collection: "assignments",
						id: assignmentId,
						depth: 0
					})
				);
				const currentSubmissions = currentAssignment.submissions ?? [];
				await req.payload.update({
					collection: "assignments",
					id: assignmentId,
					data: {
						submissions: [...currentSubmissions, doc.id]
					}
				});
			}

			if (operation === "update") {
				const newDocuments = z
					.array(z.string())
					.parse(
						doc.documents?.map((document: any) =>
							typeof document === "string"
								? document
								: document.id
						) ?? []
					);
				const previousDocuments = z
					.array(z.string())
					.parse(
						previousDoc.documents?.map((document: any) =>
							typeof document === "string"
								? document
								: document.id
						) ?? []
					);
				const removedMediaId: string[] = [];
				const addedMediaId: string[] = [];
				newDocuments.forEach((id) => {
					if (!previousDocuments.includes(id)) {
						addedMediaId.push(id);
					}
				});
				previousDocuments.forEach((id) => {
					if (!newDocuments.includes(id)) {
						removedMediaId.push(id);
					}
				});
				await req.payload.delete({
					collection: "submissionsMedia",
					where: { id: { in: removedMediaId.join(",") } }
				});
				await req.payload.update({
					collection: "submissionsMedia",
					where: { id: { in: addedMediaId.join(",") } },
					data: {
						submission: doc.id,
						assignment: assignmentId
					}
				});
			}
			return doc;
		}
	],
	afterDelete: [
		async ({ req, id, doc }) => {
			await req.payload.delete({
				collection: "submissionsMedia",
				where: { id: { in: doc.documents?.join(",") ?? "" } }
			});
		}
	]
};
