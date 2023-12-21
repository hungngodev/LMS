import { Role0Schema } from "@/models/cms/role-0";
import qs from "qs";
import { useQuery } from "react-query";
import { z } from "zod";

/**
 * fetch all roles from database
 */
export const useAllRoles = () => {
	const endpoint = `/api/roles${qs.stringify(
		{ depth: 0, limit: 1000 },
		{ addQueryPrefix: true }
	)}`;
	const { data: roles, refetch } = useQuery(
		endpoint,
		async () => {
			const resp = await fetch(endpoint);
			const body = await resp.json();
			return z.array(Role0Schema).parse(body.docs ?? []);
		},
		{ useErrorBoundary: true }
	);
	return {
		roles,
		refetchRoles: async () => {
			await refetch();
		}
	};
};
