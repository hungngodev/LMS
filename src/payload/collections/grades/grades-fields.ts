import { CollectionConfig } from "payload/types";

export const fields: CollectionConfig["fields"] = [
	{
		name: "grade",
		type: "number",
		required: true,
		max: 10,
		min: 0
	},
	{
		name: "content",
		type: "text"
	},
	{
		name: "documents",
		type: "relationship",
		relationTo: "gradesMedia",
		hasMany: true
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
	},
	{
		name: "grader",
		type: "relationship",
		relationTo: "users",
		hasMany: false,
		required: true
	}
];
