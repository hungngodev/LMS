import { CollectionConfig } from "payload/types";

export const fields: CollectionConfig["fields"] = [
	{
		name: "name",
		type: "text",
		required: true,
		unique: true
	},
	{
		name: "iamName",
		type: "text",
		required: true,
		unique: true
	},
	{
		name: "views",
		type: "relationship",
		relationTo: "views",
		hasMany: true,
		saveToJWT: true
	},
	{
		name: "actions",
		type: "relationship",
		relationTo: "actions",
		hasMany: true,
		saveToJWT: true
	}
];
