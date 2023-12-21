import { Role0Schema } from "@/models/cms/role-0";
import qs from "qs";
import { useQuery } from "react-query";

/**
 * fetch a role from database
 */
export const useRole = (roleId: string) => {
	const endpoint = `/api/roles/${roleId}${qs.stringify(
		{ depth: 0 },
		{ addQueryPrefix: true }
	)}`;
	const { data: role } = useQuery(
		endpoint,
		async () => {
			const resp = await fetch(endpoint);
			return Role0Schema.parse(await resp.json());
		},
		{
			useErrorBoundary: true
		}
	);
	return { role };
};
