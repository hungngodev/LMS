import { Button } from "@/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { AddMemberForm } from "@/components/courses/course/dashboard/add-member-form";
import { Skeleton } from "@/components/skeleton";
import { Header4 } from "@/components/typography/h4";
import { useCourse } from "@/hooks/courses/use-course";
import { useCourseMembersRoleCount } from "@/hooks/courses/use-course-members-role-count";
import { useAuth } from "@/hooks/use-auth";
import { Course0Schema } from "@/models/cms/course-0";
import { Role0Schema } from "@/models/cms/role-0";
import { User2Schema } from "@/models/cms/user-2";
import { getUserAllowedViews } from "@/payload/utils/get-user-allowed-views";
import { UserIcon } from "lucide-react";
import Link from "next/link";
import qs from "qs";
import { FC, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { z } from "zod";

const useRoles = () => {
	const endpoint = `/api/roles${qs.stringify(
		{ depth: 0, limit: 1000 },
		{ addQueryPrefix: true }
	)}`;
	const { data: roles } = useQuery(endpoint, async () => {
		const resp = await fetch(endpoint);
		const body = await resp.json();
		return z.array(Role0Schema).parse(body.docs);
	});
	return { roles };
};

const useViews = (user: User2Schema | null, role: Role0Schema) => {
	const [showCount, setShowCount] = useState<boolean>(false);
	const [showAdd, setShowAdd] = useState<boolean>(false);
	useEffect(() => {
		if (!user) return;
		const views = getUserAllowedViews(user);
		setShowCount(views.has(`courses:dashboard:members:${role.iamName}`));
		setShowAdd(views.has(`courses:dashboard:members:${role.iamName}`));
	}, [role, user]);
	return { showCount, showAdd };
};

const RoleCard: FC<{
	role: Role0Schema;
	course: Course0Schema;
	refetchCourse: () => Promise<void>;
}> = ({ role, course, refetchCourse }) => {
	const { user } = useAuth();
	const { showAdd, showCount } = useViews(user, role);
	const { count } = useCourseMembersRoleCount(course, role);
	const MembersRoleCount: FC = () => {
		if (count !== undefined) return <Header4>{count}</Header4>;
		else return <Skeleton className="h-12 w-32 rounded-lg" />;
	};
	const MembersRoleView: FC = () => {
		return (
			<Link
				href={`/courses/${course.id}/members${qs.stringify(
					{ role: role.name },
					{ addQueryPrefix: true }
				)}`}
			>
				<Button className="w-full">View</Button>
			</Link>
		);
	};
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-md font-medium">
					{role.name}
				</CardTitle>
				<UserIcon className="h-6 w-6 text-muted-foreground" />
			</CardHeader>
			<CardContent className="flex flex-col space-y-4 w-full">
				{showCount && <MembersRoleCount />}
				{showCount && <MembersRoleView />}
				{showAdd && (
					<AddMemberForm
						defaultRoleId={role.id}
						courseId={course.id}
						refetchCourse={refetchCourse}
					/>
				)}
			</CardContent>
		</Card>
	);
};

interface Props {
	courseId: string;
}

export const MemberRolesCard: FC<Props> = (props) => {
	const { user } = useAuth();
	const { roles } = useRoles();
	const { course, refetchCourse } = useCourse(props.courseId);
	const views = user ? getUserAllowedViews(user) : null;
	if (!roles) return;
	return roles
		.filter((role) =>
			views?.has(`courses:dashboard:members:${role.iamName}`)
		)
		.map((role) =>
			!!course ? (
				<RoleCard
					key={role.id}
					role={role}
					course={course}
					refetchCourse={refetchCourse}
				/>
			) : (
				<Skeleton className="w-full h-32 rounded-lg" key={role.id} />
			)
		);
};
