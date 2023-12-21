import { CollectionConfig } from "payload/types";
import { access } from "./assignments-access";
import { fields } from "./assignments-fields";
import { assignmentHooks } from "./assignments-hooks";

export const assignmentConfig: CollectionConfig = {
	slug: "assignments",
	timestamps: true,
	versions: { drafts: { autosave: true } },
	access,
	hooks: assignmentHooks,
	fields
};
