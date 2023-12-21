import { AssignmentDetailSubmissions } from "@/components/assignments/assignment-detail-submissions";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle
} from "@/components/sheet";
import { Skeleton } from "@/components/skeleton";
import { Paragraph } from "@/components/typography/p";
import { useAssignmentDocuments } from "@/hooks/assignments/use-assignment-documents";
import { useAuth } from "@/hooks/use-auth";
import { Assignment0Schema } from "@/models/cms/assignment-0";
import { AssignmentMedia0Schema } from "@/models/cms/assignment-media-0";
import { User2Schema } from "@/models/cms/user-2";
import { ActionEnum } from "@/payload/models/action-enum";
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
	return {
		assignment,
		refetchAssignment: async () => {
			await refetch();
		}
	};
};



const useCanViewSubmissions = (user: User2Schema | null) => {
	const [canViewSubmissions, setCanViewSubmissions] = useState<boolean>();
	useEffect(() => {
		if (!user) return;
		const actions = getUserAllowedActions(user);
		setCanViewSubmissions(
			actions.has(
				ActionEnum["submissions:read"] ||
					ActionEnum["submissions:read:author_only"] ||
					ActionEnum["submissions:read:member_only"]
			)
		);
	}, [user]);
	return { canViewSubmissions };
};

const AssignmentDetailTitle: FC<{
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

const AssignmentDetailDueAt: FC<{
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

const AssignmentDetailContent: FC<{
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

const AssignmentDetailDocuments: FC<{
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

interface Props {
	assignmentId: string;
	setAssignmentId: Dispatch<SetStateAction<string | null>>;
	refetchAssignments: () => Promise<void>;
}

export const AssignmentTableDetail: FC<Props> = (props) => {
	const { user } = useAuth();
	const { assignment, refetchAssignment } = useAssignment(props.assignmentId);
	const { documents } = useAssignmentDocuments(assignment);
	const { canViewSubmissions } = useCanViewSubmissions(user);

	return (
		<Sheet open={!!props.assignmentId}>
			<SheetContent
				onClickOutside={() => props.setAssignmentId(null)}
				onClickClose={() => props.setAssignmentId(null)}
				position="right"
				size="xl"
				className="overflow-y-scroll"
			>
				<AssignmentDetailTitle assignment={assignment} />
				<div className="space-y-8 max-w-xs">
					<AssignmentDetailDueAt assignment={assignment} />
					<AssignmentDetailContent assignment={assignment} />
					<AssignmentDetailDocuments documents={documents} />
					<div className="space-y-8 max-w-xs mt-12">
						{canViewSubmissions && (
							<AssignmentDetailSubmissions
								courseId={assignment?.course}
								assignmentId={assignment?.id}
								refetchAssignment={refetchAssignment}
								refetchAssignments={props.refetchAssignments}
							/>
						)}
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
};
