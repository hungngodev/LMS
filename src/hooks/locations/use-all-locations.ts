import { Location0Schema } from "@/models/cms/location-0";
import qs from "qs";
import { useQuery } from "react-query";
import { z } from "zod";

export const useAllLocations = () => {
	const endpoint = `/api/locations${qs.stringify(
		{ limit: 1000, depth: 0 },
		{ addQueryPrefix: true }
	)}`;
	const { data: locations, refetch } = useQuery(endpoint, async () => {
		const resp = await fetch(endpoint);
		const body = await resp.json();
		return z.array(Location0Schema).parse(body.docs);
	});
	return {
		locations,
		refetchLocations: async () => {
			await refetch();
		}
	};
};
