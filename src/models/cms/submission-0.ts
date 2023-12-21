import { z } from "zod";

export const Submission0Schema = z.object({
	id: z.string(),
	content: z.string().optional(),
	documents: z.array(z.string()).optional(),
	grade: z.string().optional().nullable(),
	course: z.string(),
	assignment: z.string(),
	createdBy: z.string(),
	updatedBy: z.string(),
	updatedAt: z.string(),
	createdAt: z.string()
});

export type Submission0Schema = z.infer<typeof Submission0Schema>;
