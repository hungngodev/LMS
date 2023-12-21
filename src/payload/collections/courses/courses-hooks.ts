import { Course0Schema } from "@/models/cms/course-0";
import { injectCreatedByUpdatedByBeforeValidate } from "@/payload/utils/inject-created-by-updated-by-before-validate";
import { CollectionHooks } from "@/types";

export const hooks: CollectionHooks<Course0Schema> = {
	beforeValidate: [injectCreatedByUpdatedByBeforeValidate]
};
