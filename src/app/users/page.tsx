"use client";

import { Skeleton } from "@/components/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/tabs";
import { UsersCard } from "@/components/users/user-cards";
import { UsersTable } from "@/components/users/user-table";
import { useAuth } from "@/hooks/use-auth";
import { User2Schema } from "@/models/cms/user-2";
import { ViewEnum } from "@/payload/models/view-enum";
import { getUserAllowedViews } from "@/payload/utils/get-user-allowed-views";
import { useSearchParams } from "next/navigation";
import { FC, useEffect, useState } from "react";

const useViews = (user: User2Schema | null) => {
	const [view, setView] = useState<"card" | "table" | "both" | null>(null);
	useEffect(() => {
		if (!user) return;
		const views = getUserAllowedViews(user);
		if (
			views.has(ViewEnum["users:table"]) &&
			views.has(ViewEnum["users:card"])
		)
			setView("both");
		else if (
			views.has(ViewEnum["users:table"]) &&
			!views.has(ViewEnum["users:card"])
		)
			setView("table");
		else if (
			!views.has(ViewEnum["users:table"]) &&
			views.has(ViewEnum["users:card"])
		)
			setView("card");
		else setView(null);
	}, [user]);
	return { view };
};

const Users: FC = () => {
	const { user } = useAuth();
	const { view } = useViews(user);
	const searchParams = useSearchParams();

	if (!user)
		return (
			<div className="pt-8">
				<Skeleton className="w-full h-80" />
			</div>
		);
	if (view === "card") return <UsersCard />;
	if (view === "table") return <UsersTable />;
	if (view === "both")
		return (
			<Tabs defaultValue="table" className="w-full pt-8">
				<TabsList className="grid w-full grid-cols-2 max-w-xs">
					<TabsTrigger value="table">Table view</TabsTrigger>
					<TabsTrigger value="card">Cards view</TabsTrigger>
				</TabsList>
				<TabsContent value="table">
					<UsersTable role={searchParams?.get("role") ?? undefined} />
				</TabsContent>
				<TabsContent value="card">
					<UsersCard role={searchParams?.get("role") ?? undefined} />
				</TabsContent>
			</Tabs>
		);
	return <></>;
};

export default Users;
