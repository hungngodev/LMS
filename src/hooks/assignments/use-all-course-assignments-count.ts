import { Where } from "payload/types";
import qs from "qs";
import { useQuery } from "react-query";
import { z } from "zod";

/**
 * fetch all count of all assignments of a given course
 */
export const useAllCourseAssignmentsCount = (courseId: string) => {
	const query: Where = { course: { equals: courseId } };
	const endpoint = `/api/assignments${qs.stringify(
		{ depth: 0, limit: 1, where: query },
		{ addQueryPrefix: true }
	)}`;
	const { data: count, refetch } = useQuery("count" + endpoint, async () => {
		const resp = await fetch(endpoint);
		const body = await resp.json();
		return z.number().parse(body.totalDocs);
	});
	return {
		count,
		refetchCount: async () => {
			await refetch();
		}
	};
};
