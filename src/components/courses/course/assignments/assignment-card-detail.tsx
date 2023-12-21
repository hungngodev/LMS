import { Badge } from "@/components/badge";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle
} from "@/components/sheet";
import { Skeleton } from "@/components/skeleton";
import { Paragraph } from "@/components/typography/p";
import { useAssignment } from "@/hooks/assignments/use-assignment";
import { useGrades } from "@/hooks/grades/use-grades";
import { useSubmissions } from "@/hooks/submissions/use-submissions";
import { useSubmissionsGrade } from "@/hooks/submissions/use-submissions-grade";
import { useAuth } from "@/hooks/use-auth";
import { Assignment0Schema } from "@/models/cms/assignment-0";
import { AssignmentMedia0Schema } from "@/models/cms/assignment-media-0";
import { Course0Schema } from "@/models/cms/course-0";
import { Grade1Schema } from "@/models/cms/grade-1";
import { User2Schema } from "@/models/cms/user-2";
import { ViewEnum } from "@/payload/models/view-enum";
import { getUserAllowedActions } from "@/payload/utils/get-user-allowed-actions";
import { formatBytes } from "@/utils/bytes-to-megabytes";
import { jsDateToDateMonthHourMinute } from "@/utils/js-date-to-date-month-hour-minute";
import { ClockIcon, DownloadIcon, PaperclipIcon } from "lucide-react";
import { Where } from "payload/types";
import qs from "qs";
import {
	Dispatch,
	FC,
	SetStateAction,
	useCallback,
	useEffect,
	useMemo,
	useState
} from "react";
import { useQuery } from "react-query";
import { z } from "zod";

const fetchDocuments = async (endpoint: string) => {
	if (endpoint === "") return undefined;
	const resp = await fetch(endpoint);
	const body = await resp.json();
	const documents = z.array(AssignmentMedia0Schema).parse(body.docs);
	return documents;
};

const useAssignmentDocuments = (assignment: Assignment0Schema | undefined) => {
	const documentsId = useMemo(() => {
		if (!assignment) return undefined;
		if (!assignment.documents) return [];
		return assignment.documents;
	}, [assignment]);
	const query: Where = useMemo(
		() =>
			documentsId
				? {
						id: { in: documentsId.join(",") }
				  }
				: ({} as Record<never, never>),
		[documentsId]
	);
	const endpoint = useMemo(
		() =>
			JSON.stringify(query) !== "{}"
				? `/api/assignmentsMedia${qs.stringify(
						{
							where: query,
							depth: 0,
							limit: 1000,
							sort: "-updatedAt"
						},
						{ addQueryPrefix: true }
				  )}`
				: "",
		[query]
	);
	const fetchDocumentsCb = useCallback(
		async () => await fetchDocuments(endpoint),
		[endpoint]
	);
	const { data: documents, refetch } = useQuery(endpoint, fetchDocumentsCb, {
		enabled: endpoint !== ""
	});
	return {
		documents,
		refetchDocuments: async () => {
			await refetch();
		}
	};
};

const useView = (user: User2Schema | null) => {
	const [canViewSubmissions, setCanViewSubmissions] = useState<boolean>();
	const [showTitle, setShowTitle] = useState(false);
	const [showDueAt, setShowDueAt] = useState(false);
	const [showContent, setShowContent] = useState(false);
	const [showDocuments, setShowDocuments] = useState(false);
	const [showSubmissionsStatus, setShowSubmissionStatus] = useState(false);
	const [showAssignmentGradesStatus, setShowAssignmentGradesStatus] =
		useState(false);
	const [showSubmissionsGradeStatus, setShowSubmissionsGradeStatus] =
		useState(false);
	const [showSubmissions, setShowSubmissions] = useState(false);
	const [showSubmissionsCreate, setShowSubmissionsCreate] = useState(false);
	useEffect(() => {
		if (!user) return;
		const actions = getUserAllowedActions(user);
		setShowTitle(
			actions.has(
				ViewEnum["courses:course:assignments:card:detail:title"]
			)
		);
		setShowDueAt(
			actions.has(
				ViewEnum["courses:course:assignments:card:detail:dueAt"]
			)
		);
		setShowContent(
			actions.has(
				ViewEnum["courses:course:assignments:card:detail:content"]
			)
		);
		setShowDocuments(
			actions.has(
				ViewEnum["courses:course:assignments:card:detail:documents"]
			)
		);
		setShowSubmissionStatus(
			actions.has(
				ViewEnum[
					"courses:course:assignments:card:detail:submissionsStatus"
				]
			)
		);
		setShowAssignmentGradesStatus(
			actions.has(
				ViewEnum[
					"courses:course:assignments:card:detail:assignmentGradesStatus"
				]
			)
		);
		setShowSubmissionStatus(
			actions.has(
				ViewEnum[
					"courses:course:assignments:card:detail:submissionsStatus"
				]
			)
		);
		setShowSubmissionsGradeStatus(
			actions.has(
				ViewEnum[
					"courses:course:assignments:card:detail:submissionsGradeStatus"
				]
			)
		);
		setShowSubmissions(
			actions.has(
				ViewEnum["courses:course:assignments:card:detail:submissions"]
			)
		);
		setShowSubmissionsCreate(
			actions.has(
				ViewEnum[
					"courses:course:assignments:card:detail:submissions:create"
				]
			)
		);
	}, [user]);
	return {
		showTitle,
		showDueAt,
		showContent,
		showDocuments,
		showSubmissionsStatus,
		showAssignmentGradesStatus,
		showSubmissionsGradeStatus,
		showSubmissions,
		showSubmissionsCreate
	};
};

