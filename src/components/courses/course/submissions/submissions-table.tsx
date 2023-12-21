"use client";

import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { TeacherSubmissionsDetail } from "@/components/courses/course/submissions/teacher-submissions-detail";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle
} from "@/components/sheet";
import { Skeleton } from "@/components/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/table";
import { Assignment0Schema } from "@/models/cms/assignment-0";
import { Grade0Schema } from "@/models/cms/grade-0";
import { Submission1Schema } from "@/models/cms/submission-1";
import { jsDateToDateMonthHourMinute } from "@/utils/js-date-to-date-month-hour-minute";
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Where } from "payload/types";
import qs from "qs";
import {
	Dispatch,
	FC,
	SetStateAction,
	useCallback,
	useEffect,
	useState
} from "react";
import { useQuery } from "react-query";
import { z } from "zod";

export interface SubmissionsTableProps {
	courseId: string;
	assignmentId: string;
	setAssignmentId: Dispatch<SetStateAction<string | null>>;
}

const fetchAssignment = async (endpoint: string) => {
	const resp = await fetch(endpoint);
	return Assignment0Schema.parse(await resp.json());
};

const useAssignment = (assignmentId: string) => {
	const endpoint = `/api/assignments/${assignmentId}${qs.stringify(
		{ depth: 0 },
		{ addQueryPrefix: true }
	)}`;
	const { data: assignment } = useQuery(
		endpoint,
		async () => await fetchAssignment(endpoint)
	);
	return assignment;
};

const fetchSubmissions = async (endpoint: string) => {
	const resp = await fetch(endpoint);
	const body = await resp.json();
	const submissions = z.array(Submission1Schema).parse(body.docs);
	return submissions;
};

const useSubmissions = (assignmentId: string) => {
	const query: Where = {
		assignment: { equals: assignmentId }
	};
	const endpoint = `/api/submissions${qs.stringify(
		{ where: query, depth: 1, limit: 1000 },
		{ addQueryPrefix: true }
	)}`;
	const fetchSubmissionsCb = useCallback(
		async () => fetchSubmissions(endpoint),
		[endpoint]
	);
	const { data: submissions, refetch } = useQuery(
		endpoint,
		fetchSubmissionsCb
	);
	return { submissions, refetch };
};

export interface SubmissionsTableData {
	submission: Submission1Schema;
	grade?: Grade0Schema | null;
	author: string;
	authorId: string;
	submittedAt: string;
	graded: boolean;
}

export const AssignmentSubmisisonsTable: FC<SubmissionsTableProps> = (
	props
) => {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
		{}
	);
	const [rowSelection, setRowSelection] = useState({});
	const assignment = useAssignment(props.assignmentId);
	const { submissions, refetch } = useSubmissions(props.assignmentId);
	const [groupedTableData, setGroupedTableData] = useState<Record<
		string,
		SubmissionsTableData[]
	> | null>(null);
	useEffect(() => {
		if (!submissions) return;
		const groupedTableData = submissions.reduce<
			Record<string, SubmissionsTableData[]>
		>((groupedData, submission) => {
			const data = {
				submission,
				grade: submission.grade,
				author: submission.createdBy.fullName,
				authorId: submission.createdBy.id,
				submittedAt: submission.createdAt,
				graded: !!submission.grade ?? false
			};
			if (!Object.hasOwn(groupedData, submission.createdBy.id)) {
				groupedData[submission.createdBy.id] = [data];
			} else {
				groupedData[submission.createdBy.id].push(data);
			}
			return groupedData;
		}, {});
		Object.keys(groupedTableData).map((key) => {
			groupedTableData[key].sort((a, b) =>
				new Date(a.submittedAt) > new Date(b.submittedAt) ? -1 : 1
			);
		});
		setGroupedTableData(groupedTableData);
	}, [submissions]);

	const [tableData, setTableData] = useState<SubmissionsTableData[]>([]);
	useEffect(() => {
		if (groupedTableData === null) return;
		setTableData(
			Object.values(groupedTableData).map((groupedData) => groupedData[0])
		);
	}, [groupedTableData]);

	const [currentAuthorBeingGraded, setCurrentAuthorBeingGraded] = useState<
		string | null
	>(null);

	const columns: ColumnDef<SubmissionsTableData>[] = [
		{ accessorKey: "author", header: "Author" },
		{
			accessorKey: "submittedAt",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() =>
							column.toggleSorting(column.getIsSorted() === "asc")
						}
					>
						Submitted At
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			},
			cell: ({ row }) => (
				<div className="flex">
					{jsDateToDateMonthHourMinute(
						new Date(row.original.submittedAt)
					)}
					{assignment ? (
						<>
							{new Date(row.original.submittedAt) >
							new Date(assignment.dueAt) ? (
								<Badge variant={"destructive"} className="ml-2">
									Late
								</Badge>
							) : (
								<Badge className="ml-2">On Time</Badge>
							)}
						</>
					) : (
						<Skeleton className="w-12 h-6 rounded-lg ml-2" />
					)}
				</div>
			)
		},
		{
			accessorKey: "graded",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() =>
							column.toggleSorting(column.getIsSorted() === "asc")
						}
					>
						Graded
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			},
			cell: ({ row }) =>
				row.original.graded ? (
					<Badge>Graded</Badge>
				) : (
					<Badge variant={"destructive"}>Not Graded</Badge>
				)
		},
		{
			id: "actions",
			cell: ({ row }) => (
				<Button
					onClick={() =>
						setCurrentAuthorBeingGraded(row.original.authorId)
					}
				>
					Grade
				</Button>
			)
		}
	];

	const table = useReactTable({
		data: tableData,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection
		}
	});

	return (
		<Sheet open={!!props.assignmentId}>
			<SheetContent
				position="right"
				size="xl"
				onClickOutside={() => props.setAssignmentId(null)}
				onClickClose={() => props.setAssignmentId(null)}
			>
				<SheetHeader>
					<SheetTitle>Submissions</SheetTitle>
				</SheetHeader>
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
				<div className="flex-1 text-sm text-muted-foreground">
					{table.getFilteredSelectedRowModel().rows.length} of{" "}
					{table.getFilteredRowModel().rows.length} row(s) selected.
				</div>
			</SheetContent>
			{groupedTableData &&
				Object.entries(groupedTableData).map(([key, value], i) => (
					<TeacherSubmissionsDetail
						key={i}
						courseId={props.courseId}
						assignmentId={props.assignmentId}
						submissions={value.map((_) => _.submission) ?? []}
						authorId={key}
						currentAuthorBeingGraded={currentAuthorBeingGraded}
						setCurrentAuthorBeingGraded={
							setCurrentAuthorBeingGraded
						}
						refetchSubmissions={async () => {
							await refetch();
						}}
					/>
				))}
		</Sheet>
	);
};
