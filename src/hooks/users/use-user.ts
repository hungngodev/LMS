import { User2Schema } from "@/models/cms/user-2";
import qs from "qs";
import { useQuery } from "react-query";

/**
 * fetch a specific user with input id
 */
export const useUser = (userId: string) => {
	const endpoint = `/api/users/${userId}${qs.stringify(
		{ depth: 2 },
		{ addQueryPrefix: true }
	)}`;
	const { data: user, refetch } = useQuery(endpoint, async () => {
		const resp = await fetch(endpoint);
		return User2Schema.parse(await resp.json());
	});
	return {
		user,
		refetch: async () => {
			await refetch();
		}
	};
};
