import { CollectionConfig } from "payload/types";
import { access } from "./sessions-recurrence-access";
import { fields } from "./sessions-recurrence-fields";
import { hooks } from "./sessions-recurrence-hooks";

export const sessionsRecurrenceConfig: CollectionConfig = {
	slug: "sessionsRecurrence",
	timestamps: true,
	fields,
	access,
	hooks
};
