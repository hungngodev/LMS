import { Course0Schema } from "@/models/cms/course-0";
import qs from "qs";
import { useQuery } from "react-query";

/**
 * fetch a course with the given course id
 */
export const useCourse = (courseId: string) => {
	const endpoint = `/api/courses/${courseId}${qs.stringify(
		{ depth: 0 },
		{ addQueryPrefix: true }
	)}`;
	const { data: course, refetch } = useQuery(endpoint, async () => {
		const resp = await fetch(endpoint);
		return Course0Schema.parse(await resp.json());
	});
	return {
		course,
		refetchCourse: async () => {
			await refetch();
		}
	};
};
