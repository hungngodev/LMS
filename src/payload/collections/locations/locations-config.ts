import { CollectionConfig } from "payload/types";
import { access } from "./locations-access";
import { fields } from "./locations-fields";

export const locationsConfig: CollectionConfig = {
	slug: "locations",
	timestamps: true,
	fields,
	access
};
