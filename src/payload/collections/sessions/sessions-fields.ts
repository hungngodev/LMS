import { CollectionConfig } from "payload/types";

export const fields: CollectionConfig["fields"] = [
	{
		name: "course",
		type: "relationship",
		relationTo: "courses",
		hasMany: false,
		required: true
	},
	{
		name: "date",
		type: "date",
		required: true
	},
	{
		name: "title",
		type: "text",
		required: true
	},
	{
		name: "startTime",
		type: "date",
		required: true
	},
	{
		name: "endTime",
		type: "date",
		required: true
	},
	{
		name: "recurrenceId",
		type: "relationship",
		relationTo: "sessionsRecurrence"
	}
];
