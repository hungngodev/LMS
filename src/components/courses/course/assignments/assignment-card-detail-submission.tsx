import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from "@/components/accordion";
import { CreateSubmissionForm } from "@/components/forms/create-submission-form";
import { Skeleton } from "@/components/skeleton";
import { Header4 } from "@/components/typography/h4";
import { useSubmissionDocuments } from "@/hooks/submissions/use-submission-documents";
import { useSubmissions } from "@/hooks/submissions/use-submissions";
import { useAuth } from "@/hooks/use-auth";
import { Submission0Schema } from "@/models/cms/submission-0";
import { User2Schema } from "@/models/cms/user-2";
import { ViewEnum } from "@/payload/models/view-enum";
import { getUserAllowedViews } from "@/payload/utils/get-user-allowed-views";
import { formatBytes } from "@/utils/bytes-to-megabytes";
import { jsDateToDateMonthHourMinute } from "@/utils/js-date-to-date-month-hour-minute";
import { DownloadIcon, PaperclipIcon } from "lucide-react";
import { FC, useEffect, useState } from "react";

const useViews = (user: User2Schema | null) => {
	const [showCreateSubmission, setShowCreateSubmission] = useState<boolean>();
	useEffect(() => {
		if (user == null) return;
		const views = getUserAllowedViews(user);
		setShowCreateSubmission(
			views.has(ViewEnum["courses:course:assignments:card:detail:submissions:create"])
		);
	}, [user])
}
const SubmissionDetail: FC<{ submission: Submission0Schema }> = ({
	submission
}) => {
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

// interface SubmissionsListComponentProps {
// 	submissions: Submission0Schema[] | undefined,
// 	openCreateSubmission: () => void
// }
// const AssignmentDetailSubmissionsListComponent: FC<SubmissionsListComponentProps> = ({
// 	submissions, openCreateSubmission
// }) => {
// 	//const { documents } = useSubmissionDocuments(submission.documents);
// 	return (
// 		<>
// 			{!!submissions ? (
// 				<></>
// 			) : (
// 				<Skeleton className="w-full h-12 rounded-lg" />
// 			)}
// 		</>
// 	)
// };

const AssignmentDetailSubmissionsHeader: FC<{ submissions: Submission0Schema[] | undefined }> = (props) => {
	return (
		<>
			{!!props.submissions ? (
				<Header4>Submissions</Header4>
			) : (
				<Skeleton className="w-full h-12 rounded-lg" />
			)}
		</>
	)
}

interface Props {
	courseId: string | undefined;
	assignmentId: string | undefined;
	refetchAssignment: () => Promise<void>;
	refetchAssignments: () => Promise<void>;
}

export const AssignmentDetailSubmissionsList: FC<Props> = (props) => {
	const { user } = useAuth();
	const { submissions, refetchSubmissions } = useSubmissions(
		props.assignmentId,
		user
	);
	const [openCreateSubmission, setOpenCreateSubmission] =
		useState<boolean>(false);

	return (
		<>
			{props.courseId && props.assignmentId ? (
				<>
					{submissions ? (
						<AssignmentDetailSubmissionsHeader submissions={submissions} />
					) : (
						<Skeleton className="w-full h-12 rounded-lg" />
					)}
					{submissions ? (
						<>
							{submissions.length > 0 ? (
								<>
									{submissions.map((submission, i) => (
										<SubmissionDetail
											submission={submission}
											key={i}
										/>
									))}
									<button
										onClick={() =>
											setOpenCreateSubmission(true)
										}
										className="w-full h-20 rounded-lg border-2 border-dashed flex justify-center items-center hover:cursor-pointer"
									>
										Add Another Submission
									</button>
								</>
							) : (
								<button
									onClick={() =>
										setOpenCreateSubmission(true)
									}
									className="w-full h-20 rounded-lg border-2 border-dashed flex justify-center items-center hover:cursor-pointer"
								>
									Add Submission
								</button>
							)}
						</>
					) : (
						<Skeleton className="w-full h-12 rounded-lg" />
					)}
					<CreateSubmissionForm
						courseId={props.courseId}
						assignmentId={props.assignmentId}
						refetchAssignmentsAndSubmissions={async () => {
							await props.refetchAssignments();
							await props.refetchAssignment();
							await refetchSubmissions();
						}}
						open={openCreateSubmission}
						setOpen={setOpenCreateSubmission}
					/>
				</>
			) : (
				<>
					<Skeleton className="w-full h-40 rounded-lg" />
				</>
			)}
		</>
	);
};
