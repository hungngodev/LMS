import { User2Schema } from "@/models/cms/user-2";
import { Where } from "payload/types";
import qs from "qs";
import { useQuery } from "react-query";
import { z } from "zod";

/**
 * fetch all users where id not in exception id and role id equals input role id
 */
export const useUsersExceptIdsWithRoleId = (
	exceptIds: string[] = [],
	roleId?: string
) => {
	const query: Where = { id: { not_in: exceptIds } };
	if (roleId) query["roles[0]"] = { equals: roleId };
	const endpoint = `/api/users${qs.stringify(
		{ depth: 2, limit: 1000, where: query },
		{ addQueryPrefix: true }
	)}`;
	const { data: users, refetch } = useQuery(endpoint, async () => {
		const resp = await fetch(endpoint);
		const body = await resp.json();
		return z.array(User2Schema).parse(body.docs);
	});
	return {
		users,
		refetchUsers: async () => {
			await refetch();
		}
	};
};
