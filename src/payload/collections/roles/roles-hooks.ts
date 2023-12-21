import { Role0Schema } from "@/models/cms/role-0";
import { CollectionHooks } from "@/types";
import {
	AfterChangeHook,
	AfterDeleteHook
} from "payload/dist/collections/config/types";

const generateViewsAndActions = (iamName: string) => {
	const newViewsAndActions: {
		collection: "views" | "actions";
		name: string;
	}[] = [
		{ collection: "views", name: `nav:users:${iamName}` },
		{ collection: "views", name: `dashboard:users:${iamName}` },
		{
			collection: "views",
			name: `dashboard:users:${iamName}:count`
		},
		{
			collection: "views",
			name: `dashboard:users:${iamName}:read`
		},
		{
			collection: "views",
			name: `dashboard:users:${iamName}:create`
		},
		{
			collection: "views",
			name: `courses:nav:members:${iamName}`
		},
		{
			collection: "views",
			name: `courses:dashboard:members:${iamName}`
		},
		{ collection: "actions", name: `users:create:${iamName}` },
		{ collection: "actions", name: `users:read:${iamName}` },
		{ collection: "actions", name: `users:update:${iamName}` },
		{ collection: "actions", name: `users:delete:${iamName}` }
	];
	return newViewsAndActions;
};

const createViewsAndActionsFromCreatedRole: AfterChangeHook<
	Role0Schema
> = async ({
	doc, // full document data
	req, // full express request
	previousDoc, // document data before updating the collection
	operation // name of the operation ie. 'create', 'update'
}) => {
	if (operation === "create") {
		const iamName = doc.iamName;
		const docs = generateViewsAndActions(iamName);
		await Promise.all(
			docs.map(({ collection, name }) =>
				req.payload.create({
					collection,
					data: { name }
				})
			)
		);
	}
};

const removeViewsAndActionsFromDeletedRole: AfterDeleteHook<
	Role0Schema
> = async ({
	req, // full express request
	id, // id of document to delete
	doc // deleted document
}) => {
	const iamName = doc.iamName;
	const docs = generateViewsAndActions(iamName);
	await Promise.all(
		docs.map(({ collection, name }) =>
			req.payload.delete({
				collection,
				where: { name: { equals: name } }
			})
		)
	);
};

export const hooks: CollectionHooks<Role0Schema> = {
	afterChange: [createViewsAndActionsFromCreatedRole],
	afterDelete: [removeViewsAndActionsFromDeletedRole]
};
