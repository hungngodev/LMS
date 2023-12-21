import { Submission0Schema } from "@/models/cms/submission-0";
import { User2Schema } from "@/models/cms/user-2";
import { Where } from "payload/types";
import qs from "qs";
import { useCallback, useMemo } from "react";
import { useQuery } from "react-query";
import { z } from "zod";

const fetchSubmissions = async (endpoint: string) => {
	if (endpoint === "") return undefined;
	const resp = await fetch(endpoint);
	const body = await resp.json();
	const submissions = z.array(Submission0Schema).parse(body.docs);
	return submissions;
};

export const useSubmissions = (
	assignmentId: string | undefined,
	user: User2Schema | null
) => {
	const query: Where = useMemo(
		() =>
			user && assignmentId
				? {
						and: [
							{ createdBy: { equals: user.id } },
							{ assignment: { equals: assignmentId } }
						]
				  }
				: ({} as Record<never, never>),
		[assignmentId, user]
	);
	const endpoint = useMemo(
		() =>
			JSON.stringify(query) !== "{}"
				? `/api/submissions${qs.stringify(
						{
							where: query,
							depth: 0,
							limit: 1000,
							sort: "-createdAt"
						},
						{ addQueryPrefix: true }
				  )}`
				: "",
		[query]
	);
	const fetchSubmissionsCb = useCallback(
		async () => await fetchSubmissions(endpoint),
		[endpoint]
	);
	const { data: submissions, refetch } = useQuery(
		endpoint,
		fetchSubmissionsCb,
		{
			enabled: endpoint !== ""
		}
	);
	return {
		submissions,
		refetchSubmissions: async () => {
			await refetch();
		}
	};
};

//Lamie write
// export const useSubmissions = (
// 	assignmentId: string,
// 	user: User2Schema | null
// ) => {
// 	const submissionsQuery: Where = {
// 		assignment: { equals: assignmentId },
// 		createdBy: { equals: user?.id }
// 	};
// 	const endpoint = `/api/assignments${qs.stringify(
// 		{ where: submissionsQuery, depth: 0, limit: 1000 },
// 		{ addQueryPrefix: true }
// 	)}`;
// 	const { data: submissions, refetch } = useQuery(endpoint, async () => {
// 		const resp = await fetch(endpoint);
// 		const body = await resp.json();
// 		const submissions = z.array(Submission0Schema).parse(body.docs);
// 		return submissions;
// 	});
// 	return {
// 		submissions,
// 		refetchSubmissions: async () => {
// 			await refetch();
// 		}
// 	};
// };
