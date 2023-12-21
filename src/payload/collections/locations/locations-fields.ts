import { CollectionConfig } from "payload/types";

export const fields: CollectionConfig["fields"] = [
	{
		name: "name",
		type: "text",
		unique: true,
		required: true
	}
];
