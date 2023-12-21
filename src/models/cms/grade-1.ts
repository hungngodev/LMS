import { z } from "zod";
import { Assignment0Schema } from "./assignment-0";
import { Course0Schema } from "./course-0";
import { Submission0Schema } from "./submission-0";
import { SubmissionMedia0Schema } from "./submission-media-0";
import { User0Schema } from "./user-0";

export const Grade1Schema = z.object({
	id: z.string(),
	grade: z.number(),
	content: z.string().optional(),
	documents: z.array(SubmissionMedia0Schema).optional(),
	assignment: Assignment0Schema,
	submission: Submission0Schema,
	course: Course0Schema,
	grader: User0Schema,
	updatedAt: z.string(),
	createdAt: z.string()
});

export type Grade1Schema = z.infer<typeof Grade1Schema>;
