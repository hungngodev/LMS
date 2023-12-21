import { Role0Schema } from "@/models/cms/role-0";
import { User2Schema } from "@/models/cms/user-2";
import { ActionEnum } from "@/payload/models/action-enum";
import { getUserAllowedActions } from "@/payload/utils/get-user-allowed-actions";
import { Access, CollectionConfig } from "payload/types";

const canCreateRole: Access<Role0Schema, User2Schema> = async ({
	req: { user },
	data
}) => {
	if (!user || !data) return false;
	const actions = getUserAllowedActions(user);
	if (actions.has(ActionEnum["roles:create"])) return true;
	return false;
};

const canReadRole: Access<Role0Schema, User2Schema> = ({ req: { user } }) => {
	return !!user;
};

const canUpdateRole: Access<Role0Schema, User2Schema> = async ({
	req: { user }
}) => {
	if (!user) return false;
	const actions = getUserAllowedActions(user);
	if (actions.has(ActionEnum["roles:update"])) return true;
	return false;
};

const canDeleteRole: Access<Role0Schema, User2Schema> = async ({
	req: { user }
}) => {
	if (!user) return false;
	const actions = getUserAllowedActions(user);
	if (actions.has(ActionEnum["roles:delete"])) return true;
	return false;
};

export const access: CollectionConfig["access"] = {
	create: canCreateRole,
	read: canReadRole,
	update: canUpdateRole,
	delete: canDeleteRole
};
