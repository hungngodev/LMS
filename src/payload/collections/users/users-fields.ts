import { CollectionConfig } from "payload/types";

export const fields: CollectionConfig["fields"] = [
	{
		name: "fullName",
		type: "text",
		required: true
	},
	{
		name: "roles",
		type: "relationship",
		relationTo: "roles",
		required: true,
		hasMany: true,
		saveToJWT: true
	}
];
