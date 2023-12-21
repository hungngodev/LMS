"use client";

import { RolesCard } from "@/components/roles/roles-card";
import { RolesTable } from "@/components/roles/roles-table";
import { Skeleton } from "@/components/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/tabs";
import { useAuth } from "@/hooks/use-auth";
import { User2Schema } from "@/models/cms/user-2";
import { ViewEnum } from "@/payload/models/view-enum";
import { getUserAllowedViews } from "@/payload/utils/get-user-allowed-views";
import { FC, useEffect, useState } from "react";

const useView = (user: User2Schema | null) => {
	const [view, setView] = useState<"card" | "table" | "both" | null>(null);
	useEffect(() => {
		if (!user) return;
		const views = getUserAllowedViews(user);
		if (
			views.has(ViewEnum["roles:table"]) &&
			views.has(ViewEnum["roles:card"])
		) {
			setView("both");
		} else if (
			views.has(ViewEnum["roles:table"]) &&
			!views.has(ViewEnum["roles:card"])
		) {
			setView("table");
		} else if (
			!views.has(ViewEnum["roles:table"]) &&
			views.has(ViewEnum["roles:card"])
		) {
			setView("card");
		} else setView(null);
	}, [user]);
	return { view };
};

const Roles: FC = () => {
	const { user } = useAuth();
	const { view } = useView(user);
	if (!user)
		return (
			<div className="pt-8">
				<Skeleton className="w-full h-80" />
			</div>
		);
	if (view === "card") return <RolesCard />;
	if (view === "table") return <RolesTable />;
	if (view === "both")
		return (
			<Tabs defaultValue="table" className="w-full pt-8">
				<TabsList className="grid w-full grid-cols-2 max-w-xs">
					<TabsTrigger value="table">Table view</TabsTrigger>
					<TabsTrigger value="card">Cards view</TabsTrigger>
				</TabsList>
				<TabsContent value="table">
					<RolesTable />
				</TabsContent>
				<TabsContent value="card">
					<RolesCard />
				</TabsContent>
			</Tabs>
		);
	return <></>;
};

export default Roles;
