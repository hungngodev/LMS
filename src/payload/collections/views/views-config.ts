import { CollectionConfig } from "payload/types";
import { access } from "./views-access";
import { fields } from "./views-fields";
import { hooks } from "./views-hooks";

export const viewsConfig: CollectionConfig = {
	slug: "views",
	timestamps: false,
	hooks,
	access,
	fields
};
