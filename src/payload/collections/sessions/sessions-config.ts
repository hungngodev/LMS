import { CollectionConfig } from "payload/types";
import { access } from "./sessions-access";
import { admin } from "./sessions-admin";
import { fields } from "./sessions-fields";
import { hooks } from "./sessions-hooks";

export const sessionsConfig: CollectionConfig = {
	slug: "sessions",
	timestamps: true,
	admin,
	fields,
	access,
	hooks
};
