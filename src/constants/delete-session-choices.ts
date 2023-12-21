export const deleteSessionChoices = [
	"this-session-only",
	"this-session-onwards",
	"all-sessions"
] as const;

export type DeleteSessionChoice = (typeof deleteSessionChoices)[number];
