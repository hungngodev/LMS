import { z } from "zod";

export const AssignmentMedia0Schema = z.object({
	id: z.string(),
	course: z.string(),
	prefix: z.string(),
	filename: z.string(),
	mimeType: z.string(),
	filesize: z.number(),
	url: z.string(),
	assignment: z.string().optional(),
	createdBy: z.string(),
	updatedBy: z.string(),
	updatedAt: z.string(),
	createdAt: z.string(),
	_status: z.union([z.literal("draft"), z.literal("published")]).optional()
});

export type AssignmentMedia0Schema = z.infer<typeof AssignmentMedia0Schema>;
