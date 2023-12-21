"use client";

import { Skeleton } from "@/components/skeleton";
import { Header2 } from "@/components/typography/h2";
import { useCourse } from "@/hooks/courses/use-course";
import { FC } from "react";

interface Props {
	courseId: string;
}

export const CourseHeader: FC<Props> = (props) => {
	const { course } = useCourse(props.courseId);
	if (!course) return <Skeleton className="h-12 w-full rounded-lg" />;
	else
		return (
			<header>
				<Header2>{course.title}</Header2>
			</header>
		);
};
