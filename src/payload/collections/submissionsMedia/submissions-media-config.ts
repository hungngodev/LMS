import type { CollectionConfig } from "payload/types";
import { access } from "./submissions-media-access";
import { fields } from "./submissions-media-fields";
import { hooks } from "./submissions-media-hooks";

export const submissionsMediaConfig: CollectionConfig = {
	slug: "submissionsMedia",
	timestamps: true,
	upload: {
		disableLocalStorage: true,
		mimeTypes: ["image/*", "application/pdf"]
	},
	fields,
	access,
	hooks
};
