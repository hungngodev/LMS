export const frequencies = ["daily", "weekly", "monthly", "annually"] as const;
export type Frequency = (typeof frequencies)[number];
