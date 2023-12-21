import { z } from "zod";

export const Grade0Schema = z.object({
	id: z.string(),
	grade: z.number(),
	content: z.string().optional(),
	documents: z.array(z.string()).optional(),
	assignment: z.string(),
	submission: z.string(),
	course: z.string(),
	grader: z.string(),
	updatedAt: z.string(),
	createdAt: z.string()
});

export type Grade0Schema = z.infer<typeof Grade0Schema>;
