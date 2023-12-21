import { z } from "zod";

export const Action0Schema = z.object({
	id: z.string(),
	name: z.string()
});

export type Action0Schema = z.infer<typeof Action0Schema>;
