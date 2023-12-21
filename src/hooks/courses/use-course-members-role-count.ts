import { Course0Schema } from "@/models/cms/course-0";
import { Role0Schema } from "@/models/cms/role-0";
import { Where } from "payload/types";
import qs from "qs";
import { useQuery } from "react-query";
import { z } from "zod";

/**
 * fetch count of all members of a given course whose role is input role
 */
export const useCourseMembersRoleCount = (
	course: Course0Schema,
	role: Role0Schema
) => {
	const query: Where = {
		id: { in: course.members?.join(",") ?? "" },
		"roles.name": { equals: role.name }
	};
	const endpoint = `/api/users${qs.stringify(
		{ where: query, limit: 1000, depth: 0 },
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
