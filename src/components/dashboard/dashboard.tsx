import { AssignmentsCard } from "@/components/dashboard/assignments-card";
import { CoursesCard } from "@/components/dashboard/courses-card";
import { GradesCard } from "@/components/dashboard/grades-card";
import { ImitateRoleCard } from "@/components/dashboard/imitate-role-card";
import { RolesCard } from "@/components/dashboard/roles-card";
import { SubmissionsCard } from "@/components/dashboard/submissions-card";
import { UsersRoleCards } from "@/components/dashboard/users-role-cards";
import { Header2 } from "@/components/typography/h2";
import { useAuth } from "@/hooks/use-auth";
import { User2Schema } from "@/models/cms/user-2";
import { ViewEnum } from "@/payload/models/view-enum";
import { getUserAllowedViews } from "@/payload/utils/get-user-allowed-views";
import { FC, useEffect, useState } from "react";

const useShowCards = (user: User2Schema | null) => {
	const [showImitateRolesCard, setShowImitateRolesCard] =
		useState<boolean>(false);
	const [showRolesCard, setShowRolesCard] = useState<boolean>(false);
	const [showCoursesCard, setShowCoursesCard] = useState<boolean>(false);
	const [showAssignmentsCard, setShowAssignmentsCard] =
		useState<boolean>(false);
	const [showSubmissionsCard, setShowSubmissionsCard] =
		useState<boolean>(false);
	const [showGradesCard, setShowGradesCard] = useState<boolean>(false);

	useEffect(() => {
		if (!user) return;
		const views = getUserAllowedViews(user);
		setShowImitateRolesCard(views.has(ViewEnum["dashboard:imitate"]));
		setShowRolesCard(views.has(ViewEnum["dashboard:roles"]));
		setShowCoursesCard(views.has(ViewEnum["dashboard:courses"]));
		setShowAssignmentsCard(views.has(ViewEnum["dashboard:assignments"]));
		setShowSubmissionsCard(views.has(ViewEnum["dashboard:submissions"]));
		setShowGradesCard(views.has(ViewEnum["dashboard:grades"]));
	}, [user]);
	return {
		showImitateRolesCard,
		showRolesCard,
		showCoursesCard,
		showAssignmentsCard,
		showSubmissionsCard,
		showGradesCard
	};
};

export const Dashboard: FC = () => {
	const { user } = useAuth();
	const {
		showImitateRolesCard,
		showRolesCard,
		showCoursesCard,
		showAssignmentsCard,
		showSubmissionsCard,
		showGradesCard
	} = useShowCards(user);
	return (
		<div className="px-6 py-4">
			<header>
				<Header2>Dashboard</Header2>
			</header>
			<div className="grid gap-4 lg:grid-cols-4 md:grid-cols-2 pt-8">
				{showImitateRolesCard && <ImitateRoleCard />}
				{showRolesCard && <RolesCard />}
				<UsersRoleCards />
				{showCoursesCard && <CoursesCard />}
				{showAssignmentsCard && <AssignmentsCard />}
				{showSubmissionsCard && <SubmissionsCard />}
				{showGradesCard && <GradesCard />}
			</div>
		</div>
	);
};
