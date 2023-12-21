import { Assignment0Schema } from "@/models/cms/assignment-0";
import qs from "qs";
import { useQuery } from "react-query";
import { z } from "zod";

/**
 * fetch all assignments of a user
 */
export const useAllAssignments = () => {
	const endpoint = `/api/assignments${qs.stringify(
		{ depth: 0, limit: 1000 },
		{ addQueryPrefix: true }
	)}`;
	const { data: assignments, refetch } = useQuery(endpoint, async () => {
		const resp = await fetch(endpoint);
		const body = await resp.json();
		return z.array(Assignment0Schema).parse(body.docs);
	});
	return {
		assignments,
		refetchAssignments: async () => {
			await refetch();
		}
	};
};
