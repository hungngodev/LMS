"use client";

import { CourseDashboard } from "@/components/courses/course/dashboard/course-dashboard";
import { Skeleton } from "@/components/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { FC } from "react";

export interface CourseProps { }

export type ViewState = "calendar" | "students";

const CourseDetail: FC<CourseProps & { params: { courseId: string } }> = (
	props
) => {
	const { user } = useAuth();
	if (!user) return <Skeleton className="w-full h-80 rounded-lg" />;
	return <CourseDashboard courseId={props.params.courseId} />;
};

export default CourseDetail;