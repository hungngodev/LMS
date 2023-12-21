import { Action0Schema } from "@/models/cms/action-0";
import { User2Schema } from "@/models/cms/user-2";
import { ActionEnum } from "@/payload/models/action-enum";
import { getUserAllowedActions } from "@/payload/utils/get-user-allowed-actions";
import { Access, CollectionConfig } from "payload/types";

const canCreateAction: Access<Action0Schema, User2Schema> = async ({
	req: { user },
	data
}) => {
	if (!user || !data) return false;
	const actions = getUserAllowedActions(user);
	if (actions.has(ActionEnum["actions:create"])) return true;
	return false;
};

const canReadAction: Access<Action0Schema, User2Schema> = ({
	req: { user }
}) => {
	return !!user;
};

const canUpdateAction: Access<Action0Schema, User2Schema> = ({
	req: { user }
}) => {
	if (!user) return false;
	const actions = getUserAllowedActions(user);
	if (actions.has(ActionEnum["actions:update"])) return true;
	return false;
};

const canDeleteAction: Access<Action0Schema, User2Schema> = ({
	req: { user }
}) => {
	if (!user) return false;
	const actions = getUserAllowedActions(user);
	if (actions.has(ActionEnum["actions:delete"])) return true;
	return false;
};

export const access: CollectionConfig["access"] = {
	create: canCreateAction,
	read: canReadAction,
	update: canUpdateAction,
	delete: canDeleteAction
};
