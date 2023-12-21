import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from "@/components/accordion";
import { CreateSubmissionForm } from "@/components/forms/create-submission-form";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle
} from "@/components/sheet";
import { Skeleton } from "@/components/skeleton";
import { Header4 } from "@/components/typography/h4";
import { Paragraph } from "@/components/typography/p";
import { useAuth } from "@/hooks/use-auth";
import { Assignment0Schema } from "@/models/cms/assignment-0";
import { AssignmentMedia0Schema } from "@/models/cms/assignment-media-0";
import { Submission0Schema } from "@/models/cms/submission-0";
import { User2Schema } from "@/models/cms/user-2";
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
	useMemo,
	useState
} from "react";
import { useQuery } from "react-query";
import { z } from "zod";

export interface SubmissionDetailProps {
	courseId: string;
	assignmentId: string;
	setAssignmentId: Dispatch<SetStateAction<string | null>>;
	refetchAssignments: () => Promise<void>;
}

const fetchAssignment = async (endpoint: string) => {
	const resp = await fetch(endpoint);
	const assignment = Assignment0Schema.parse(await resp.json());
	return assignment;
};

const useAssignment = (assignmentId: string) => {
	const endpoint = `/api/assignments/${assignmentId}${qs.stringify(
		{ depth: 0 },
		{ addQueryPrefix: true }
	)}`;
	const fetchAssignmentCb = useCallback(
		async () => await fetchAssignment(endpoint),
		[endpoint]
	);
	const { data: assignment, refetch } = useQuery(endpoint, fetchAssignmentCb);
	return { assignment, refetch };
};

const fetchDocuments = async (endpoint: string) => {
	if (endpoint === "") return undefined;
	const resp = await fetch(endpoint);
	const body = await resp.json();
	const documents = z.array(AssignmentMedia0Schema).parse(body.docs);
	return documents;
};

const useAssignmentDocuments = (documentsId: string[] | undefined) => {
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
	const { data: documents } = useQuery(endpoint, fetchDocumentsCb, {
		enabled: endpoint !== ""
	});
	return { documents };
};

const fetchSubmissions = async (endpoint: string) => {
	if (endpoint === "") return undefined;
	const resp = await fetch(endpoint);
	const body = await resp.json();
	const submissions = z.array(Submission0Schema).parse(body.docs);
	return submissions;
};

