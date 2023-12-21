import { z } from "zod";

export const Session0Schema = z.object({
	id: z.string(),
	course: z.string(),
	title: z.string(),
	date: z.string(),
	startTime: z.string(),
	endTime: z.string(),
	recurrenceId: z.string().optional(),
	createdAt: z.string(),
	updatedAt: z.string()
});

export type Session0Schema = z.infer<typeof Session0Schema>;
