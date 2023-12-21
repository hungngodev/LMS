import { Grade1Schema } from "@/models/cms/grade-1";
import { Where } from "payload/types";
import qs from "qs";
import { useQuery } from "react-query";
import { z } from "zod";

/**
 * fetch count of all grades of a given assignment
 */
export const useGrades = (assignmentId: string | undefined) => {
	const query: Where = { assignment: { equals: assignmentId } };
	const endpoint = `/api/grades${qs.stringify(
		{ depth: 1, limit: 1000, where: query },
		{ addQueryPrefix: true }
	)}`;
	const { data: grades, refetch } = useQuery(endpoint, async () => {
		const resp = await fetch(endpoint);
		return z.array(Grade1Schema).parse(await resp.json());
	});
	return {
		grades,
		refetchGrades: async () => {
			await refetch();
		}
	};
};
