import { Course0Schema } from "@/models/cms/course-0";
import { User2Schema } from "@/models/cms/user-2";
import { ActionEnum } from "@/payload/models/action-enum";
import { getUserAllowedActions } from "@/payload/utils/get-user-allowed-actions";
import { Access, CollectionConfig, Where } from "payload/types";

const canCreateCourse: Access<Course0Schema, User2Schema> = ({
	req: { user }
}) => {
	if (!user) return false;
	const actions = getUserAllowedActions(user);
	if (actions.has(ActionEnum["courses:create"])) return true;
	return false;
};

const canReadCourse: Access<Course0Schema, User2Schema> = ({
	req: { user }
}) => {
	if (!user) return false;
	const actions = getUserAllowedActions(user);
	if (actions.has(ActionEnum["courses:read"])) return true;
	const or: Where[] = [];
	if (actions.has(ActionEnum["courses:read:member_only"]))
		or.push({ members: { contains: user.id } });
	if (actions.has(ActionEnum["courses:read:creator_only"]))
		or.push({ createdBy: { equals: user.id } });
	if (or.length === 0) return false;
	return { or };
};

const canUpdateCourse: Access<Course0Schema, User2Schema> = ({
	req: { user }
}) => {
	if (!user) return false;
	const actions = getUserAllowedActions(user);
	if (actions.has(ActionEnum["courses:update"])) return true;
	const or: Where[] = [];
	if (actions.has(ActionEnum["courses:update:member_only"]))
		or.push({ members: { contains: user.id } });
	if (actions.has(ActionEnum["courses:update:creator_only"]))
		or.push({ createdBy: { equals: user.id } });
	if (or.length === 0) return false;
	return { or };
};

const canDeleteCourse: Access<Course0Schema, User2Schema> = ({
	req: { user }
}) => {
	if (!user) return false;
	const actions = getUserAllowedActions(user);
	if (actions.has(ActionEnum["courses:delete"])) return true;
	const or: Where[] = [];
	if (actions.has(ActionEnum["courses:delete:member_only"]))
		or.push({ members: { contains: user.id } });
	if (actions.has(ActionEnum["courses:delete:creator_only"]))
		or.push({ createdBy: { equals: user.id } });
	if (or.length === 0) return false;
	return { or };
};

export const access: CollectionConfig["access"] = {
	create: canCreateCourse,
	read: canReadCourse,
	update: canUpdateCourse,
	delete: canDeleteCourse
};
