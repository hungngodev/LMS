import { z } from "zod";
import { AssignmentMedia0Schema } from "./assignment-media-0";
import { Course0Schema } from "./course-0";
import { Grade0Schema } from "./grade-0";
import { Submission0Schema } from "./submission-0";
import { User0Schema } from "./user-0";

export const Assignment1Schema = z.object({
	id: z.string(),
	title: z.string(),
	dueAt: z.string(),
	content: z.string().optional(),
	documents: z.array(AssignmentMedia0Schema).optional(),
	submissions: z.array(Submission0Schema).optional(),
	grades: z.array(Grade0Schema).optional(),
	course: Course0Schema,
	createdBy: User0Schema,
	updatedBy: User0Schema,
	updatedAt: z.string(),
	createdAt: z.string(),
	_status: z.union([z.literal("draft"), z.literal("published")]).optional()
});

export type Assignment1Schema = z.infer<typeof Assignment1Schema>;
