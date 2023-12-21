import { z } from "zod";

export const Assignment0Schema = z.object({
	id: z.string(),
	title: z.string(),
	dueAt: z.string(),
	content: z.string().optional(),
	documents: z.array(z.string()).optional(),
	submissions: z.array(z.string()).optional(),
	grades: z.array(z.string()).optional(),
	course: z.string(),
	createdBy: z.string(),
	updatedBy: z.string(),
	updatedAt: z.string(),
	createdAt: z.string(),
	_status: z.union([z.literal("draft"), z.literal("published")]).optional()
});

export type Assignment0Schema = z.infer<typeof Assignment0Schema>;
