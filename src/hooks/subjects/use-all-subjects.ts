import { Subject0Schema } from "@/models/cms/subject-0";
import qs from "qs";
import { useQuery } from "react-query";
import { z } from "zod";

export const useAllSubjects = () => {
	const endpoint = `/api/subjects${qs.stringify(
		{ limit: 10, depth: 0 },
		{ addQueryPrefix: true }
	)}`;
	const { data: subjects, refetch } = useQuery(endpoint, async () => {
		const resp = await fetch(endpoint);
		const body = await resp.json();
		return z.array(Subject0Schema).parse(body.docs);
	});
	return {
		subjects,
		refetchSubjects: async () => {
			await refetch();
		}
	};
};
