import { Role0Schema } from "@/models/cms/role-0";
import { RoleEnum, roleIamName } from "@/payload/models/role-enum";
import { Payload } from "payload";
import { z } from "zod";

export const seedAdminRole = async (payload: Payload) => {
	const currentAdminRoles = z
		.array(Role0Schema)
		.parse(
			(await payload.find({ collection: "roles", depth: 0, limit: 1 }))
				.docs
		);

	const allActions = await payload.find({
		collection: "actions",
		limit: 1000
	});

	const allViews = await payload.find({ collection: "views", limit: 1000 });

	if (currentAdminRoles.length !== 0) {
		await payload.update({
			collection: "roles",
			id: currentAdminRoles[0].id,
			data: {
				actions: allActions.docs.map((action) => action.id),
				views: allViews.docs.map((view) => view.id)
			}
		});
	} else {
		await payload.create({
			collection: "roles",
			data: {
				name: RoleEnum.Administrator,
				iamName: roleIamName[RoleEnum.Administrator],
				actions: allActions.docs.map((action) => action.id),
				views: allViews.docs.map((view) => view.id)
			}
		});
	}
};
