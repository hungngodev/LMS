import { View0Schema } from "@/models/cms/view-0";
import { ViewEnum } from "@/payload/models/view-enum";
import { Payload } from "payload";
import { z } from "zod";

export const seedViews = async (payload: Payload) => {
	const views = z.array(View0Schema).parse(
		(
			await payload.find({
				collection: "views",
				limit: 1000,
				depth: 0
			})
		).docs
	);
	const viewsName = new Set(views.map((viewObj) => viewObj.name));
	await Promise.all(
		Object.values(ViewEnum).map(async (view) => {
			if (viewsName.has(view)) {
				await payload.update({
					collection: "views",
					where: { name: { equals: view } },
					data: { name: view }
				});
			} else {
				await payload.create({
					collection: "views",
					data: { name: view }
				});
			}
		})
	);
};
