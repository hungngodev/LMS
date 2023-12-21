import { CollectionConfig } from "payload/types";

export const fields: CollectionConfig["fields"] = [
	{
		name: "name",
		type: "text",
		required: true,
		unique: true
	}
];
