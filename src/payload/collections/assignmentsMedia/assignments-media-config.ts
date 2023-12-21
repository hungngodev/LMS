import { CollectionConfig } from "payload/types";
import { access } from "./assignments-media-access";
import { fields } from "./assignments-media-fields";
import { hooks } from "./assignments-media-hooks";

export const assignmentsMediaConfig: CollectionConfig = {
	slug: "assignmentsMedia",
	timestamps: true,
	upload: {
		disableLocalStorage: true,
		mimeTypes: ["image/*", "application/pdf"]
	},
	fields,
	access,
	hooks
};
