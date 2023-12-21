import { CollectionConfig } from "payload/types";

export const fields: CollectionConfig["fields"] = [
	{
		name: "grader",
		type: "relationship",
		relationTo: "users",
		hasMany: false,
		required: true
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
		name: "submission",
		type: "relationship",
		relationTo: "submissions",
		hasMany: false,
		required: true
	},
	{
		name: "course",
		type: "relationship",
		relationTo: "courses",
		hasMany: false,
		required: true
	}
];
