import { CourseNav } from "@/components/course-nav/course-nav";
import { CourseHeader } from "@/components/courses/course/course-header";
import { ReactNode } from "react";

export default function Layout({
	children,
	params
}: {
	children: ReactNode;
	params: { courseId: string };
}) {
	return (
		<>
			<CourseNav courseId={params.courseId} />
			<main className="lg:pl-60 pl-0 lg:pt-0">
				<div className="px-6 py-4 space-y-8">
					<CourseHeader courseId={params.courseId} />
					{children}
				</div>
			</main>
		</>
	);
}
