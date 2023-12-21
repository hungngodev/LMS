import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from "@/components/alert-dialog";
import { Button } from "@/components/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/dropdown-menu";
import { Skeleton } from "@/components/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/table";
import { useAssignment } from "@/hooks/assignments/use-assignment";
import { useCourse } from "@/hooks/courses/use-course";
import { useCourseSubmissions } from "@/hooks/submissions/use-course-submission";
import { useAuth } from "@/hooks/use-auth";
import { Submission0Schema } from "@/models/cms/submission-0";
import { User2Schema } from "@/models/cms/user-2";
import { ViewEnum } from "@/payload/models/view-enum";
import { getUserAllowedViews } from "@/payload/utils/get-user-allowed-views";
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable
} from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { FC, useEffect, useMemo, useState } from "react";
import { SelectASMSubmissionForm } from "./submission-assignment-dialog";

export interface CourseSubmissionsTableProps {
	courseId: string;
}
interface TableData {
	id: string;
	assignmentId: string;
}

const useTableData = (submisions: Submission0Schema[] | undefined) => {
	const tableData: TableData[] = useMemo(() => {
		if (submisions === undefined) return [];
		return submisions.map((submision) => {
			return {
				assignmentId: submision.assignment,
				id: submision.id
			};
		});
	}, [submisions]);
	return { tableData };
};

const deleteSubmission = async (
	courseId: string,
	refetchSubmissions: () => Promise<void>
) => {
	await fetch(`/api/submissions/${courseId}`, {
		method: "DELETE",
		headers: { "Content-Type": "application/json" }
	});
	await refetchSubmissions();
};
const useView = (user: User2Schema | null) => {
	const [create, setCreate] = useState<boolean>(false);
	useEffect(() => {
		if (!user) return;
		const views = getUserAllowedViews(user);
		// if user has create submission permission
		setCreate(
			views.has(ViewEnum["courses:course:submissions:table:create"])
		);
	}, [user]);
	return { create };
};

export const CourseSubmissionsTable: FC<CourseSubmissionsTableProps> = (
	props
) => {
	const { submissions, refetchSubmissions } = useCourseSubmissions(
		props.courseId
	);
	const { course } = useCourse(props.courseId);
	const { tableData } = useTableData(submissions);

	const [creating, setCreating] = useState<boolean>(false);
	const [editting, setEditting] = useState<string | null>(null);
	const [viewing, setViewing] = useState<string | null>(null);
	const [grading, setGrading] = useState<string | null>(null);

	const { user } = useAuth();
	const { create } = useView(user);

	const TitleCell: FC<TableData> = ({ assignmentId }) => {
		const { assignment } = useAssignment(assignmentId);
		return (
			<>
				{!assignment ? (
					<Skeleton className="w-12 h-5 rounded-lg" />
				) : (
					assignment?.title
				)}
			</>
		);
	};

	const ActionCell: FC<TableData> = (submission) => {
		return (
			<AlertDialog>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Are you absolutely sure?
						</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently
							delete your submission.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={() =>
								deleteSubmission(submission.id, async () => {
									await refetchSubmissions();
								})
							}
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuSeparator />

						<DropdownMenuItem
							onClick={() => setViewing(submission.id)}
						>
							Detail
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => setEditting(submission.id)}
						>
							Edit
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => setGrading(submission.id)}
						>
							Grade
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={async () =>
								await deleteSubmission(
									submission.id,
									refetchSubmissions
								)
							}
						>
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</AlertDialog>
		);
	};

	const columns: ColumnDef<TableData>[] = [
		{
			accessorKey: "title",
			cell: ({ row }) => <TitleCell {...row.original} />
		},
		{
			id: "actions",
			enableHiding: false,
			cell: ({ row }) => <ActionCell {...row.original} />
		}
	];

	const table = useReactTable({
		data: tableData ?? [],
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel()
	});

	return (
		<div>
			<div className="flex items-center py-4 justify-between">
				{create === true && (
					<div>
						<Button onClick={() => setCreating(true)}>
							Create new submission
						</Button>
					</div>
				)}
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef
															.header,
														header.getContext()
												  )}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{!submissions ? (
							<>
								{[1, 2, 3, 4].map((i) => (
									<TableRow key={i}>
										<TableCell colSpan={columns.length}>
											<Skeleton className="w-full h-10 rounded-lg" />
										</TableCell>
									</TableRow>
								))}
							</>
						) : (
							<>
								{table.getRowModel().rows?.length ? (
									table.getRowModel().rows.map((row) => (
										<TableRow
											key={row.id}
											data-state={
												row.getIsSelected() &&
												"selected"
											}
										>
											{row
												.getVisibleCells()
												.map((cell) => (
													<TableCell key={cell.id}>
														{flexRender(
															cell.column
																.columnDef.cell,
															cell.getContext()
														)}
													</TableCell>
												))}
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell
											colSpan={columns.length}
											className="h-24 text-center"
										>
											No results.
										</TableCell>
									</TableRow>
								)}
							</>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-2 py-4">
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					Previous
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					Next
				</Button>
			</div>
			{creating && (
				<SelectASMSubmissionForm
					courseId={props.courseId}
					refetchAssignmentsAndSubmissions={refetchSubmissions}
					open={creating}
					setOpen={setCreating}
				/>
			)}
		</div>
	);
};
