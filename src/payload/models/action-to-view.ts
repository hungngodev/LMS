import { ActionEnum } from "./action-enum";
import { ViewEnum } from "./view-enum";

export const actionToView: Record<string, ViewEnum[]> = {
	// actions
	[ActionEnum["actions:create"]]: [ViewEnum["nav:actions"]],
	[ActionEnum["actions:read"]]: [ViewEnum["nav:actions"]],
	[ActionEnum["actions:update"]]: [ViewEnum["nav:actions"]],
	[ActionEnum["actions:delete"]]: [ViewEnum["nav:actions"]],

	// roles
	[ActionEnum["roles:create"]]: [ViewEnum["nav:roles"]],
	[ActionEnum["roles:read"]]: [ViewEnum["nav:roles"]],
	[ActionEnum["roles:update"]]: [ViewEnum["nav:roles"]],
	[ActionEnum["roles:delete"]]: [ViewEnum["nav:roles"]],

	// users
	[ActionEnum["users:create"]]: [ViewEnum["nav:users"]],
	[ActionEnum["users:read"]]: [ViewEnum["nav:users"]],
	[ActionEnum["users:update"]]: [ViewEnum["nav:users"]],
	[ActionEnum["users:delete"]]: [ViewEnum["nav:users"]],

	// users with specific role: handles dynamically

	// users self
	[ActionEnum["users:read:self"]]: [ViewEnum["nav:profile"]],
	[ActionEnum["users:update:self"]]: [ViewEnum["nav:profile"]],
	[ActionEnum["users:delete:self"]]: [ViewEnum["nav:profile"]],

	// locations
	[ActionEnum["locations:create"]]: [ViewEnum["nav:locations"]],
	[ActionEnum["locations:read"]]: [ViewEnum["nav:locations"]],
	[ActionEnum["locations:update"]]: [ViewEnum["nav:locations"]],
	[ActionEnum["locations:delete"]]: [ViewEnum["nav:locations"]],

	// subjects
	[ActionEnum["subjects:create"]]: [ViewEnum["nav:subjects"]],
	[ActionEnum["subjects:read"]]: [ViewEnum["nav:subjects"]],
	[ActionEnum["subjects:update"]]: [ViewEnum["nav:subjects"]],
	[ActionEnum["subjects:delete"]]: [ViewEnum["nav:subjects"]],

	// sessions
	[ActionEnum["sessions:create"]]: [ViewEnum["nav:sessions"]],
	[ActionEnum["sessions:read"]]: [ViewEnum["nav:sessions"]],
	[ActionEnum["sessions:update"]]: [ViewEnum["nav:sessions"]],
	[ActionEnum["sessions:delete"]]: [ViewEnum["nav:sessions"]],

	// courses
	[ActionEnum["courses:create"]]: [ViewEnum["nav:courses"]],
	[ActionEnum["courses:read"]]: [ViewEnum["nav:courses"]],
	[ActionEnum["courses:update"]]: [ViewEnum["nav:courses"]],
	[ActionEnum["courses:delete"]]: [ViewEnum["nav:courses"]],

	// assignments
	[ActionEnum["assignments:create"]]: [ViewEnum["nav:assignments"]],
	[ActionEnum["assignments:read"]]: [ViewEnum["nav:assignments"]],
	[ActionEnum["assignments:update"]]: [ViewEnum["nav:assignments"]],
	[ActionEnum["assignments:delete"]]: [ViewEnum["nav:assignments"]],

	// submissions
	[ActionEnum["submissions:create"]]: [ViewEnum["nav:submissions"]],
	[ActionEnum["submissions:read"]]: [ViewEnum["nav:submissions"]],
	[ActionEnum["submissions:update"]]: [ViewEnum["nav:submissions"]],
	[ActionEnum["submissions:delete"]]: [ViewEnum["nav:submissions"]],

	// grades
	[ActionEnum["grades:create"]]: [ViewEnum["nav:grades"]],
	[ActionEnum["grades:read"]]: [ViewEnum["nav:grades"]],
	[ActionEnum["grades:update"]]: [ViewEnum["nav:grades"]],
	[ActionEnum["grades:delete"]]: [ViewEnum["nav:grades"]]
};
