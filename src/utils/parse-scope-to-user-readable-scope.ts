import { Role0Schema } from "@/models/cms/role-0";

/**
 * return parsed user readable scope
 * @param scope string that will be attempted to parse into role name
 * @param allRoles list of all roles to check against
 * @returns role name if input iam name exist in allRoles,
 * else return as is input iam name
 */
export const parseScopeToUserReadableScope = (
	iamName: string,
	allRoles: Role0Schema[]
): string => {
	const parseUserRole = () =>
		allRoles.find((role) => role.iamName === iamName)?.name;
	const removeUnderscore = (text: string) => text.replace(/_/g, " ");
	return removeUnderscore(parseUserRole() ?? iamName);
};
