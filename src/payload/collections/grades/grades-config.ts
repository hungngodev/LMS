import { CollectionConfig } from "payload/types";
import { access } from "./grades-access";
import { fields } from "./grades-fields";
import { hooks } from "./grades-hooks";

export const gradesConfig: CollectionConfig = {
	slug: "grades",
	timestamps: true,
	access,
	fields,
	hooks
};
