import { z } from "zod";

export const Subject0Schema = z.object({
	id: z.string(),
	name: z.string(),
	updatedAt: z.string(),
	createdAt: z.string()
});

export type Subject0Schema = z.infer<typeof Subject0Schema>;
