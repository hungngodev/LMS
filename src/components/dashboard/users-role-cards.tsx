import { Button } from "@/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { CreateUserForm } from "@/components/forms/create-user-form";
import { Skeleton } from "@/components/skeleton";
import { Header4 } from "@/components/typography/h4";
import { useAuth } from "@/hooks/use-auth";
import { Role0Schema } from "@/models/cms/role-0";
import { getUserAllowedActions } from "@/payload/utils/get-user-allowed-actions";
import { getUserAllowedViews } from "@/payload/utils/get-user-allowed-views";
import { UserIcon } from "lucide-react";
import Link from "next/link";
import { Where } from "payload/types";
import qs from "qs";
import { FC, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { z } from "zod";

const useRoles = () => {
	const endpoint = `/api/roles${qs.stringify(
		{ depth: 0, limit: 1000 },
		{ addQueryPrefix: true }
	)}`;
	const { data: roles } = useQuery(endpoint, async () => {
		const resp = await fetch(endpoint);
		const body = await resp.json();
		return z.array(Role0Schema).parse(body.docs);
	});
	return { roles };
};

const useRoleCount = (role: Role0Schema) => {
	const query: Where = { "roles.name": { equals: role.name } };
	const endpoint = `/api/users${qs.stringify(
		{ where: query, depth: 0, limit: 1000 },
		{ addQueryPrefix: true }
	)}`;
	const { data: count, refetch } = useQuery("count" + endpoint, async () => {
		const resp = await fetch(endpoint);
		const body = await resp.json();
		return z.number().parse(body.totalDocs);
	});
	return {
		count,
		refetchCount: async () => {
			await refetch();
		}
	};
};

const RoleCard: FC<{ role: Role0Schema }> = ({ role }) => {
	const { user } = useAuth();
	const [showUsersCount, setShowUsersCount] = useState<boolean>(false);
	const [showUsersCreate, setShowUsersCreate] = useState<boolean>(false);
	useEffect(() => {
		if (!user) return;
		const actions = getUserAllowedActions(user);
		setShowUsersCount(actions.has(`users:read:${role.iamName}`));
		setShowUsersCreate(actions.has(`users:create:${role.iamName}`));
	}, [role, user]);
	const { count, refetchCount } = useRoleCount(role);
	const UsersCount: FC = () => {
		if (count !== undefined) return <Header4>{count}</Header4>;
		else return <Skeleton className="h-12 w-32 rounded-lg" />;
	};
	const UsersView: FC = () => {
		return (
			<Link
				href={`/users${qs.stringify(
					{ role: role.name },
					{ addQueryPrefix: true }
				)}`}
			>
				<Button className="w-full">View</Button>
			</Link>
		);
	};
	const [creating, setCreating] = useState<boolean>(false);
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-md font-medium">
					{role.name}
				</CardTitle>
				<UserIcon className="h-6 w-6 text-muted-foreground" />
			</CardHeader>
			<CardContent className="flex flex-col space-y-4 w-full">
				{showUsersCount && <UsersCount />}
				{showUsersCount && <UsersView />}
				{showUsersCreate}
				<CreateUserForm
					open={creating}
					setOpen={setCreating}
					refetchUsers={async () => {
						await refetchCount();
					}}
					defaultRoleId={role.id}
				/>
			</CardContent>
		</Card>
	);
};

export const UsersRoleCards: FC = () => {
	const { user } = useAuth();
	const { roles } = useRoles();
	const views = user ? getUserAllowedViews(user) : null;
	if (!roles) return;
	return roles
		.filter((role) => views?.has(`dashboard:users:${role.iamName}`))
		.map((role) => <RoleCard key={role.id} role={role} />);
};
