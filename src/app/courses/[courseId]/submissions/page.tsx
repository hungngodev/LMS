"use client";
import { CourseSubmissionsTable } from "@/components/courses/course/submissions/course-submission-table";
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
			views.has(ViewEnum["courses:course:submissions:table"]) &&
			views.has(ViewEnum["courses:course:submissions:card"])
		) {
			setView("both");
		} else if (
			!views.has(ViewEnum["courses:course:submissions:table"]) &&
			views.has(ViewEnum["courses:course:submissions:card"])
		) {
			setView("both");
		} else if (
			views.has(ViewEnum["courses:course:submissions:table"]) &&
			!views.has(ViewEnum["courses:course:submissions:card"])
		) {
			setView("table");
		} else setView("both");
	}, [user]);
	return { view };
};
export interface CourseProps {}

const CourseDetail: FC<CourseProps & { params: { courseId: string } }> = (
	props
) => {
	const { user } = useAuth();
	const { view } = useView(user);
	if (!user) return <Skeleton className="w-full h-80 rounded-lg mt-4" />;
	if (view === "card") return;
	if (view === "table") return;
	if (view === "both")
		return (
			<Tabs defaultValue="table" className="w-full pt-8">
				<TabsList className="grid w-full grid-cols-2 max-w-xs">
					<TabsTrigger value="table">Table view</TabsTrigger>
					<TabsTrigger value="card">Cards view</TabsTrigger>
				</TabsList>
				<TabsContent value="table">
					<CourseSubmissionsTable courseId={props.params.courseId} />
				</TabsContent>
			</Tabs>
		);
	return <></>;
};

export default CourseDetail;
