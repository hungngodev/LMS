import { SessionRecurrence0Schema } from "@/models/cms/session-recurrence-0";
import getPayloadClient from "@/payload/payload-client";
import { SessionsRecurrence } from "@/types";
import { generateSessionDate } from "@/utils/generate-session-dates";
import {
	CollectionAfterChangeHook,
	CollectionConfig,
	PayloadRequest
} from "payload/types";

const populateSessions: CollectionAfterChangeHook = async ({
	doc, // full document data
	req, // full express request
	previousDoc, // document data before updating the collection
	operation // name of the operation ie. 'create', 'update'
}: {
	doc: SessionsRecurrence;
	req: PayloadRequest;
	previousDoc: SessionsRecurrence;
	operation: "create" | "update";
}) => {
	const courseId =
		typeof doc.course === "string" ? doc.course : doc.course.id;
	const sessionRecurrence = SessionRecurrence0Schema.parse({
		...doc,
		course: courseId
	});
	const payload = await getPayloadClient();
	if (operation === "create") {
		const sessionDates = generateSessionDate(sessionRecurrence);
		for (let i = 0; i < sessionDates.length; i++) {
			const sessionDate = sessionDates[i];
			await payload.create({
				collection: "sessions",
				data: {
					course: sessionRecurrence.course,
					date: sessionDate.toISOString(),
					title: sessionRecurrence.title,
					startTime: sessionRecurrence.startTime,
					endTime: sessionRecurrence.endTime,
					recurrenceId: sessionRecurrence.id
				}
			});
		}
	}
	if (operation === "update") {
		await payload.delete({
			collection: "sessions",
			where: {
				recurrenceId: { equals: sessionRecurrence.id },
				date: { greater_than_equal: sessionRecurrence.date }
			}
		});
		const sessionDates = generateSessionDate(sessionRecurrence);
		for (let i = 0; i < sessionDates.length; i++) {
			const sessionDate = sessionDates[i];
			await payload.create({
				collection: "sessions",
				data: {
					course: sessionRecurrence.course,
					date: sessionDate.toISOString(),
					title: sessionRecurrence.title,
					startTime: sessionRecurrence.startTime,
					endTime: sessionRecurrence.endTime,
					recurrenceId: sessionRecurrence.id
				}
			});
		}
	}
	return doc;
};

export const hooks: CollectionConfig["hooks"] = {
	afterChange: [populateSessions]
};
