import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from "@/components/accordion";
import { CreateSubmissionForm } from "@/components/forms/create-submission-form";
import { Skeleton } from "@/components/skeleton";
import { Header4 } from "@/components/typography/h4";
import { useAuth } from "@/hooks/use-auth";
import { AssignmentMedia0Schema } from "@/models/cms/assignment-media-0";
import { Submission0Schema } from "@/models/cms/submission-0";
import { User2Schema } from "@/models/cms/user-2";
import { formatBytes } from "@/utils/bytes-to-megabytes";
import { jsDateToDateMonthHourMinute } from "@/utils/js-date-to-date-month-hour-minute";
import { DownloadIcon, PaperclipIcon } from "lucide-react";
import { Where } from "payload/types";
import qs from "qs";
import { FC, useCallback, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { z } from "zod";

const fetchSubmissions = async (endpoint: string) => {
	if (endpoint === "") return undefined;
	const resp = await fetch(endpoint);
	const body = await resp.json();
	const submissions = z.array(Submission0Schema).parse(body.docs);
	return submissions;
};

const useSubmissions = (
	assignmentId: string | undefined,
	user: User2Schema | null
) => {
	const query: Where = useMemo(
		() =>
			user && assignmentId
				? {
						and: [
							{ createdBy: { equals: user.id } },
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
	return { submissions, refetch };
};

const fetchDocuments = async (endpoint: string) => {
	if (endpoint === "") return undefined;
	const resp = await fetch(endpoint);
	const body = await resp.json();
	const documents = z.array(AssignmentMedia0Schema).parse(body.docs);
	return documents;
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

interface Props {
	courseId: string | undefined;
	assignmentId: string | undefined;
	refetchAssignment: () => Promise<void>;
	refetchAssignments: () => Promise<void>;
}

export const AssignmentDetailSubmissions: FC<Props> = (props) => {
	const { user } = useAuth();
	const { submissions, refetch: refetchSubmissions } = useSubmissions(
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
						<Header4>Submissions</Header4>
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
