import { CollectionConfig } from "payload/types";

export const fields: CollectionConfig["fields"] = [
	{
		name: "submission",
		type: "relationship",
		relationTo: "submissions",
		hasMany: false
	},
	{
		name: "author",
		type: "relationship",
		relationTo: "users"
	},
	{
		name: "course",
		type: "relationship",
		relationTo: "courses",
		hasMany: false,
		required: true
	},
	{
		name: "assignment",
		type: "relationship",
		relationTo: "assignments",
		hasMany: false,
		required: true
	}
];
