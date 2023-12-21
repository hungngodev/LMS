import { CollectionConfig } from "payload/types";

export const fields: CollectionConfig["fields"] = [
	{
		name: "title",
		type: "text",
		required: true
	},
	{
		name: "startDate",
		type: "date",
		required: true
	},
	{
		name: "endDate",
		type: "date",
		required: true
	},
	{
		name: "location",
		type: "relationship",
		relationTo: "locations",
		required: true,
		hasMany: false
	},
	{
		name: "subject",
		type: "relationship",
		relationTo: "subjects",
		required: true,
		hasMany: false
	},
	{
		name: "members",
		type: "relationship",
		relationTo: "users",
		hasMany: true
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
