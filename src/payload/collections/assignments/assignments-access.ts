import { Assignment0Schema } from "@/models/cms/assignment-0";
import { User2Schema } from "@/models/cms/user-2";
import { ActionEnum } from "@/payload/models/action-enum";
import { getUserAllowedActions } from "@/payload/utils/get-user-allowed-actions";
import { isCourseMember } from "@/payload/utils/is-course-member";
import { Access, CollectionConfig, Where } from "payload/types";

const canCreateAssignment: Access<Assignment0Schema, User2Schema> = async ({
	req: { user, payload },
	data
}) => {
	if (!user || !data) return false;
	const actions = getUserAllowedActions(user);
	if (actions.has(ActionEnum["assignments:create"])) return true;
	if (actions.has(ActionEnum["assignments:create:member_only"]))
		if (await isCourseMember(user, data.course, payload)) return true;
	return false;
};

const canReadAssignment: Access<Assignment0Schema, User2Schema> = async ({
	req: { user }
}) => {
	if (!user) return false;
	const actions = getUserAllowedActions(user);
	if (actions.has(ActionEnum["assignments:read"])) return true;
	const or: Where[] = [];
	if (actions.has(ActionEnum["assignments:read:member_only"]))
		or.push({ "course.members": { contains: user.id } });
	if (actions.has(ActionEnum["assignments:read:creator_only"]))
		or.push({ createdBy: { equals: user.id } });
	if (or.length === 0) return false;
	return { or };
};

const canUpdateAssignment: Access<Assignment0Schema, User2Schema> = ({
	req: { user }
}) => {
	if (!user) return false;
	const actions = getUserAllowedActions(user);
	if (actions.has(ActionEnum["assignments:update"])) return true;
	const or: Where[] = [];
	if (actions.has(ActionEnum["assignments:update:member_only"]))
		or.push({ "course.members": { contains: user.id } });
	if (actions.has(ActionEnum["assignments:update:creator_only"]))
		or.push({ createdBy: { equals: user.id } });
	if (or.length === 0) return false;
	return { or };
};

const canDeleteAssignment: Access<Assignment0Schema, User2Schema> = ({
	req: { user }
}) => {
	if (!user) return false;
	const actions = getUserAllowedActions(user);
	if (actions.has(ActionEnum["assignments:delete"])) return true;
	const or: Where[] = [];
	if (actions.has(ActionEnum["assignments:delete:member_only"]))
		or.push({ "course.members": { contains: user.id } });
	if (actions.has(ActionEnum["assignments:delete:creator_only"]))
		or.push({ createdBy: { equals: user.id } });
	if (or.length === 0) return false;
	return { or };
};

export const access: CollectionConfig["access"] = {
	create: canCreateAssignment,
	read: canReadAssignment,
	update: canUpdateAssignment,
	delete: canDeleteAssignment
};
