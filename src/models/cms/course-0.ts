import { z } from "zod";

export const Course0Schema = z.object({
	id: z.string(),
	title: z.string(),
	startDate: z.string(),
	endDate: z.string(),
	location: z.string(),
	subject: z.string(),
	members: z.array(z.string()).optional(),
	createdBy: z.string(),
	updatedBy: z.string(),
	updatedAt: z.string(),
	createdAt: z.string(),
	_status: z.union([z.literal("draft"), z.literal("published")]).optional()
});

export type Course0Schema = z.infer<typeof Course0Schema>;
