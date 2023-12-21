import { CollectionConfig } from "payload/types";

export const fields: CollectionConfig["fields"] = [
	{
		name: "title",
		type: "text",
		required: true
	},
	{
		name: "dueAt",
		type: "date",
		required: true
	},
	{
		name: "content",
		type: "text"
	},
	{
		name: "documents",
		type: "relationship",
		relationTo: "assignmentsMedia",
		hasMany: true
	},
	{
		name: "submissions",
		type: "relationship",
		relationTo: "submissions",
		hasMany: true
	},
	{
		name: "grades",
		type: "relationship",
		relationTo: "grades",
		hasMany: true
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
		required: true,
		hasMany: false
	},
	{
		name: "updatedBy",
		type: "relationship",
		relationTo: "users",
		required: true,
		hasMany: false
	}
];
