import { Submission0Schema } from "@/models/cms/submission-0";
import getPayloadClient from "@/payload/payload-client";
import { CollectionConfig } from "payload/types";
import { z } from "zod";

export const hooks: CollectionConfig["hooks"] = {
	beforeValidate: [
		async ({ data, req, operation, originalDoc }) => {
			if (!req) return data;
			if (operation === "create") {
				(data as any).grader = req.user.id;
			}
			return data;
		}
	],
	afterChange: [
		async ({ doc, req, previousDoc, operation }) => {
			const courseId =
				typeof doc.course === "string" ? doc.course : doc.course.id;
			const assignmentId =
				typeof doc.assignment === "string"
					? doc.assignment
					: doc.assignment.id;
			const submissionId =
				typeof doc.submission === "string"
					? doc.submission
					: doc.submission.id;
			const payload = await getPayloadClient();

			// populate properties of grades media
			if (operation === "create") {
				await Promise.all(
					doc.documents.map(async (document: any) => {
						const documentId =
							typeof document === "string"
								? document
								: document.id;
						await payload.update({
							collection: "gradesMedia",
							id: documentId,
							data: {
								grade: doc.id,
								assignment: assignmentId,
								submission: submissionId
							}
						});
					})
				);
			}
			if (operation === "update") {
				const newDocuments = z
					.array(z.string())
					.parse(
						doc.documents.map((document: any) =>
							typeof document === "string"
								? document
								: document.id
						)
					);
				const previousDocuments = z
					.array(z.string())
					.parse(
						previousDoc.documents.map((document: any) =>
							typeof document === "string"
								? document
								: document.id
						)
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
				await payload.delete({
					collection: "gradesMedia",
					where: { id: { in: removedMediaId.join(",") } }
				});
				await payload.update({
					collection: "gradesMedia",
					where: { id: { in: addedMediaId.join(",") } },
					data: {
						grade: doc.id,
						assignment: assignmentId,
						submission: submissionId
					}
				});
			}

			// populate properties of submissions
			const submission = Submission0Schema.parse(
				await payload.findByID({
					collection: "submissions",
					id: submissionId,
					depth: 0
				})
			);
			await payload.update({
				collection: "submissions",
				where: {
					and: [
						{ author: { equals: submission.createdBy } },
						{ assignment: { equals: assignmentId } },
						{ course: { equals: courseId } },
						{ id: { not_equals: submission.id } }
					]
				},
				data: { grade: "" }
			});
			await payload.update({
				collection: "submissions",
				id: submission.id,
				data: { grade: doc.id }
			});
			return doc;
		}
	],
	afterDelete: [
		async ({ req, id, doc }) => {
			const payload = await getPayloadClient();
			await payload.delete({
				collection: "gradesMedia",
				where: {
					id: {
						in: doc.documents.map((doc: any) =>
							typeof doc === "string" ? doc : doc.id
						)
					}
				}
			});
		}
	]
};
