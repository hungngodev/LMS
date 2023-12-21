import { User2Schema } from "@/models/cms/user-2";

export const getUserAllowedActions = (user: User2Schema): Set<string> => {
	const s = new Set<string>();
	user.roles.forEach((role) =>
		role.actions.forEach((action) => s.add(action.name))
	);
	return s;
};
