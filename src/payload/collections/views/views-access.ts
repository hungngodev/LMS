import { User2Schema } from "@/models/cms/user-2";
import { View0Schema } from "@/models/cms/view-0";
import { ActionEnum } from "@/payload/models/action-enum";
import { getUserAllowedActions } from "@/payload/utils/get-user-allowed-actions";
import { Access, CollectionConfig } from "payload/types";

const canCreateView: Access<View0Schema, User2Schema> = async ({
	req: { user },
	data
}) => {
	if (!user || !data) return false;
	const actions = getUserAllowedActions(user);
	if (actions.has(ActionEnum["views:create"])) return true;
	return false;
};

const canReadView: Access<View0Schema, User2Schema> = ({ req: { user } }) => {
	return !!user;
};

const canUpdateView: Access<View0Schema, User2Schema> = ({ req: { user } }) => {
	if (!user) return false;
	const actions = getUserAllowedActions(user);
	if (actions.has(ActionEnum["views:update"])) return true;
	return false;
};

const canDeleteView: Access<View0Schema, User2Schema> = ({ req: { user } }) => {
	if (!user) return false;
	const actions = getUserAllowedActions(user);
	if (actions.has(ActionEnum["views:delete"])) return true;
	return false;
};

export const access: CollectionConfig["access"] = {
	create: canCreateView,
	read: canReadView,
	update: canUpdateView,
	delete: canDeleteView
};
