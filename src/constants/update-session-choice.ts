export const updateSessionChoices = [
	"this-session-only",
	"this-session-onwards",
	"all-sessions"
] as const;

export type UpdateSessionChoice = (typeof updateSessionChoices)[number];
