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
import { CourseAssignmentDetail } from "@/components/courses/course/assignments/course-assignment-detail";
import { AssignmentSubmisisonsTable } from "@/components/courses/course/submissions/submissions-table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/dropdown-menu";
import { CreateAssignmentForm } from "@/components/forms/create-assignment-form";
import { EditAssignmentForm } from "@/components/forms/edit-assignment-form";
import { Skeleton } from "@/components/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/table";
import { useCourseAssignments } from "@/hooks/assignments/use-course-assignments";
import { useCourse } from "@/hooks/courses/use-course";
import { Assignment0Schema } from "@/models/cms/assignment-0";
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
import { FC, useMemo, useState } from "react";

export interface CourseAssignmentsTableProps {
	courseId: string;
}
interface TableData {
	id: string;
	title: string;
}

const useTableData = (assignments: Assignment0Schema[] | undefined) => {
	const tableData: TableData[] = useMemo(() => {
		if (assignments === undefined) return [];
		return assignments.map((assignment) => ({
			title: assignment.title,
			id: assignment.id
		}));
	}, [assignments]);
	return { tableData };
};

const deleteAssignment = async (
	assignmentId: string,
	refetchAssignments: () => Promise<void>
) => {
	await fetch(`/api/assignments/${assignmentId}`, {
		method: "DELETE",
		headers: { "Content-Type": "application/json" }
	});
	await refetchAssignments();
};

export const CourseAssignmentsTable: FC<CourseAssignmentsTableProps> = (
	props
) => {
	const { assignments, refetchAssignments } = useCourseAssignments(
		props.courseId
	);
	const { course } = useCourse(props.courseId);
	const { tableData } = useTableData(assignments);

	const [creating, setCreating] = useState<boolean>(false);
	const [editting, setEditting] = useState<string | null>(null);
	const [viewing, setViewing] = useState<string | null>(null);
	const [grading, setGrading] = useState<string | null>(null);

	const columns: ColumnDef<TableData>[] = [
		{ accessorKey: "title" },
		{
			id: "actions",
			enableHiding: false,
			cell: ({ row }) => {
				const assignment = row.original;
				return (
					<AlertDialog>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									Are you absolutely sure?
								</AlertDialogTitle>
								<AlertDialogDescription>
									This action cannot be undone. This will
									permanently delete your assignment.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction
									onClick={() =>
										deleteAssignment(
											assignment.id,
											async () => {
												await refetchAssignments();
											}
										)
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
									onClick={() => setViewing(assignment.id)}
								>
									Detail
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => setEditting(assignment.id)}
								>
									Edit
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => setGrading(assignment.id)}
								>
									Grade
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={async () =>
										await deleteAssignment(
											assignment.id,
											refetchAssignments
										)
									}
								>
									Delete
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</AlertDialog>
				);
			}
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
				<div>
					<Button onClick={() => setCreating(true)}>
						Create new assignment
					</Button>
				</div>
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
						{!assignments ? (
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
				<CreateAssignmentForm
					courseId={props.courseId}
					refetchAssignments={refetchAssignments}
					open={creating}
					setOpen={setCreating}
				/>
			)}
			{editting && (
				<EditAssignmentForm
					courseId={props.courseId}
					editting={editting}
					setEditting={setEditting}
					refetch={refetchAssignments}
				/>
			)}
			{viewing && (
				<CourseAssignmentDetail
					courseId={props.courseId}
					viewing={viewing}
					setViewing={setViewing}
					refetch={refetchAssignments}
				/>
			)}
			{grading && (
				<AssignmentSubmisisonsTable
					courseId={props.courseId}
					assignmentId={grading}
					setAssignmentId={setGrading}
				/>
			)}
		</div>
	);
};
