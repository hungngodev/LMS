import { CollectionConfig } from "payload/types";
import { access } from "./roles-access";
import { fields } from "./roles-fields";
import { hooks } from "./roles-hooks";

export const rolesConfig: CollectionConfig = {
	slug: "roles",
	timestamps: false,
	hooks,
	access,
	fields
};