const useSubmissions = (assignmentId: string, user: User2Schema | null) => {
	const query: Where = useMemo(
		() =>
			user
				? {
						and: [
							{ author: { equals: user.id } },
							{ assignment: { equals: assignmentId } }
						]
				  }
				: ({} as Record<never, never>),
		[assignmentId, user]
	);
	const endpoint = useMemo(
		() =>
			JSON.stringify(query) !== "{}"
				? `/api/submissions${qs.stringify(
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
	const fetchSubmissionsCb = useCallback(
		async () => await fetchSubmissions(endpoint),
		[endpoint]
	);
	const { data: submissions, refetch } = useQuery(
		endpoint,
		fetchSubmissionsCb,
		{
			enabled: endpoint !== ""
		}
	);
	return {
		submissions,
		refetchSubmissions: async () => {
			await refetch();
		}
	};
};

const useSubmissionDocuments = (documentsId: string[] | undefined) => {
	const query: Where = {
		id: { in: documentsId?.join(",") }
	};
	const endpoint = `/api/submissionsMedia${qs.stringify(
		{ where: query, depth: 0, limit: 1000, sort: "-updatedAt" },
		{ addQueryPrefix: true }
	)}`;
	const { data: documents } = useQuery(
		endpoint,
		async () => await fetchDocuments(endpoint),
		{ enabled: !!documentsId }
	);
	return { documents };
};

const CourseAssignmentCardDetailSubmissionDetail: FC<{
	submission: Submission0Schema;
}> = ({ submission }) => {
	const { documents } = useSubmissionDocuments(submission.documents);
	return (
		<Accordion type="single" collapsible>
			<AccordionItem value="item-1">
				<AccordionTrigger>
					Submission at{" "}
					{jsDateToDateMonthHourMinute(
						new Date(submission.updatedAt)
					)}
				</AccordionTrigger>
				<AccordionContent>
					<div>{submission.content}</div>
					{documents ? (
						documents.map((doc) => (
							<div
								className="flex w-full flex-1 items-center"
								key={doc.id}
							>
								<PaperclipIcon
									className="h-5 w-5 flex-shrink-0 text-gray-400"
									aria-hidden="true"
								/>
								<div className="ml-4 flex min-w-0 flex-1 gap-2">
									<span className="truncate font-medium">
										{doc.filename}
									</span>
									<span className="flex-shrink-0 text-gray-400">
										{formatBytes(doc.filesize)}
									</span>
								</div>
								<a
									href={`/api/submissionsMedia/static/${doc.id}`}
									download
								>
									<DownloadIcon className="w-5 h-5" />
								</a>
							</div>
						))
					) : (
						<Skeleton className="w-full h-12 rounded-lg" />
					)}
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
};

const CourseAssignmentCardDetailTitle: FC<{
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
			{assignment?.content ? (
				<Paragraph>{assignment.content}</Paragraph>
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

const CourseAssignmentCardDetailSubmissions: FC<{
	courseId: string;
	assignmentId: string;
	refetchAssignmentsAndSubmissions: () => Promise<void>;
	submissions: Submission0Schema[] | undefined;
}> = ({
	courseId,
	assignmentId,
	submissions,
	refetchAssignmentsAndSubmissions
}) => {
	const [openCreateSubmission, setOpenCreateSubmission] =
		useState<boolean>(false);
	return (
		<>
			{submissions ? (
				<>
					<Header4>Submissions</Header4>
					{submissions.length > 0 ? (
						<>
							{submissions.map((submission, i) => (
								<CourseAssignmentCardDetailSubmissionDetail
									submission={submission}
									key={i}
								/>
							))}
							<button
								onClick={() => setOpenCreateSubmission(true)}
								className="w-full h-20 rounded-lg border-2 border-dashed flex justify-center items-center hover:cursor-pointer"
							>
								Add Another Submission
							</button>
						</>
					) : (
						<button
							onClick={() => setOpenCreateSubmission(true)}
							className="w-full h-20 rounded-lg border-2 border-dashed flex justify-center items-center hover:cursor-pointer"
						>
							Add Submission
						</button>
					)}
				</>
			) : (
				<>
					<Skeleton className="w-full h-12 rounded-lg" />
					<Skeleton className="w-full h-12 rounded-lg" />
				</>
			)}
			<CreateSubmissionForm
				courseId={courseId}
				assignmentId={assignmentId}
				refetchAssignmentsAndSubmissions={
					refetchAssignmentsAndSubmissions
				}
				open={openCreateSubmission}
				setOpen={setOpenCreateSubmission}
			/>
		</>
	);
};

export const CourseAssignmentCardDetail: FC<SubmissionDetailProps> = (
	props
) => {
	const { user } = useAuth();
	const { assignment, refetch: refetchAssignment } = useAssignment(
		props.assignmentId
	);
	const { documents } = useAssignmentDocuments(assignment?.documents);
	const { submissions, refetchSubmissions } = useSubmissions(
		props.assignmentId,
		user
	);

	return (
		<Sheet open={!!props.assignmentId}>
			<SheetContent
				position="right"
				size="xl"
				onClickOutside={() => props.setAssignmentId(null)}
				onClickClose={() => props.setAssignmentId(null)}
				className="overflow-y-scroll"
			>
				<CourseAssignmentCardDetailTitle assignment={assignment} />
				<div className="space-y-8 max-w-xs">
					<CourseAssignmentCardDetailDueAt assignment={assignment} />
					<CourseAssignmentCardDetailContent
						assignment={assignment}
					/>
					<CourseAssignmentCardDetailDocuments
						documents={documents}
					/>
				</div>
				<div className="space-y-8 max-w-xs mt-12">
					<CourseAssignmentCardDetailSubmissions
						submissions={submissions}
						courseId={props.courseId}
						assignmentId={props.assignmentId}
						refetchAssignmentsAndSubmissions={async () => {
							await props.refetchAssignments();
							await refetchAssignment();
							await refetchSubmissions();
						}}
					/>
				</div>
			</SheetContent>
		</Sheet>
	);
};
