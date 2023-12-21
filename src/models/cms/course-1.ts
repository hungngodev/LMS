import { Location0Schema } from "@/models/cms/location-0";
import { Session0Schema } from "@/models/cms/session-0";
import { Subject0Schema } from "@/models/cms/subject-0";
import { User0Schema } from "@/models/cms/user-0";
import { z } from "zod";

export const Course1Schema = z.object({
	id: z.string(),
	title: z.string(),
	startDate: z.string(),
	endDate: z.string(),
	sessions: z.array(Session0Schema).optional(),
	location: Location0Schema,
	subject: Subject0Schema,
	members: z.array(User0Schema).optional(),
	createdBy: User0Schema,
	updatedBy: User0Schema,
	updatedAt: z.string(),
	createdAt: z.string(),
	_status: z.union([z.literal("draft"), z.literal("published")]).optional()
});

export type Course1Schema = z.infer<typeof Course1Schema>;
