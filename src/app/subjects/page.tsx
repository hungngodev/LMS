"use client";

import { Skeleton } from "@/components/skeleton";
import { SubjectsCard } from "@/components/subjects/subjects-card";
import { SubjectsTable } from "@/components/subjects/subjects-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/tabs";
import { useAuth } from "@/hooks/use-auth";
import { User2Schema } from "@/models/cms/user-2";
import { ViewEnum } from "@/payload/models/view-enum";
import { getUserAllowedViews } from "@/payload/utils/get-user-allowed-views";
import { FC, useEffect, useState } from "react";

const useViews = (user: User2Schema | null) => {
	const [subjectView, setSubjectView] = useState<
		"card" | "table" | "both" | null
	>(null);
	useEffect(() => {
		if (!user) return;
		const views = getUserAllowedViews(user);
		// if user only has read permission
		if (
			views.has(ViewEnum["subjects:table"]) &&
			views.has(ViewEnum["subjects:card"])
		) {
			setSubjectView("both");
		} else if (
			views.has(ViewEnum["subjects:table"]) &&
			!views.has(ViewEnum["subjects:card"])
		) {
			setSubjectView("table");
		} else if (
			!views.has(ViewEnum["subjects:table"]) &&
			views.has(ViewEnum["subjects:card"])
		) {
			setSubjectView("card");
		} else setSubjectView(null);
	}, [user]);
	return { subjectView };
};

const Subjects: FC = () => {
	const { user } = useAuth();
	const { subjectView } = useViews(user);
	if (!user)
		return (
			<div className="pt-8">
				<Skeleton className="w-full h-80" />
			</div>
		);
	if (subjectView === "card") return <SubjectsCard />;
	if (subjectView === "table") return <SubjectsTable />;
	if (subjectView === "both")
		return (
			<Tabs defaultValue="table" className="w-full pt-8">
				<TabsList className="grid w-full grid-cols-2 max-w-xs">
					<TabsTrigger value="table">Table view</TabsTrigger>
					<TabsTrigger value="card">Cards view</TabsTrigger>
				</TabsList>
				<TabsContent value="table">
					<SubjectsTable />
				</TabsContent>
				<TabsContent value="card">
					<SubjectsCard />
				</TabsContent>
			</Tabs>
		);
};

export default Subjects;
