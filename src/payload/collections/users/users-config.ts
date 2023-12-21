import { CollectionConfig } from "@/types";
import { hooks } from "./user-hooks";
import { access } from "./users-access";
import { auth } from "./users-auth";
import { fields } from "./users-fields";

export const usersConfig: CollectionConfig = {
	slug: "users",
	timestamps: true,
	auth,
	access,
	fields,
	hooks
};
