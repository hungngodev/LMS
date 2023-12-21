import { env } from "@/payload/env";
import { RoleEnum } from "@/payload/models/role-enum";
import { Payload } from "payload";

export const seedAdmin = async (payload: Payload) => {
	const adminRole = await payload.find({
		collection: "roles",
		where: { name: { equals: RoleEnum.Administrator } },
		limit: 1
	});
	if (adminRole.docs.length !== 1) return;
	const adminUser = await payload.find({
		collection: "users",
		where: { roles: { contains: adminRole.docs[0].id } },
		limit: 1
	});
	if (adminUser.docs.length === 0) {
		await payload.create({
			collection: "users",
			data: {
				email: env.INIT_ADMIN_EMAIL,
				password: env.INIT_ADMIN_PASSWORD,
				fullName: RoleEnum.Administrator,
				roles: [adminRole.docs[0].id]
			}
		});
	}
};
