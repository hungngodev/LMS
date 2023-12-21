import { Subject0Schema } from "@/models/cms/subject-0";
import { User2Schema } from "@/models/cms/user-2";
import { ActionEnum } from "@/payload/models/action-enum";
import { getUserAllowedActions } from "@/payload/utils/get-user-allowed-actions";
import { Access, CollectionConfig } from "payload/types";

const canCreateSubject: Access<Subject0Schema, User2Schema> = ({
	req: { user }
}) => {
	if (!user) return false;
	const actions = getUserAllowedActions(user);
	if (actions.has(ActionEnum["subjects:create"])) return true;
	return false;
};

const canReadSubject: Access<Subject0Schema, User2Schema> = ({
	req: { user }
}) => {
	if (!user) return false;
	const actions = getUserAllowedActions(user);
	if (actions.has(ActionEnum["subjects:read"])) return true;
	return false;
};

const canUpdateSubject: Access<Subject0Schema, User2Schema> = ({
	req: { user }
}) => {
	if (!user) return false;
	const actions = getUserAllowedActions(user);
	if (actions.has(ActionEnum["subjects:update"])) return true;
	return false;
};

const canDeleteSubject: Access<Subject0Schema, User2Schema> = ({
	req: { user }
}) => {
	if (!user) return false;
	const actions = getUserAllowedActions(user);
	if (actions.has(ActionEnum["subjects:delete"])) return true;
	return false;
};

export const access: CollectionConfig["access"] = {
	create: canCreateSubject,
	read: canReadSubject,
	update: canUpdateSubject,
	delete: canDeleteSubject
};
