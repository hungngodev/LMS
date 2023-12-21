import { CollectionConfig } from "payload/types";
import { access } from "./submissions-access";
import { fields } from "./submissions-fields";
import { hooks } from "./submissions-hooks";

export const submissionsConfig: CollectionConfig = {
	slug: "submissions",
	timestamps: true,
	access,
	hooks,
	fields
};
