import { CollectionConfig } from "payload/types";
import { access } from "./subjects-access";
import { fields } from "./subjects-fields";

export const subjectsConfig: CollectionConfig = {
	slug: "subjects",
	timestamps: true,
	fields,
	access
};
