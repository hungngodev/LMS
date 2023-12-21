"use client";
import { AssignmentsCard } from "@/components/assignments/assignments-card";
import { AssignmentsTable } from "@/components/assignments/assignments-table";
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
		// if user only has read permission
		if (
			views.has(ViewEnum["assignments:table"]) &&
			views.has(ViewEnum["assignments:card"])
		) {
			setView("both");
		} else if (
			!views.has(ViewEnum["assignments:table"]) &&
			views.has(ViewEnum["assignments:card"])
		) {
			setView("card");
		} else if (
			views.has(ViewEnum["assignments:table"]) &&
			!views.has(ViewEnum["assignments:card"])
		) {
			setView("table");
		} else setView(null);
	}, [user]);
	return { view };
};

const Assignments: FC = () => {
	const { user } = useAuth();
	const { view } = useView(user);
	if (!user)
		return (
			<div className="pt-8">
				<Skeleton className="w-full h-80" />
			</div>
		);
	if (view === "card") return <AssignmentsCard />;
	if (view === "table") return <AssignmentsTable />;
	if (view === "both")
		return (
			<Tabs defaultValue="table" className="w-full pt-8">
				<TabsList className="grid w-full grid-cols-2 max-w-xs">
					<TabsTrigger value="table">Table view</TabsTrigger>
					<TabsTrigger value="card">Cards view</TabsTrigger>
				</TabsList>
				<TabsContent value="table">
					<AssignmentsTable />
				</TabsContent>
				<TabsContent value="card">
					<AssignmentsCard />
				</TabsContent>
			</Tabs>
		);
	return <></>;
};

export default Assignments;
