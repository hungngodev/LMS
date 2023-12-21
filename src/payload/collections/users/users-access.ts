import { Role0Schema } from "@/models/cms/role-0";
import { User0Schema } from "@/models/cms/user-0";
import { User1Schema } from "@/models/cms/user-1";
import { User2Schema } from "@/models/cms/user-2";
import { ActionEnum } from "@/payload/models/action-enum";
import { getUserAllowedActions } from "@/payload/utils/get-user-allowed-actions";
import { Access, CollectionConfig, Where } from "payload/types";

const canCreateUser: Access<User0Schema, User2Schema> = async ({
	req: { user, payload },
	data
}) => {
	/**
	 * A creator can create another user if and only if
	 * the user they create have role1, role2, and the creator have users:create
	 * [role1] and users:create[role2] in their allowed actions
	 */
	if (!user || !data) return false;
	const userAllowedActions = getUserAllowedActions(user);
	if (userAllowedActions.has(ActionEnum["users:create"])) return true;
	const newUserRoles = await Promise.all(
		data.roles.map(async (roleId) =>
			Role0Schema.parse(
				await payload.findByID({
					collection: "roles",
					id: roleId,
					depth: 0
				})
			)
		)
	);
	const requiredActions = newUserRoles.map(
		(role) => `users:create:${role.iamName}`
	);
	return requiredActions.every((action) => userAllowedActions.has(action));
};

const canReadUser: Access<User0Schema, User2Schema> = ({ req: { user } }) => {
	/**
	 * A reader can read another user if and only if
	 *
	 * the user is reading themself
	 * or
	 * the user they read have role1 and role2, and the creator have users:read:
	 * [role1] and users:read:[role2] in their allowed actions
	 */
	if (!user) return false;
	const userAllowedActions = getUserAllowedActions(user);
	if (userAllowedActions.has(ActionEnum["users:read"])) return true;
	const actions = Array.from(userAllowedActions);
	const usersAllowedToReadIamRoles = actions.reduce<string[]>(
		(roles, action) => {
			if (action.startsWith("users:read:"))
				roles.push(action.substring("users:read:".length));
			return roles;
		},
		[]
	);
	return {
		or: [
			{ "roles.iamName": { in: usersAllowedToReadIamRoles.join(",") } },
			{
				and: [
					{ id: { equals: user.id } },
					{
						"roles.actions.name": {
							contains: ActionEnum["users:read:self"]
						}
					}
				]
			}
		]
	} as Where;
};

const canUpdateUser: Access<User0Schema, User2Schema> = async ({
	req: { user, payload },
	data,
	id
}) => {
	/**
	 * An updater can update another user if and only if
	 *
	 * the user is updating themself
	 * or
	 * the user they update have role1, role2, and the updater have
	 * users:update:[role1] and users:update:[role2] in their allowed actions
	 */
	if (!user || !data || !id) return false;
	const userAllowedActions = getUserAllowedActions(user);
	if (userAllowedActions.has(ActionEnum["users:update"])) return true;
	const inititalUser = User1Schema.parse(
		await payload.findByID({
			collection: "users",
			id,
			depth: 1
		})
	);
	if (inititalUser.id === user.id)
		return userAllowedActions.has(ActionEnum["users:update:self"]);
	const requiredActions = inititalUser.roles.map(
		(role) => `users:update:${role.iamName}`
	);
	return requiredActions.every((action) => userAllowedActions.has(action));
};

const canDeleteUser: Access<User0Schema, User2Schema> = async ({
	req: { user, payload },
	id
}) => {
	/**
	 * A deleter can delete another user if and only if
	 *
	 * the user is deleting themself
	 * or
	 * the user they delete have role1, role2, and the deleter have
	 * users:delete:[role1] and users:delete:[role2] in their allowed actions
	 */
	if (!user || !id) return false;
	const userAllowedActions = getUserAllowedActions(user);
	if (userAllowedActions.has(ActionEnum["users:delete"])) return true;
	const inititalUser = User1Schema.parse(
		await payload.findByID({
			collection: "users",
			id,
			depth: 1
		})
	);
	if (inititalUser.id === user.id)
		return userAllowedActions.has(ActionEnum["users:delete:self"]);
	const actions = Array.from(userAllowedActions);
	const usersAllowedToDeleteIamRoles = actions.reduce<string[]>(
		(roles, action) => {
			if (action.startsWith("users:update:"))
				roles.push(action.substring("users:update:".length));
			return roles;
		},
		[]
	);
	return {
		"roles.iamName": { in: usersAllowedToDeleteIamRoles.join(",") }
	} as Where;
};

export const access: CollectionConfig["access"] = {
	create: canCreateUser,
	read: canReadUser,
	update: canUpdateUser,
	delete: canDeleteUser
};
