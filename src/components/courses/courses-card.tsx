import { AspectRatio } from "@/components/aspect-ratio";
import { Badge } from "@/components/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { Skeleton } from "@/components/skeleton";
import { Course0Schema } from "@/models/cms/course-0";
import { Subject0Schema } from "@/models/cms/subject-0";
import { ArrowRightToLine } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import qs from "qs";
import { FC, useCallback, useMemo } from "react";
import { useQuery } from "react-query";
import { z } from "zod";

const useCourse = (courseId: string) => {
	const endpoint = `/api/courses/${courseId}${qs.stringify(
		{ depth: 0 },
		{ addQueryPrefix: true }
	)}`;
	const { data: course } = useQuery(
		endpoint,
		async () => {
			const resp = await fetch(endpoint);
			return Course0Schema.parse(await resp.json());
		},
		{ useErrorBoundary: true }
	);
	return { course };
};

const useSubject = (course: Course0Schema | undefined) => {
	const endpoint = useMemo(() => {
		if (!course) return "";
		return `/api/subjects/${course.subject}${qs.stringify(
			{ depth: 0 },
			{ addQueryPrefix: true }
		)}`;
	}, [course]);
	const fetchSubject = useCallback(async () => {
		if (endpoint === "") return;
		const resp = await fetch(endpoint);
		return Subject0Schema.parse(await resp.json());
	}, [endpoint]);
	const { data: subject } = useQuery(endpoint, fetchSubject);
	return { subject };
};

const useLocation = (course: Course0Schema | undefined) => {
	const endpoint = useMemo(() => {
		if (!course) return "";
		return `/api/locations/${course.location}${qs.stringify(
			{ depth: 0 },
			{ addQueryPrefix: true }
		)}`;
	}, [course]);
	const fetchSubject = useCallback(async () => {
		if (endpoint === "") return;
		const resp = await fetch(endpoint);
		return Subject0Schema.parse(await resp.json());
	}, [endpoint]);
	const { data: location } = useQuery(endpoint, fetchSubject);
	return { location };
};

interface CoursesCardProps {
	courseId: string;
}

const Cards: FC<CoursesCardProps> = (props) => {
	const { course } = useCourse(props.courseId);
	const { subject } = useSubject(course);
	const { location } = useLocation(course);
	return (
		<Card className="rounded-lg flex max-h-80 w-full hover:bg-muted">
			<div className="h-full w-80 relative">
				<AspectRatio ratio={5 / 4} className="bg-muted">
					<Image
						src="https://cdn.leonardo.ai/users/ff3b8a94-d4d5-4d40-b6a6-07261a0346e5/generations/f1ff3ab4-23e9-438c-bac7-8ba6b0b11c6b/variations/Default_illustration_of_a_learning_management_system_0_f1ff3ab4-23e9-438c-bac7-8ba6b0b11c6b_1.jpg"
						alt=""
						fill
						className="rouned-md object-cover"
					/>
				</AspectRatio>
			</div>
			<CardHeader className="flex flex-col w-full">
				<div className="flex w-full justify-between items-center">
					{course ? (
						<CardTitle>{course.title}</CardTitle>
					) : (
						<Skeleton className="w-32 h-12 rounded-lg" />
					)}
					<ArrowRightToLine className="w-7 h-7" />
				</div>
				<CardContent className="flex flex-col justify-between h-full">
					<div className="flex flex-wrap">
						<div className="pr-2">
							{course && subject ? (
								<Badge variant="default">{subject.name}</Badge>
							) : (
								<Skeleton className="h-10 w-16 rounded-lg" />
							)}
						</div>
						<div className="pr-2">
							{course && location ? (
								<Badge variant="secondary">
									{location.name}
								</Badge>
							) : (
								<Skeleton className="h-10 w-16 rounded-lg" />
							)}
						</div>
					</div>
				</CardContent>
			</CardHeader>
		</Card>
	);
};

const useCourses = () => {
	const endpoint = `/api/courses${qs.stringify(
		{ depth: 0, limit: 1000 },
		{ addQueryPrefix: true }
	)}`;

	const fetchCourses = useCallback(async () => {
		const resp = await fetch(endpoint);
		const body = await resp.json();
		return z.array(Course0Schema).parse(body.docs);
	}, [endpoint]);

	const { data: courses } = useQuery(endpoint, fetchCourses, {
		useErrorBoundary: true
	});
	return { courses };
};

export const CoursesCard: FC = () => {
	const { courses } = useCourses();
	return (
		<div className="grid gap-4 pt-8">
			{courses ? (
				courses.length > 0 ? (
					courses.map((course) => (
						<Link href={`/courses/${course.id}`} key={course.id}>
							<Cards courseId={course.id} />
						</Link>
					))
				) : (
					<div className="w-full h-80 border-2 border-dashed flex justify-center items-center text-lg">
						No courses
					</div>
				)
			) : (
				<Skeleton className="w-full h-80" />
			)}
		</div>
	);
};
