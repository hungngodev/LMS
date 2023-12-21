import { Badge } from "@/components/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { CourseAssignmentCardDetail } from "@/components/courses/course/assignments/assignment-card-detail";
import { Skeleton } from "@/components/skeleton";
import { Header3 } from "@/components/typography/h3";
import { Header4 } from "@/components/typography/h4";
import { useCourseAssignments } from "@/hooks/assignments/use-course-assignments";
import { useCourse } from "@/hooks/courses/use-course";
import { useGrades } from "@/hooks/grades/use-grades";
import { useSubmissions } from "@/hooks/submissions/use-submissions";
import { useSubmissionsGrade } from "@/hooks/submissions/use-submissions-grade";
import { useAuth } from "@/hooks/use-auth";
import { Assignment0Schema } from "@/models/cms/assignment-0";
import { Course0Schema } from "@/models/cms/course-0";
import { Grade1Schema } from "@/models/cms/grade-1";
import { User2Schema } from "@/models/cms/user-2";
import { ViewEnum } from "@/payload/models/view-enum";
import { getUserAllowedViews } from "@/payload/utils/get-user-allowed-views";
import { jsDateToDateMonthHourMinute } from "@/utils/js-date-to-date-month-hour-minute";
import { ClockIcon } from "lucide-react";
import React, {
	Dispatch,
	FC,
	SetStateAction,
	useEffect,
	useState
} from "react";

export const CourseAssignmentsCard: React.FC<{ courseId: string }> = ({
	courseId
}) => {
	const { assignments } = useCourseAssignments(courseId);
	const { course, refetchCourse } = useCourse(courseId);
	const [showingAssignmentDetailId, setShowingAssignmentDetailId] = useState<
		string | null
	>(null);

	if (assignments == undefined || course == undefined) {
		return <Skeleton className="w-full h-12 rounded-lg" />;
	} else if (assignments.length == 0) {
		return (
			<div className="w-full h-80 border-2 border-dashed flex flex-col justify-center items-center">
				<Header4>No assignments</Header4>
			</div>
		);
	} else if (assignments.length > 0) {
		return (
			<>
				{assignments.map((assignment) => (
					<CourseAssignmentCard
						showingAssignmentDetailId={showingAssignmentDetailId}
						setShowingAssignmentDetailId={
							setShowingAssignmentDetailId
						}
						assignment={assignment}
						course={course}
						key={assignment.id}
					/>
				))}
			</>
		);
	}
};

const useView = (user: User2Schema | null) => {
	const [showTitle, setShowTitle] = useState(false);
	const [showDueAt, setShowDueAt] = useState(false);
	const [showSubmissionsStatus, setShowSubmissionStatus] = useState(false);
	const [showAssignmentGradesStatus, setShowAssignmentGradesStatus] =
		useState(false);
	const [showSubmissionsGradeStatus, setShowSubmissionsGradeStatus] =
		useState(false);
	const [showDetailSheet, setShowDetailSheet] = useState(false);
	useEffect(() => {
		if (!user) return;
		const views = getUserAllowedViews(user);
		setShowTitle(
			views.has(ViewEnum["courses:course:assignments:card:title"])
		);
		setShowDueAt(
			views.has(ViewEnum["courses:course:assignments:card:dueAt"])
		);
		setShowSubmissionStatus(
			views.has(
				ViewEnum["courses:course:assignments:card:submissionsStatus"]
			)
		);
		setShowAssignmentGradesStatus(
			views.has(
				ViewEnum[
					"courses:course:assignments:card:assignmentGradesStatus"
				]
			)
		);
		setShowSubmissionStatus(
			views.has(
				ViewEnum["courses:course:assignments:card:submissionsStatus"]
			)
		);
		setShowSubmissionsGradeStatus(
			views.has(
				ViewEnum[
					"courses:course:assignments:card:submissionsGradeStatus"
				]
			)
		);
		setShowDetailSheet(
			views.has(ViewEnum["courses:course:assignments:card:detail"])
		);
	}, [user]);
	return {
		showTitle,
		showDueAt,
		showSubmissionsStatus,
		showAssignmentGradesStatus,
		showSubmissionsGradeStatus,
		showDetailSheet
	};
};

const DueAtBadge: FC<{
	assignment: Assignment0Schema;
}> = ({ assignment }) => {
	return (
		<>
			{assignment?.dueAt ? (
				<div className="flex items-center">
					<ClockIcon className="h-5 w-5 mr-2" />
					Due At:{" "}
					{jsDateToDateMonthHourMinute(new Date(assignment.dueAt))}
				</div>
			) : (
				<Skeleton className="w-full h-12 rounded-lg" />
			)}
		</>
	);
};

