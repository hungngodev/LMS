import { View0Schema } from "@/models/cms/view-0";
import qs from "qs";
import { useQuery } from "react-query";
import { z } from "zod";

export const useAllViews = () => {
	const endpoint = `/api/views${qs.stringify(
		{ depth: 0, limit: 1000 },
		{ addQueryPrefix: true }
	)}`;
	const { data: views, refetch } = useQuery(endpoint, async () => {
		const resp = await fetch(endpoint);
		const body = await resp.json();
		return z.array(View0Schema).parse(body.docs);
	});
	return {
		views,
		refetchViews: async () => {
			await refetch();
		}
	};
};
