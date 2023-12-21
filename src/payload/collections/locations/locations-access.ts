import { Location0Schema } from "@/models/cms/location-0";
import { User2Schema } from "@/models/cms/user-2";
import { ActionEnum } from "@/payload/models/action-enum";
import { getUserAllowedActions } from "@/payload/utils/get-user-allowed-actions";
import { Access, CollectionConfig } from "payload/types";

const canCreateLocation: Access<Location0Schema, User2Schema> = ({
	req: { user }
}) => {
	if (!user) return false;
	const actions = getUserAllowedActions(user);
	if (actions.has(ActionEnum["locations:create"])) return true;
	return false;
};

const canReadLocation: Access<Location0Schema, User2Schema> = ({
	req: { user }
}) => {
	if (!user) return false;
	const actions = getUserAllowedActions(user);
	if (actions.has(ActionEnum["locations:read"])) return true;
	return false;
};

const canUpdateLocation: Access<Location0Schema, User2Schema> = ({
	req: { user }
}) => {
	if (!user) return false;
	const actions = getUserAllowedActions(user);
	if (actions.has(ActionEnum["locations:update"])) return true;
	return false;
};

const canDeleteLocation: Access<Location0Schema, User2Schema> = ({
	req: { user }
}) => {
	if (!user) return false;
	const actions = getUserAllowedActions(user);
	if (actions.has(ActionEnum["locations:delete"])) return true;
	return false;
};

export const access: CollectionConfig["access"] = {
	create: canCreateLocation,
	read: canReadLocation,
	update: canUpdateLocation,
	delete: canDeleteLocation
};
