import { Button } from "@/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { CreateAssignmentForm } from "@/components/forms/create-assignment-form";
import { Skeleton } from "@/components/skeleton";
import { useAllCourseAssignmentsCount } from "@/hooks/assignments/use-all-course-assignments-count";
import { usePastCourseAssignmentsCount } from "@/hooks/assignments/use-past-course-assignments-count";
import { useSubmittedCourseAssignmentsCount } from "@/hooks/assignments/use-submitted-course-assignments-count";
import { useUpcomingCourseAssignmentsCount } from "@/hooks/assignments/use-upcoming-course-assignments-count";
import { useAuth } from "@/hooks/use-auth";
import { User2Schema } from "@/models/cms/user-2";
import { ViewEnum } from "@/payload/models/view-enum";
import { getUserAllowedViews } from "@/payload/utils/get-user-allowed-views";
import { ClipboardListIcon } from "lucide-react";
import Link from "next/link";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";

const useViews = (user: User2Schema | null) => {
	const [showAllCount, setShowAllCount] = useState<boolean>(false);
	const [showUpcomingCount, setShowUpcomingCount] = useState<boolean>(false);
	const [showPastCount, setShowPastCount] = useState<boolean>(false);
	const [showSubmittedCount, setShowSubmittedCount] =
		useState<boolean>(false);

	const [showCreate, setShowCreate] = useState<boolean>(false);
	useEffect(() => {
		if (!user) return;
		const views = getUserAllowedViews(user);
		setShowAllCount(
			views.has(ViewEnum["courses:course:dashboard:assignments:allCount"])
		);
		setShowUpcomingCount(
			views.has(
				ViewEnum["courses:course:dashboard:assignments:upcomingCount"]
			)
		);
		setShowPastCount(
			views.has(
				ViewEnum["courses:course:dashboard:assignments:pastCount"]
			)
		);
		setShowSubmittedCount(
			views.has(
				ViewEnum["courses:course:dashboard:assignments:submittedCount"]
			)
		);
		setShowCreate(
			views.has(ViewEnum["courses:course:dashboard:assignments:create"])
		);
	}, [user]);
	return {
		showAllCount,
		showUpcomingCount,
		showPastCount,
		showSubmittedCount,
		showCreate
	};
};

interface AssignmentsCountProps {
	courseId: string;
	triggerRefetch: boolean;
	setTriggerRefetch: Dispatch<SetStateAction<boolean>>;
}

const AssignmentsAllCount: FC<AssignmentsCountProps> = (props) => {
	const { count, refetchCount } = useAllCourseAssignmentsCount(
		props.courseId
	);
	useEffect(() => {
		refetchCount();
		// intentionally leave out refetch since it wont change as a dep
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.triggerRefetch]);
	if (count !== undefined) return <div>Total: {count}</div>;
	else return <Skeleton className="h-12 w-32 rounded-lg" />;
};

const AssignmentsUpcomingCount: FC<AssignmentsCountProps> = (props) => {
	const { count, refetchCount } = useUpcomingCourseAssignmentsCount(
		props.courseId
	);
	useEffect(() => {
		refetchCount();
		// intentionally leave out refetch since it wont change as a dep
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.triggerRefetch]);
	if (count !== undefined) return <div>Upcoming: {count}</div>;
	else return <Skeleton className="h-12 w-32 rounded-lg" />;
};

const AssignmentsPastCount: FC<AssignmentsCountProps> = (props) => {
	const { count, refetchCount } = usePastCourseAssignmentsCount(
		props.courseId
	);
	useEffect(() => {
		refetchCount();
		// intentionally leave out refetch since it wont change as a dep
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.triggerRefetch]);
	if (count !== undefined) return <div>Past: {count}</div>;
	else return <Skeleton className="h-12 w-32 rounded-lg" />;
};

const AssignmentsSubmittedCount: FC<AssignmentsCountProps> = (props) => {
	const { user } = useAuth();
	const { count, refetchCount } = useSubmittedCourseAssignmentsCount(
		props.courseId,
		user
	);
	useEffect(() => {
		refetchCount();
		// intentionally leave out refetch since it wont change as a dep
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.triggerRefetch]);
	if (count !== undefined) return <div>Submitted: {count}</div>;
	else return <Skeleton className="h-12 w-32 rounded-lg" />;
};

const AssignmentsView: FC<{ courseId: string }> = ({ courseId }) => {
	return (
		<Link href={`/courses/${courseId}/assignments`}>
			<Button className="w-full">View</Button>
		</Link>
	);
};

interface Props {
	courseId: string;
}

export const AssignmentsCard: FC<Props> = (props) => {
	const { user } = useAuth();
	const {
		showAllCount,
		showUpcomingCount,
		showPastCount,
		showSubmittedCount,
		showCreate
	} = useViews(user);
	const [triggerRefetch, setTriggerRefetch] = useState<boolean>(false);
	const [showingCreateForm, setShowingCreateForm] = useState<boolean>(false);

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-md font-medium">
					Assignments
				</CardTitle>
				<ClipboardListIcon className="h-6 w-6 text-muted-foreground" />
			</CardHeader>
			<CardContent className="flex flex-col space-y-4 w-full">
				<div className="flex flex-col">
					{showAllCount && (
						<AssignmentsAllCount
							courseId={props.courseId}
							triggerRefetch={triggerRefetch}
							setTriggerRefetch={setTriggerRefetch}
						/>
					)}
					{showUpcomingCount && (
						<AssignmentsUpcomingCount
							courseId={props.courseId}
							triggerRefetch={triggerRefetch}
							setTriggerRefetch={setTriggerRefetch}
						/>
					)}
					{showPastCount && (
						<AssignmentsPastCount
							courseId={props.courseId}
							triggerRefetch={triggerRefetch}
							setTriggerRefetch={setTriggerRefetch}
						/>
					)}
					{showSubmittedCount && (
						<AssignmentsSubmittedCount
							courseId={props.courseId}
							triggerRefetch={triggerRefetch}
							setTriggerRefetch={setTriggerRefetch}
						/>
					)}
				</div>
				{showAllCount && <AssignmentsView courseId={props.courseId} />}
				{showCreate && (
					<Button
						className="w-full"
						onClick={() => setShowingCreateForm(true)}
					>
						Create
					</Button>
				)}
			</CardContent>
			{showingCreateForm && (
				<CreateAssignmentForm
					courseId={props.courseId}
					refetchAssignments={async () => {}}
					open={showingCreateForm}
					setOpen={setShowingCreateForm}
				/>
			)}
		</Card>
	);
};
