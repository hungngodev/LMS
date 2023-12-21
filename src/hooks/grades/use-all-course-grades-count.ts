import { Where } from "payload/types";
import qs from "qs";
import { useQuery } from "react-query";
import { z } from "zod";

/**
 * fetch count of all grades of a given course
 */
export const useAllCourseGradesCount = (courseId: string) => {
	const query: Where = { course: { equals: courseId } };
	const endpoint = `/api/grades${qs.stringify(
		{ depth: 0, limit: 1000, where: query },
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
