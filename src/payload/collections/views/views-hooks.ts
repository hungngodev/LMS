import { Role0Schema } from "@/models/cms/role-0";
import { View0Schema } from "@/models/cms/view-0";
import { RoleEnum } from "@/payload/models/role-enum";
import { CollectionHooks } from "@/types";
import { z } from "zod";

export const hooks: CollectionHooks<View0Schema> = {
	afterChange: [
		async ({
			doc, // full document data
			req, // full express request
			previousDoc, // document data before updating the collection
			operation // name of the operation ie. 'create', 'update'
		}) => {
			const roles = z.array(Role0Schema).parse(
				(
					await req.payload.find({
						collection: "roles",
						where: { name: { equals: RoleEnum.Administrator } },
						limit: 1
					})
				).docs
			);
			if (roles.length === 0) return;
			const adminRole = roles[0];
			const views = new Set<string>();
			adminRole.views.forEach((view) => views.add(view));
			views.add(doc.id);
			await req.payload.update({
				collection: "roles",
				where: { name: { equals: RoleEnum.Administrator } },
				data: { views: Array.from(views) }
			});
		}
	],
	afterDelete: [
		async ({
			req, // full express request
			id, // id of document to delete
			doc // deleted document
		}) => {
			const roles = z.array(Role0Schema).parse(
				(
					await req.payload.find({
						collection: "roles",
						where: { name: { equals: RoleEnum.Administrator } },
						limit: 1
					})
				).docs
			);
			if (roles.length === 0) return;
			const adminRole = roles[0];
			const currentViews = new Set<string>();
			adminRole.views?.forEach((view) => currentViews.add(view));
			currentViews.delete(doc.id);
			const newViews = Array.from(currentViews);
			await req.payload.update({
				collection: "roles",
				id: adminRole.id,
				data: { views: newViews }
			});
		}
	]
};
