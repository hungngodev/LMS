import { Where } from "payload/types";
import qs from "qs";
import { useMemo } from "react";
import { useQuery } from "react-query";
import { z } from "zod";

/**
 * fetch all count of upcoming assignments of a given course
 */
export const useUpcomingCourseAssignmentsCount = (courseId: string) => {
	const query = useMemo<Where>(() => {
		return {
			and: [
				{ course: { equals: courseId } },
				{ dueAt: { greater_than: new Date().toISOString() } } as Where
			]
		};
	}, [courseId]);
	const endpoint = `/api/assignments${qs.stringify(
		{ depth: 0, limit: 1, where: query },
		{ addQueryPrefix: true }
	)}`;
	const fetchUpcomingAssignmentsCount = async () => {
		const resp = await fetch(endpoint);
		const body = await resp.json();
		return z.number().parse(body.totalDocs);
	};
	const { data: count, refetch } = useQuery(
		"count" + endpoint,
		fetchUpcomingAssignmentsCount
	);
	return {
		count,
		refetchCount: async () => {
			await refetch();
		}
	};
};
