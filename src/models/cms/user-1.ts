import { Role0Schema } from "@/models/cms/role-0";
import { z } from "zod";

export const User1Schema = z.object({
	id: z.string(),
	fullName: z.string(),
	roles: z.array(Role0Schema),
	updatedAt: z.string(),
	createdAt: z.string(),
	email: z.string().trim().email()
});

export type User1Schema = z.infer<typeof User1Schema>;
