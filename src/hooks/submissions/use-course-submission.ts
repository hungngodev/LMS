import { Submission0Schema } from "@/models/cms/submission-0";
import { Where } from "payload/types";
import qs from "qs";
import { useQuery } from "react-query";
import { z } from "zod";

/**
 * fetch all submissions of a given course
 */
export const useCourseSubmissions = (courseId: string) => {
	const query: Where = { course: { equals: courseId } };
	const endpoint = `/api/submissions${qs.stringify(
		{ depth: 0, limit: 1000, where: query },
		{ addQueryPrefix: true }
	)}`;
	const { data: submissions, refetch } = useQuery(endpoint, async () => {
		const resp = await fetch(endpoint);
		const body = await resp.json();
		return z.array(Submission0Schema).parse(body.docs);
	});
	return {
		submissions,
		refetchSubmissions: async () => {
			await refetch();
		}
	};
};
