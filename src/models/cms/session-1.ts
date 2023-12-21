import { z } from "zod";
import { Course0Schema } from "./course-0";
import { SessionRecurrence0Schema } from "./session-recurrence-0";

export const Session1Schema = z.object({
	id: z.string(),
	course: Course0Schema,
	title: z.string(),
	date: z.string(),
	startTime: z.string(),
	endTime: z.string(),
	isRecurrence: z.boolean().optional(),
	recurrenceId: SessionRecurrence0Schema.optional(),
	createdAt: z.string(),
	updatedAt: z.string()
});

export type Session1Schema = z.infer<typeof Session1Schema>;
