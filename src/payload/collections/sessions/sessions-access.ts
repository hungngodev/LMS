import { Session0Schema } from "@/models/cms/session-0";
import { User2Schema } from "@/models/cms/user-2";
import { ActionEnum } from "@/payload/models/action-enum";
import { getUserAllowedActions } from "@/payload/utils/get-user-allowed-actions";
import { Access, CollectionConfig, Where } from "payload/types";

const canCreateSession: Access<Session0Schema, User2Schema> = ({
	req: { user }
}) => {
	if (!user) return false;
	const actions = getUserAllowedActions(user);
	if (actions.has(ActionEnum["sessions:create"])) return true;
	return false;
};

const canReadSession: Access<Session0Schema, User2Schema> = ({
	req: { user }
}) => {
	if (!user) return false;
	const actions = getUserAllowedActions(user);
	if (actions.has(ActionEnum["sessions:read"])) return true;
	const or: Where[] = [];
	if (actions.has(ActionEnum["sessions:read:member_only"]))
		or.push({ "course.members": { contains: user.id } });
	if (or.length === 0) return false;
	return { or };
};

const canUpdateSession: Access<Session0Schema, User2Schema> = ({
	req: { user }
}) => {
	if (!user) return false;
	const actions = getUserAllowedActions(user);
	if (actions.has(ActionEnum["sessions:update"])) return true;
	const or: Where[] = [];
	if (actions.has(ActionEnum["sessions:update:member_only"]))
		or.push({ "course.members": { contains: user.id } });
	if (or.length === 0) return false;
	return { or };
};

const canDeleteSession: Access<Session0Schema, User2Schema> = ({
	req: { user }
}) => {
	if (!user) return false;
	const actions = getUserAllowedActions(user);
	if (actions.has(ActionEnum["sessions:delete"])) return true;
	const or: Where[] = [];
	if (actions.has(ActionEnum["sessions:delete:member_only"]))
		or.push({ "course.members": { contains: user.id } });
	if (or.length === 0) return false;
	return { or };
};

export const access: CollectionConfig["access"] = {
	create: canCreateSession,
	read: canReadSession,
	update: canUpdateSession,
	delete: canDeleteSession
};
