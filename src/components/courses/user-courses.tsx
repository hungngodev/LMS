import { AspectRatio } from "@/components/aspect-ratio";
import { Badge } from "@/components/badge";
import { Card, CardContent, CardHeader } from "@/components/card";
import { Skeleton } from "@/components/skeleton";
import { Header2 } from "@/components/typography/h2";
import { Header3 } from "@/components/typography/h3";
import { useAuth } from "@/hooks/use-auth";
import { Course1Schema } from "@/models/cms/course-1";
import { User2Schema } from "@/models/cms/user-2";
import { ArrowRightToLine } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Where } from "payload/types";
import qs from "qs";
import { FC, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { z } from "zod";

const useUserCoursesQuery = (user: User2Schema | null) => {
	const [userCourseQuery, setUserCourseQuery] = useState<Where | {}>({});
	useEffect(() => {
		if (!user) return;
		setUserCourseQuery({
			members: {
				contains: user.id
			}
		});
	}, [user]);
	return userCourseQuery;
};

const CourseCard: FC<{ course: Course1Schema }> = ({ course }) => {
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
					<Header3>{course.title}</Header3>
					<ArrowRightToLine className="w-7 h-7" />
				</div>
				<CardContent className="flex flex-col justify-between h-full">
					<div className="flex flex-wrap">
						<div className="pr-2">
							<Badge variant="default">
								{course.subject.name}
							</Badge>
						</div>
						<div className="pr-2">
							<Badge variant="secondary">
								{course.location.name}
							</Badge>
						</div>
					</div>
				</CardContent>
			</CardHeader>
		</Card>
	);
};

export const UserCourses: FC = () => {
	const { user } = useAuth();

	const userCourseQuery = useUserCoursesQuery(user);

	const { data: userCourses } = useQuery(
		`/api/courses${qs.stringify(
			{ where: userCourseQuery, depth: 1 },
			{ addQueryPrefix: true }
		)}`,
		async () => {
			const resp = await fetch(
				`/api/courses${qs.stringify(
					{ where: userCourseQuery, depth: 1 },
					{ addQueryPrefix: true }
				)}`
			);
			const body = await resp.json();
			const courses = z.array(Course1Schema).optional().parse(body.docs);
			return courses;
		},
		{ enabled: JSON.stringify(userCourseQuery) !== "{}" }
	);

	return (
		<div className="px-6 py-4">
			{user ? (
				<header>
					<Header2>My Courses</Header2>
				</header>
			) : (
				<Skeleton className=" w-full h-10 rounded-lg" />
			)}
			<div className="grid gap-4 pt-8">
				{userCourses ? (
					userCourses.length > 0 ? (
						userCourses.map((course) => (
							<Link
								href={`/courses/${course.id}`}
								key={course.id}
							>
								<CourseCard course={course} />
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
		</div>
	);
};
