import { Action0Schema } from "@/models/cms/action-0";
import { Payload } from "payload";
import { z } from "zod";
import { ActionEnum } from "../models/action-enum";

export const seedActions = async (payload: Payload) => {
	const actions = z.array(Action0Schema).parse(
		(
			await payload.find({
				collection: "actions",
				limit: 1000,
				depth: 0
			})
		).docs
	);
	const actionsName = new Set(actions.map((actionObj) => actionObj.name));
	await Promise.all(
		Object.values(ActionEnum).map(async (action) => {
			if (actionsName.has(action)) {
				await payload.update({
					collection: "actions",
					where: { name: { equals: action } },
					data: { name: action }
				});
			} else {
				await payload.create({
					collection: "actions",
					data: { name: action }
				});
			}
		})
	);
};
