import { Button } from "@/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { Skeleton } from "@/components/skeleton";
import { Header4 } from "@/components/typography/h4";
import { useCourse } from "@/hooks/courses/use-course";
import { useAuth } from "@/hooks/use-auth";
import { User2Schema } from "@/models/cms/user-2";
import { ViewEnum } from "@/payload/models/view-enum";
import { getUserAllowedViews } from "@/payload/utils/get-user-allowed-views";
import { ClipboardListIcon } from "lucide-react";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { AddMemberForm } from "./add-member-form";

const useViews = (user: User2Schema | null) => {
	const [showCount, setShowCount] = useState<boolean>(false);
	const [showAdd, setShowAdd] = useState<boolean>(false);
	useEffect(() => {
		if (!user) return;
		const views = getUserAllowedViews(user);
		setShowCount(views.has(ViewEnum["courses:dashboard:members:count"]));
		setShowAdd(views.has(ViewEnum["courses:dashboard:members:add"]));
	}, [user]);
	return { showCount, showAdd };
};

interface Props {
	courseId: string;
}

export const MembersCard: FC<Props> = (props) => {
	const { user } = useAuth();
	const { showAdd, showCount } = useViews(user);
	const { course, refetchCourse } = useCourse(props.courseId);

	const MembersCount: FC = () => {
		if (course !== undefined)
			return <Header4>{course.members?.length ?? 0}</Header4>;
		else return <Skeleton className="h-12 w-32 rounded-lg" />;
	};
	const MembersView: FC = () => {
		return (
			<Link href={`/courses/${props.courseId}/members`}>
				<Button className="w-full">View</Button>
			</Link>
		);
	};

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-md font-medium">Members</CardTitle>
				<ClipboardListIcon className="h-6 w-6 text-muted-foreground" />
			</CardHeader>
			<CardContent className="flex flex-col space-y-4 w-full">
				{showCount && <MembersCount />}
				{showCount && <MembersView />}
				{showAdd && (
					<AddMemberForm
						courseId={props.courseId}
						refetchCourse={refetchCourse}
					/>
				)}
			</CardContent>
		</Card>
	);
};
