import { CollectionConfig } from "payload/types";
import { access } from "./grades-media-access";
import { fields } from "./grades-media-fields";
import { hooks } from "./grades-media-hooks";

export const gradesMediaConfig: CollectionConfig = {
	slug: "gradesMedia",
	upload: {
		disableLocalStorage: true,
		mimeTypes: ["image/*", "application/pdf"]
	},
	access,
	hooks,
	fields
};
