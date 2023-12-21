import { z } from "zod";

export const User0Schema = z.object({
	id: z.string(),
	fullName: z.string(),
	roles: z.array(z.string()),
	updatedAt: z.string(),
	createdAt: z.string(),
	email: z.string().trim().email()
});

export type User0Schema = z.infer<typeof User0Schema>;
