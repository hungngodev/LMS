import { CollectionConfig } from "payload/types";

export const fields: CollectionConfig["fields"] = [
	{
		name: "createdBy",
		type: "relationship",
		relationTo: "users",
		maxDepth: 0,
		required: true
	},
	{
		name: "updatedBy",
		type: "relationship",
		relationTo: "users",
		maxDepth: 0,
		required: true
	},
	{
		name: "assignment",
		type: "relationship",
		relationTo: "assignments",
		hasMany: false
	},
	{
		name: "course",
		type: "relationship",
		relationTo: "courses",
		hasMany: false,
		required: true
	}
];
