import { z } from "zod";

export const View0Schema = z.object({
	id: z.string(),
	name: z.string()
});

export type View0Schema = z.infer<typeof View0Schema>;
