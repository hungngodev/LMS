import { z } from "zod";

export const Location0Schema = z.object({
	id: z.string(),
	name: z.string(),
	updatedAt: z.string(),
	createdAt: z.string()
});

export type Location0Schema = z.infer<typeof Location0Schema>;
