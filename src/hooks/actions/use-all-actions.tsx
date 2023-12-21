import { Action0Schema } from "@/models/cms/action-0";
import qs from "qs";
import { useQuery } from "react-query";
import { z } from "zod";

export const useAllActions = () => {
	const endpoint = `/api/actions${qs.stringify(
		{ depth: 0, limit: 1000 },
		{ addQueryPrefix: true }
	)}`;
	const { data: actions, refetch } = useQuery(endpoint, async () => {
		const resp = await fetch(endpoint);
		const body = await resp.json();
		return z.array(Action0Schema).parse(body.docs);
	});
	return {
		actions,
		refetchActions: async () => {
			await refetch();
		}
	};
};