const SubmissionsStatusBadge: FC<{
	assignment: Assignment0Schema | undefined;
}> = ({ assignment }) => {
	const { user } = useAuth();
	const { submissions } = useSubmissions(assignment?.id, user);
	if (submissions == undefined || assignment == undefined)
		return <Skeleton />;
	else if (submissions.length == 0 && new Date(assignment.dueAt) < new Date())
		return <Badge variant={"secondary"}>Not submitted</Badge>;
	else if (submissions.length == 0 && new Date(assignment.dueAt) > new Date())
		return <Badge variant={"destructive"}>Not submitted - Late</Badge>;
	else if (
		submissions.length > 0 &&
		new Date(submissions[0].createdAt) > new Date(assignment.dueAt)
	)
		return <Badge variant={"secondary"}>Submitted - Late</Badge>;
	else if (
		submissions.length > 0 &&
		new Date(submissions[0].createdAt) < new Date(assignment.dueAt)
	)
		return <Badge variant={"secondary"}>Submitted - On time</Badge>;
};

const useGradesCount = (grades: Grade1Schema[] | undefined) => {
	if (grades == undefined) {
		return { gradesCount: undefined };
	}
	const uniqueGrade: string[] = [];
	let count = 0;
	for (let i = 0; i < grades.length; i++) {
		if (!uniqueGrade.includes(grades[i].submission.createdBy)) {
			count++;
			uniqueGrade.push(grades[i].submission.createdBy);
		}
	}
	return { gradesCount: count };
};

const AssignmentGradesStatus: FC<{
	assignment: Assignment0Schema;
	course: Course0Schema;
}> = ({ assignment, course }) => {
	const { grades, refetchGrades } = useGrades(assignment.id);
	const { gradesCount } = useGradesCount(grades);

	if (gradesCount == undefined)
		return <Skeleton className="w-full h-12 rounded-lg" />;
	else if (gradesCount == course.members?.length ?? 0)
		return (
			<Badge variant={"secondary"}>
				{gradesCount}/{course.members?.length ?? 0} - all graded
			</Badge>
		);
	else if (gradesCount == course.members?.length ?? 0)
		return (
			<Badge variant={"secondary"}>
				{gradesCount}/{course.members?.length ?? 0} -{" "}
				{course.members?.length ?? 0 - gradesCount} ungraded
			</Badge>
		);
};

const SubmissionsGradeStatus: FC<{
	assignment: Assignment0Schema;
}> = ({ assignment }) => {
	const { user } = useAuth();
	const { submissions } = useSubmissionsGrade(assignment.id, user);

	if (submissions == undefined)
		return <Skeleton className="w-full h-12 rounded-lg" />;
	else if (submissions.length == 0)
		return <Badge variant={"secondary"}>Not graded</Badge>;
	else if (submissions.length > 0)
		return <Badge variant={"secondary"}>Graded</Badge>;
};

interface CourseAssignmentsCardComponentProps {
	showingAssignmentDetailId: string | null;
	setShowingAssignmentDetailId: Dispatch<SetStateAction<string | null>>;
	assignment: Assignment0Schema;
	course: Course0Schema;
}

const CourseAssignmentCard: React.FC<CourseAssignmentsCardComponentProps> = ({
	showingAssignmentDetailId,
	setShowingAssignmentDetailId,
	assignment,
	course
}) => {
	const { user } = useAuth();
	const {
		showTitle,
		showDueAt,
		showSubmissionsStatus,
		showAssignmentGradesStatus,
		showSubmissionsGradeStatus,
		showDetailSheet
	} = useView(user);
	return (
		<>
			<Card
				className="rounded-lg flex max-h-80 w-full hover:bg-muted"
				key={assignment.id}
			>
				<div className="flex flex-col w-full">
					{showTitle && (
						<CardHeader>
							<div className="flex w-full justify-between items-center">
								<CardTitle>
									<Header3>{course.title}</Header3>
								</CardTitle>
							</div>
						</CardHeader>
					)}
					<CardContent className="flex flex-col justify-between h-full">
						{showDueAt && <DueAtBadge assignment={assignment} />}
						{showSubmissionsStatus && (
							<SubmissionsStatusBadge assignment={assignment} />
						)}
						{showAssignmentGradesStatus && (
							<AssignmentGradesStatus
								assignment={assignment}
								course={course}
							/>
						)}
						{showSubmissionsGradeStatus && (
							<SubmissionsGradeStatus assignment={assignment} />
						)}
					</CardContent>
				</div>
			</Card>
			{showDetailSheet && (
				<CourseAssignmentCardDetail
					showingAssignmentDetailId={showingAssignmentDetailId}
					setShowingAssignmentDetailId={setShowingAssignmentDetailId}
					assignmentId={assignment.id}
					course={course}
				/>
			)}
		</>
	);
};
