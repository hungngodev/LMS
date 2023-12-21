import { Course0Schema } from "@/models/cms/course-0";
import { GradeMedia0Schema } from "@/models/cms/grade-media-0";
import { User2Schema } from "@/models/cms/user-2";
import { ActionEnum } from "@/payload/models/action-enum";
import { getUserAllowedActions } from "@/payload/utils/get-user-allowed-actions";
import { Access, CollectionConfig, Where } from "payload/types";

const canCreateGradesMedia: Access<GradeMedia0Schema, User2Schema> = async ({
	req: { user, payload },
	data
}) => {
	if (!user || !data) return false;
	const actions = getUserAllowedActions(user);
	if (actions.has(ActionEnum["grades:create"])) return true;
	if (actions.has(ActionEnum["grades:create:member_only"])) {
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

const canReadGradesMedia: Access<GradeMedia0Schema, User2Schema> = ({
	req: { user }
}) => {
	if (!user) return false;
	const actions = getUserAllowedActions(user);
	if (actions.has(ActionEnum["grades:read"])) return true;
	const or: Where[] = [];
	if (actions.has(ActionEnum["grades:read:member_only"]))
		or.push({ "course.members": { contains: user.id } });
	if (actions.has(ActionEnum["grades:read:submission_author_only"]))
		or.push({ "submission.author": { equals: user.id } });
	if (actions.has(ActionEnum["grades:read:grader_only"]))
		or.push({ grader: { equals: user.id } });
	if (or.length === 0) return false;
	return { or };
};

const canUpdateGradesMedia: Access<GradeMedia0Schema, User2Schema> = ({
	req: { user }
}) => {
	if (!user) return false;
	const actions = getUserAllowedActions(user);
	if (actions.has(ActionEnum["grades:update"])) return true;
	const or: Where[] = [];
	if (actions.has(ActionEnum["grades:update:member_only"]))
		or.push({ "course.members": { contains: user.id } });
	if (actions.has(ActionEnum["grades:update:grader_only"]))
		or.push({ grader: { equals: user.id } });

	return { or };
};

const canDeleteGradesMedia: Access<GradeMedia0Schema, User2Schema> = ({
	req: { user }
}) => {
	if (!user) return false;
	const actions = getUserAllowedActions(user);

	if (actions.has(ActionEnum["grades:delete"])) return true;

	const or: Where[] = [];
	if (actions.has(ActionEnum["grades:update:member_only"]))
		or.push({ "course.members": { contains: user.id } });
	if (or.length === 0) return false;
	return { or };
};

export const access: CollectionConfig["access"] = {
	create: canCreateGradesMedia,
	read: canReadGradesMedia,
	update: canUpdateGradesMedia,
	delete: canDeleteGradesMedia
};
