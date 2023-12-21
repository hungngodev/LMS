import { Assignment0Schema } from "@/models/cms/assignment-0";
import qs from "qs";
import { useCallback } from "react";
import { useQuery } from "react-query";

// export const useAssignment = (assignmentId: string) => {
// 	const endpoint = `/api/assignments/${assignmentId}${qs.stringify(
// 		{ depth: 0 },
// 		{ addQueryPrefix: true }
// 	)}`;
// 	const { data: assignment, refetch } = useQuery(endpoint, async () => {
// 		const resp = await fetch(endpoint);
// 		return Assignment0Schema.parse(await resp.json());
// 	});
// 	return {
// 		assignment,
// 		refetchAssignment: async () => {
// 			await refetch();
// 		}
// 	};
// };

const fetchAssignment = async (endpoint: string) => {
	const resp = await fetch(endpoint);
	const assignment = Assignment0Schema.parse(await resp.json());
	return assignment;
};

export const useAssignment = (assignmentId: string) => {
	const endpoint = `/api/assignments/${assignmentId}${qs.stringify(
		{ depth: 0 },
		{ addQueryPrefix: true }
	)}`;
	const fetchAssignmentCb = useCallback(
		async () => await fetchAssignment(endpoint),
		[endpoint]
	);
	const { data: assignment, refetch } = useQuery(endpoint, fetchAssignmentCb);
	return {
		assignment,
		refetchAssignment: async () => {
			await refetch();
		}
	};
};
