"use client";

import { CoursesCard } from "@/components/courses/courses-card";
import { CoursesTable } from "@/components/courses/courses-table";
import { Skeleton } from "@/components/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/tabs";
import { Header2 } from "@/components/typography/h2";
import { useAuth } from "@/hooks/use-auth";
import { User2Schema } from "@/models/cms/user-2";
import { ViewEnum } from "@/payload/models/view-enum";
import { getUserAllowedViews } from "@/payload/utils/get-user-allowed-views";
import { FC, useEffect, useState } from "react";

/**
 * Determine which type of course view to render
 */
const useViews = (user: User2Schema | null) => {
	const [courseView, setCourseView] = useState<
		"card" | "table" | "both" | null
	>(null);
	useEffect(() => {
		if (!user) return;
		const views = getUserAllowedViews(user);
		// if user only has read permission
		if (
			views.has(ViewEnum["courses:table"]) &&
			views.has(ViewEnum["courses:card"])
		) {
			setCourseView("both");
		} else if (
			views.has(ViewEnum["courses:table"]) &&
			!views.has(ViewEnum["courses:card"])
		) {
			setCourseView("table");
		} else if (
			!views.has(ViewEnum["courses:table"]) &&
			views.has(ViewEnum["courses:card"])
		) {
			setCourseView("card");
		} else setCourseView(null);
	}, [user]);
	return { courseView };
};

const Courses: FC = () => {
	const { user } = useAuth();
	const { courseView } = useViews(user);
	return (
		<>
			{user ? (
				<div className="px-6 py-4">
					<header>
						<Header2>My Courses</Header2>
					</header>
					{courseView === "card" && <CoursesCard />}
					{courseView === "table" && <CoursesTable />}
					{courseView === "both" && (
						<Tabs defaultValue="table" className="w-full pt-8">
							<TabsList className="grid w-full grid-cols-2 max-w-xs">
								<TabsTrigger value="table">
									Table view
								</TabsTrigger>
								<TabsTrigger value="card">
									Cards view
								</TabsTrigger>
							</TabsList>
							<TabsContent value="table">
								<CoursesTable />
							</TabsContent>
							<TabsContent value="card">
								<CoursesCard />
							</TabsContent>
						</Tabs>
					)}
				</div>
			) : (
				<div className="px-6 py-4">
					<Skeleton className="w-full h-12 rounded-lg" />
					<Skeleton className="w-full h-80 rounded-lg mt-8" />
				</div>
			)}
		</>
	);
};

export default Courses;
