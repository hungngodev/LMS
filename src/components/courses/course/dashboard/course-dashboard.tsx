import { AssignmentsCard } from "@/components/courses/course/dashboard/assignments-card";
import { GradesCard } from "@/components/courses/course/dashboard/grades-card";
import { MembersCard } from "@/components/courses/course/dashboard/members-card";
import { SessionsCard } from "@/components/courses/course/dashboard/sessions-card";
import { SubmissionsCard } from "@/components/courses/course/dashboard/submissions-card";
import { useAuth } from "@/hooks/use-auth";
import { User2Schema } from "@/models/cms/user-2";
import { ViewEnum } from "@/payload/models/view-enum";
import { getUserAllowedViews } from "@/payload/utils/get-user-allowed-views";
import { FC, useEffect, useState } from "react";
import { MemberRolesCard } from "./members-role-card";

const useViews = (user: User2Schema | null) => {
	const [showAssignmentsCard, setShowAssignmentsCard] =
		useState<boolean>(false);
	const [showSubmissionsCard, setShowSubmissionsCard] =
		useState<boolean>(false);
	const [showGradesCard, setShowGradesCard] = useState<boolean>(false);
	const [showMembersCard, setShowMembersCard] = useState<boolean>(false);
	const [showSessionsCard, setShowSessionsCard] = useState<boolean>(false);
	const [showDocumentsCard, setShowDocumentsCard] = useState<boolean>(false);
	useEffect(() => {
		if (!user) return;
		const views = getUserAllowedViews(user);
		setShowAssignmentsCard(
			views.has(ViewEnum["courses:course:dashboard:assignments"])
		);
		setShowSubmissionsCard(
			views.has(ViewEnum["courses:dashboard:submissions"])
		);
		setShowGradesCard(views.has(ViewEnum["courses:dashboard:grades"]));
		setShowMembersCard(views.has(ViewEnum["courses:dashboard:members"]));
		setShowSessionsCard(views.has(ViewEnum["courses:dashboard:sessions"]));
		setShowDocumentsCard(
			views.has(ViewEnum["courses:dashboard:documents"])
		);
	}, [user]);
	return {
		showAssignmentsCard,
		showSubmissionsCard,
		showGradesCard,
		showMembersCard,
		showSessionsCard,
		showDocumentsCard
	};
};

interface Props {
	courseId: string;
}

export const CourseDashboard: FC<Props> = (props) => {
	const { user } = useAuth();
	const views = useViews(user);
	return (
		<div className="grid gap-4 lg:grid-cols-4 md:grid-cols-2">
			{views.showAssignmentsCard && (
				<AssignmentsCard courseId={props.courseId} />
			)}
			{views.showSubmissionsCard && (
				<SubmissionsCard courseId={props.courseId} />
			)}
			{views.showGradesCard && <GradesCard courseId={props.courseId} />}
			{views.showMembersCard && <MembersCard courseId={props.courseId} />}
			{views.showSessionsCard && (
				<SessionsCard courseId={props.courseId} />
			)}
			{/* {views.showDocumentsCard && (
				<DocumentsCard courseId={props.courseId} />
			)} */}
			<MemberRolesCard courseId={props.courseId} />
		</div>
	);
};
