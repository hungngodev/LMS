import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger
} from "@/components/alert-dialog";
import { AssignmentTableDetail } from "@/components/assignments/assignment-table-detail";
import { EditAssignmentForm } from "@/components/assignments/edit-assignment-form";
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
import { useAllAssignments } from "@/hooks/assignments/use-all-assignments";
import { useAuth } from "@/hooks/use-auth";
import { ToastInvoker, useToast } from "@/hooks/use-toast";
import { Assignment0Schema } from "@/models/cms/assignment-0";
import { User2Schema } from "@/models/cms/user-2";
import { ViewEnum } from "@/payload/models/view-enum";
import { getUserAllowedViews } from "@/payload/utils/get-user-allowed-views";
import { jsDateToDateMonthHourMinute } from "@/utils/js-date-to-date-month-hour-minute";
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable
} from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { AssignmentSubmisisonsTable } from "../courses/course/submissions/submissions-table";

const useViews = (user: User2Schema | null) => {
	const [showEdit, showShowEdit] = useState<boolean | null>(null);
	const [showDelete, setShowDelete] = useState<boolean | null>(null);
	const [showGrade, setShowGrade] = useState<boolean | null>(null);
	useEffect(() => {
		if (!user) return;
		const views = getUserAllowedViews(user);
		showShowEdit(views.has(ViewEnum["assignments:table:update"]));
		setShowDelete(views.has(ViewEnum["assignments:table:delete"]));
		setShowGrade(views.has(ViewEnum["assignments:table:grade"]));
	}, [user]);
	return { showEdit, showDelete, showGrade };
};

const deleteAssignment = async (
	assignment: Assignment0Schema,
	toast: ToastInvoker,
	refetchAssignments: () => Promise<void>
) => {
	toast({ title: "Deleting assignment..." });
	try {
		const resp = await fetch(`/api/assignments/${assignment.id}`, {
			method: "DELETE",
			headers: { "Content-Type": "application/json" }
		});
		if (resp.status !== 200) {
			toast({
				title: "Uh oh, something went wrong",
				description:
					"There was a problem in our system, please try again",
				variant: "destructive"
			});
			return;
		}
		toast({ title: "Success", description: "Assignment deleted" });
	} catch (error) {
		console.error(error);
		toast({
			title: "Uh oh, something went wrong",
			description: "There was a problem in our system, please try again",
			variant: "destructive"
		});
	}
	await refetchAssignments();
};

const useGradingAssignment = (
	assignments: Assignment0Schema[] | undefined,
	grading: string | null
) => {
	const [gradingAssignment, setGradingAssignment] =
		useState<Assignment0Schema | null>(null);
	useEffect(() => {
		if (!assignments) return;
		const gradingAssignment = assignments.find(
			(assignment) => assignment.id === grading
		);
		if (gradingAssignment) setGradingAssignment(gradingAssignment);
	}, [assignments, grading]);
	return { gradingAssignment, setGradingAssignment };
};

export const AssignmentsTable: FC = () => {
	const { user } = useAuth();
	const { toast } = useToast();
	const { showDelete, showEdit, showGrade } = useViews(user);
	const { assignments, refetchAssignments } = useAllAssignments();

	const [viewing, setViewing] = useState<string | null>(null);
	const [editting, setEditting] = useState<string | null>(null);
	const [grading, setGrading] = useState<string | null>(null);

	const { gradingAssignment } = useGradingAssignment(assignments, grading);

	const columns: ColumnDef<Assignment0Schema>[] = [
		{ accessorKey: "title" },
		{
			accessorKey: "dueAt",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() =>
							column.toggleSorting(column.getIsSorted() === "asc")
						}
					>
						Due At
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			},
			cell: ({ row }) =>
				jsDateToDateMonthHourMinute(new Date(row.original.dueAt))
		},
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
								<AlertDialogAction asChild>
									<Button
										variant={"destructive"}
										onClick={() =>
											deleteAssignment(
												assignment,
												toast,
												refetchAssignments
											)
										}
									>
										Delete
									</Button>
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
								{showEdit && (
									<DropdownMenuItem
										onClick={() =>
											setEditting(assignment.id)
										}
									>
										Edit
									</DropdownMenuItem>
								)}
								{showGrade && (
									<DropdownMenuItem
										onClick={() =>
											setGrading(assignment.id)
										}
									>
										Grade
									</DropdownMenuItem>
								)}
								{showDelete && (
									<AlertDialogTrigger asChild>
										<DropdownMenuItem>
											Delete
										</DropdownMenuItem>
									</AlertDialogTrigger>
								)}
							</DropdownMenuContent>
						</DropdownMenu>
					</AlertDialog>
				);
			}
		}
	];

	const table = useReactTable({
		data: assignments ?? [],
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel()
	});

	return (
		<div>
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
			{viewing && (
				<AssignmentTableDetail
					assignmentId={viewing}
					setAssignmentId={setViewing}
					refetchAssignments={refetchAssignments}
				/>
			)}
			{showEdit && editting && (
				<EditAssignmentForm
					editting={editting}
					setEditting={setEditting}
					refetchAssignments={refetchAssignments}
				/>
			)}
			{gradingAssignment && showGrade && grading && (
				<AssignmentSubmisisonsTable
					courseId={gradingAssignment.course}
					assignmentId={grading}
					setAssignmentId={setGrading}
				/>
			)}
		</div>
	);
};
