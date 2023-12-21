import { z } from "zod";

export const GradeMedia0Schema = z.object({
	id: z.string(),
	grader: z.string(),
	course: z.string(),
	prefix: z.string(),
	filename: z.string(),
	mimeType: z.string(),
	filesize: z.number(),
	url: z.string(),
	assignment: z.string().optional(),
	submission: z.string(),
	grade: z.string().optional(),
	updatedAt: z.string(),
	createdAt: z.string(),
	_status: z.union([z.literal("draft"), z.literal("published")]).optional()
});

export type GradeMedia0Schema = z.infer<typeof GradeMedia0Schema>;
