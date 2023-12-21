import { Action0Schema } from "@/models/cms/action-0";
import { z } from "zod";
import { View0Schema } from "./view-0";

export const Role1Schema = z.object({
	id: z.string(),
	name: z.string(),
	iamName: z.string(),
	actions: z.array(Action0Schema),
	views: z.array(View0Schema).optional()
});

export type Role1Schema = z.infer<typeof Role1Schema>;
