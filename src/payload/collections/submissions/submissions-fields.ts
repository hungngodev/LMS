import { CollectionConfig } from "payload/types";

export const fields: CollectionConfig["fields"] = [
	{ name: "content", type: "text" },
	{
		name: "documents",
		type: "relationship",
		relationTo: "submissionsMedia",
		hasMany: true
	},
	{
		name: "grade",
		type: "relationship",
		relationTo: "grades",
		hasMany: false
	},
	{
		name: "assignment",
		type: "relationship",
		relationTo: "assignments",
		hasMany: false,
		required: true
	},
	{
		name: "course",
		type: "relationship",
		relationTo: "courses",
		hasMany: false,
		required: true
	},
	{
		name: "createdBy",
		type: "relationship",
		relationTo: "users",
		hasMany: false,
		required: true
	},
	{
		name: "updatedBy",
		type: "relationship",
		relationTo: "users",
		hasMany: false,
		required: true
	}
];
