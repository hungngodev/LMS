import { z } from "zod";

export const SubmissionMedia0Schema = z.object({
	id: z.string(),
	author: z.string(),
	course: z.string(),
	prefix: z.string(),
	filename: z.string(),
	mimeType: z.string(),
	filesize: z.number(),
	url: z.string(),
	assignment: z.string().optional(),
	submission: z.string().optional(),
	updatedAt: z.string(),
	createdAt: z.string(),
	_status: z.union([z.literal("draft"), z.literal("published")]).optional()
});

export type SubmissionMedia0Schema = z.infer<typeof SubmissionMedia0Schema>;
