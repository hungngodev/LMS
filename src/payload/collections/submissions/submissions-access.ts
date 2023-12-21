import { Course0Schema } from "@/models/cms/course-0";
import { Submission0Schema } from "@/models/cms/submission-0";
import { User2Schema } from "@/models/cms/user-2";
import { ActionEnum } from "@/payload/models/action-enum";
import { getUserAllowedActions } from "@/payload/utils/get-user-allowed-actions";
import { Access, CollectionConfig, Where } from "payload/types";

const canCreateSubmission: Access<Submission0Schema, User2Schema> = async ({
	req: { user, payload },
	data
}) => {
	if (!user || !data) return false;
	const actions = getUserAllowedActions(user);
	if (actions.has(ActionEnum["submissions:create"])) return true;
	if (actions.has(ActionEnum["submissions:create:member_only"])) {
		const course = Course0Schema.parse(
			await payload.findByID({
				collection: "courses",
				id: data.course,
				depth: 0
			})
		);
		if (course.members?.includes(user.id)) return true;
	}
	return false;
};

const canReadSubmission: Access<Submission0Schema, User2Schema> = ({
	req: { user }
}) => {
	if (!user) return false;
	const actions = getUserAllowedActions(user);
	if (actions.has(ActionEnum["submissions:read"])) return true;
	const or: Where[] = [];
	if (actions.has(ActionEnum["submissions:read:member_only"]))
		or.push({ "course.members": { contains: user.id } });
	if (actions.has(ActionEnum["submissions:read:author_only"]))
		or.push({ author: { equals: user.id } });
	if (or.length === 0) return false;
	return { or };
};

const canUpdateSubmission: Access<Submission0Schema, User2Schema> = ({
	req: { user }
}) => {
	if (!user) return false;
	const actions = getUserAllowedActions(user);
	if (actions.has(ActionEnum["submissions:update"])) return true;
	const or: Where[] = [];
	if (actions.has(ActionEnum["submissions:update:member_only"]))
		or.push({ "course.members": { contains: user.id } });
	if (actions.has(ActionEnum["submissions:update:author_only"]))
		or.push({ author: { equals: user.id } });
	if (or.length === 0) return false;
	return { or };
};

const canDeleteSubmission: Access<Submission0Schema, User2Schema> = ({
	req: { user }
}) => {
	if (!user) return false;
	const actions = getUserAllowedActions(user);
	if (actions.has(ActionEnum["submissions:delete"])) return true;
	const or: Where[] = [];
	if (actions.has(ActionEnum["submissions:update:member_only"]))
		or.push({ "course.members": { contains: user.id } });
	if (actions.has(ActionEnum["submissions:update:author_only"]))
		or.push({ author: { equals: user.id } });
	if (or.length === 0) return false;
	return { or };
};

export const access: CollectionConfig["access"] = {
	create: canCreateSubmission,
	read: canReadSubmission,
	update: canUpdateSubmission,
	delete: canDeleteSubmission
};
