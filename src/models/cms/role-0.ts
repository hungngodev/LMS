import { z } from "zod";

export const Role0Schema = z.object({
	id: z.string(),
	name: z.string(),
	iamName: z.string(),
	actions: z.array(z.string()).optional().default([]),
	views: z.array(z.string()).optional().default([])
});

export type Role0Schema = z.infer<typeof Role0Schema>;
