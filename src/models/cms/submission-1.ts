import { z } from "zod";
import { Assignment0Schema } from "./assignment-0";
import { Course0Schema } from "./course-0";
import { Grade0Schema } from "./grade-0";
import { SubmissionMedia0Schema } from "./submission-media-0";
import { User0Schema } from "./user-0";

export const Submission1Schema = z.object({
	id: z.string(),
	content: z.string().optional(),
	documents: z.array(SubmissionMedia0Schema).optional(),
	grade: Grade0Schema.optional().nullable(),
	course: Course0Schema,
	assignment: Assignment0Schema,
	createdBy: User0Schema,
	updatedBy: User0Schema,
	updatedAt: z.string(),
	createdAt: z.string()
});

export type Submission1Schema = z.infer<typeof Submission1Schema>;
