import { Config } from "payload/generated-types";
import { z } from "zod";
export type Collection = keyof Config["collections"];
export const CollectionEnum: Record<Collection, Collection> = {
	assignments: "assignments",
	submissions: "submissions",
	grades: "grades",
	assignmentsMedia: "assignmentsMedia",
	users: "users",
	roles: "roles",
	actions: "actions",
	courses: "courses",
	submissionsMedia: "submissionsMedia",
	gradesMedia: "gradesMedia",
	locations: "locations",
	subjects: "subjects",
	sessions: "sessions",
	sessionsRecurrence: "sessionsRecurrence",
	views: "views"
} as const;
export const CollectionSchema = z.nativeEnum(CollectionEnum);