const CourseAssignmentDetailTitle: FC<{
	assignment: Assignment0Schema | undefined;
}> = ({ assignment }) => {
	return (
		<SheetHeader className="mb-4">
			{assignment?.title ? (
				<SheetTitle>{assignment.title}</SheetTitle>
			) : (
				<Skeleton className="w-full h-12 rounded-lg max-w-xs" />
			)}
		</SheetHeader>
	);
};

const CourseAssignmentCardDetailDueAt: FC<{
	assignment: Assignment0Schema | undefined;
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

const CourseAssignmentCardDetailContent: FC<{
	assignment: Assignment0Schema | undefined;
}> = ({ assignment }) => {
	return (
		<>
			{assignment ? (
				<>
					{assignment.content ? (
						<Paragraph>{assignment.content}</Paragraph>
					) : (
						<div className="w-full h-16 flex justify-center items-center border-2 border-dashed">
							No content
						</div>
					)}
				</>
			) : (
				<Skeleton className="w-full h-32 rounded-lg" />
			)}
		</>
	);
};

const CourseAssignmentCardDetailDocuments: FC<{
	documents: AssignmentMedia0Schema[] | undefined;
}> = ({ documents }) => {
	return (
		<>
			{documents ? (
				<>
					{documents.length > 0 ? (
						<div className="w-full">
							<ul
								role="list"
								className="divide-y divide-gray-100 rounded-md border border-gray-200"
							>
								{documents.map((file, i) => (
									<li
										className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6"
										key={i}
									>
										<div className="flex w-0 flex-1 items-center">
											<PaperclipIcon
												className="h-5 w-5"
												aria-hidden="true"
											/>
											<div className="ml-4 flex min-w-0 flex-1 gap-2">
												<span className="truncate font-medium">
													{file.filename}
												</span>
												<span className="flex-shrink-0 text-gray-400">
													{formatBytes(file.filesize)}
												</span>
											</div>
											<a
												href={`/api/assignmentsMedia/static/${file.id}`}
												download
											>
												<DownloadIcon className="w-5 h-5" />
											</a>
										</div>
									</li>
								))}
							</ul>
						</div>
					) : (
						<div className="w-full h-16 flex justify-center items-center border-2 border-dashed">
							No document
						</div>
					)}
				</>
			) : (
				<Skeleton className="w-full h-32 rounded-lg" />
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

const AssignmentGradesStatusBadge: FC<{
	assignment: Assignment0Schema | undefined;
	course: Course0Schema;
}> = ({ assignment, course }) => {
	const { grades, refetchGrades } = useGrades(assignment?.id);
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

const SubmissionsGradeStatusBadge: FC<{
	assignment: Assignment0Schema | undefined;
}> = ({ assignment }) => {
	const { user } = useAuth();
	const { submissions } = useSubmissionsGrade(assignment?.id, user);

	if (submissions == undefined)
		return <Skeleton className="w-full h-12 rounded-lg" />;
	else if (submissions.length == 0)
		return <Badge variant={"secondary"}>Not graded</Badge>;
	else if (submissions.length > 0)
		return <Badge variant={"secondary"}>Graded</Badge>;
};

export const CourseAssignmentCardDetail: FC<{
	showingAssignmentDetailId: string | null;
	setShowingAssignmentDetailId: Dispatch<SetStateAction<string | null>>;
	assignmentId: string;
	course: Course0Schema;
}> = (props) => {
	const { user } = useAuth();
	const { assignment, refetchAssignment } = useAssignment(props.assignmentId);
	const { documents, refetchDocuments } = useAssignmentDocuments(assignment);
	const {
		showTitle,
		showDueAt,
		showContent,
		showDocuments,
		showSubmissionsStatus,
		showAssignmentGradesStatus,
		showSubmissionsGradeStatus,
		showSubmissions,
		showSubmissionsCreate
	} = useView(user);

	return (
		<Sheet open={props.assignmentId === props.showingAssignmentDetailId}>
			<SheetContent
				onClickOutside={() => props.setShowingAssignmentDetailId(null)}
				onClickClose={() => props.setShowingAssignmentDetailId(null)}
				position="right"
				size="xl"
				className="overflow-y-scroll"
			>
				{showTitle && (
					<CourseAssignmentDetailTitle assignment={assignment} />
				)}
				<div className="space-y-8 max-w-xs">
					{showDueAt && (
						<CourseAssignmentCardDetailDueAt
							assignment={assignment}
						/>
					)}
					{showContent && (
						<CourseAssignmentCardDetailContent
							assignment={assignment}
						/>
					)}
					{showDocuments && (
						<CourseAssignmentCardDetailDocuments
							documents={documents}
						/>
					)}
					{showSubmissionsStatus && (
						<SubmissionsStatusBadge assignment={assignment} />
					)}
					{showAssignmentGradesStatus && (
						<AssignmentGradesStatusBadge
							assignment={assignment}
							course={props.course}
						/>
					)}
					{showSubmissionsGradeStatus && (
						<SubmissionsGradeStatusBadge assignment={assignment} />
					)}
				</div>
			</SheetContent>
		</Sheet>
	);
};
