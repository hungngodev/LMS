import { CollectionConfig } from "payload/types";
import { hooks } from "./action-hooks";
import { access } from "./actions-access";
import { fields } from "./actions-fields";

export const actionConfig: CollectionConfig = {
	slug: "actions",
	timestamps: false,
	hooks,
	access,
	fields
};
