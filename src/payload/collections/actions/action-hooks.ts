import { Action0Schema } from "@/models/cms/action-0";
import { Role0Schema } from "@/models/cms/role-0";
import { RoleEnum } from "@/payload/models/role-enum";
import { CollectionHooks } from "@/types";
import {
	AfterChangeHook,
	AfterDeleteHook
} from "payload/dist/collections/config/types";
import { z } from "zod";

const addCreatedActionToAdmin: AfterChangeHook<Action0Schema> = async ({
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
	await req.payload.update({
		collection: "roles",
		id: adminRole.id,
		data: {
			actions: Array.from(new Set([...adminRole.actions, doc.id]))
		}
	});
};

const removeDeletedActionFromAdmin: AfterDeleteHook<Action0Schema> = async ({
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
	const currentActions = new Set([...adminRole.actions]);
	currentActions.delete(doc.id);
	const newActions = Array.from(currentActions);
	await req.payload.update({
		collection: "roles",
		id: adminRole.id,
		data: { actions: newActions }
	});
};

export const hooks: CollectionHooks<Action0Schema> = {
	afterChange: [addCreatedActionToAdmin],
	afterDelete: [removeDeletedActionFromAdmin]
};
