import { Assignment0Schema } from "@/models/cms/assignment-0";
import { AssignmentMedia0Schema } from "@/models/cms/assignment-media-0";
import { Course0Schema } from "@/models/cms/course-0";
import { Submission0Schema } from "@/models/cms/submission-0";
import { BeforeValidateHook } from "payload/dist/collections/config/types";

export const injectCreatedByUpdatedByBeforeValidate: BeforeValidateHook<
	| Assignment0Schema
	| AssignmentMedia0Schema
	| Course0Schema
	| Submission0Schema
> = async ({
	data, // incoming data to update or create with
	req, // full express request
	operation, // name of the operation ie. 'create', 'update'
	originalDoc // original document
}) => {
	if (!req?.user) return data;
	if (!data) data = {};
	if (operation === "create") {
		data.createdBy = req.user.id;
		data.updatedBy = req.user.id;
	}
	if (operation === "update") {
		if (originalDoc && originalDoc.createdBy === undefined)
			data.createdBy = req.user.id;
		data.updatedBy = req.user.id;
	}
	return data;
};
