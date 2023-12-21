import { Role1Schema } from "@/models/cms/role-1";
import { z } from "zod";

export const User2Schema = z.object({
	id: z.string(),
	fullName: z.string(),
	roles: z.array(Role1Schema),
	updatedAt: z.string(),
	createdAt: z.string(),
	email: z.string().trim().email()
});

export type User2Schema = z.infer<typeof User2Schema>;
