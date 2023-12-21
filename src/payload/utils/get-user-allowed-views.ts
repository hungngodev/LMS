import { User2Schema } from "@/models/cms/user-2";

export const getUserAllowedViews = (user: User2Schema): Set<string> => {
	const s = new Set<string>();
	user.roles.forEach((role) =>
		role.views?.forEach((view) => s.add(view.name))
	);
	return s;
};
