import { CollectionConfig } from "payload/types";
import { access } from "./courses-access";
import { fields } from "./courses-fields";
import { hooks } from "./courses-hooks";

export const coursesConfig: CollectionConfig = {
	slug: "courses",
	timestamps: true,
	versions: { drafts: { autosave: true } },
	access,
	hooks,
	fields
};
