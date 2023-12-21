import { encode } from "punycode";

export const encodeIamName = (name: string): string => {
	const encodedName = name.toLowerCase().replace(/\s+/g, "_");
	const iamName = encodedName
		.replace(/_+/g, "_")
		.replace(
			/[^\x00-\x7F]/g,
			(char) => `_${encode(char).replace(/-/g, "_")}`
		)
		.trim();
	return iamName;
};
