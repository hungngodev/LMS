"use client";

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
import { Button } from "@/components/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/dropdown-menu";
import { CreateSubjectsForm } from "@/components/forms/create-subject-form";
import { EditSubjectForm } from "@/components/forms/edit-subject-form";
import { Skeleton } from "@/components/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/table";
import { Header2 } from "@/components/typography/h2";
import { useAllSubjects } from "@/hooks/subjects/use-all-subjects";
import { useAuth } from "@/hooks/use-auth";
import { ToastInvoker, useToast } from "@/hooks/use-toast";
import { Subject0Schema } from "@/models/cms/subject-0";
import { User2Schema } from "@/models/cms/user-2";
import { ViewEnum } from "@/payload/models/view-enum";
import { getUserAllowedViews } from "@/payload/utils/get-user-allowed-views";
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
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { SubjectDetail } from "./subject-detail";

const useViews = (user: User2Schema | null) => {
	const [showView, setShowView] = useState<boolean>(false);
	const [showCreate, setShowCreate] = useState<boolean>(false);
	const [showEdit, setShowEdit] = useState<boolean>(false);
	const [showDelete, setShowDelete] = useState<boolean>(false);
	useEffect(() => {
		if (!user) return;
		const views = getUserAllowedViews(user);
		setShowCreate(views.has(ViewEnum["subjects:table:create"]));
		setShowView(views.has(ViewEnum["subjects:table:read"]));
		setShowEdit(views.has(ViewEnum["subjects:table:update"]));
		setShowDelete(views.has(ViewEnum["subjects:table:delete"]));
	}, [user]);
	return { showCreate, showView, showEdit, showDelete };
};

const deleteSubject = async (
	subjectId: string,
	refetchSubjects: () => Promise<void>,
	toast: ToastInvoker
) => {
	toast({ title: `Deleting subject...` });
	try {
		const resp = await fetch(`/api/subjects/${subjectId}`, {
			method: "DELETE",
			headers: { "Content-Type": "application/json" }
		});
		if (resp.ok) {
			toast({
				title: "Success",
				description: `Subject deleted`
			});
			await refetchSubjects();
		} else {
			toast({
				title: "Uh oh, something went wrong",
				description:
					"There was a problem in our system, please try again later",
				variant: "destructive"
			});
		}
	} catch (error) {
		console.error(error);
		toast({
			title: "Uh oh, something went wrong",
			description:
				"There was a problem in our system, please try again later",
			variant: "destructive"
		});
	}
};

interface TableData {
	id: string;
	name: string;
	updatedAt: string;
	createdAt: string;
}

const useTableData = (subjects: Subject0Schema[] | undefined) => {
	const [tableData, setTableData] = useState<TableData[] | null>(null);
	useEffect(() => {
		if (!subjects) return;
		const tableData = subjects.map((subject) => ({
			id: subject.id,
			name: subject.name,
			updatedAt: jsDateToDateMonthHourMinute(new Date(subject.updatedAt)),
			createdAt: jsDateToDateMonthHourMinute(new Date(subject.createdAt))
		}));
		setTableData(tableData);
	}, [subjects]);
	return { tableData };
};

export const SubjectsTable: FC = (props) => {
	const { user } = useAuth();
	const { showCreate, showView, showEdit, showDelete } = useViews(user);
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
		{}
	);
	const [rowSelection, setRowSelection] = useState({});
	const { subjects, refetchSubjects } = useAllSubjects();
	const { toast } = useToast();

	const [viewing, setViewing] = useState<string | null>(null);
	const [editting, setEditting] = useState<string | null>(null);
	const { tableData } = useTableData(subjects);

	const columns: ColumnDef<TableData>[] = [
		{ accessorKey: "name", header: "Name" },
		{
			accessorKey: "updatedAt",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() =>
							column.toggleSorting(column.getIsSorted() === "asc")
						}
					>
						Updated At
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			}
		},
		{
			accessorKey: "createdAt",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() =>
							column.toggleSorting(column.getIsSorted() === "asc")
						}
					>
						Created At
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			}
		},
		{
			id: "actions",
			enableHiding: false,
			cell: ({ row: { original: subject } }) => (
				<AlertDialog>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>
								Are you absolutely sure?
							</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This will
								permanently delete your course.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction
								onClick={() =>
									deleteSubject(
										subject.id,
										refetchSubjects,
										toast
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
							{showView && (
								<DropdownMenuItem
									onClick={() => setViewing(subject.id)}
								>
									Detail
								</DropdownMenuItem>
							)}
							{showEdit && (
								<DropdownMenuItem
									onClick={() => setEditting(subject.id)}
								>
									Edit
								</DropdownMenuItem>
							)}
							{showDelete && (
								<AlertDialogTrigger asChild>
									<DropdownMenuItem>Delete</DropdownMenuItem>
								</AlertDialogTrigger>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
				</AlertDialog>
			)
		}
	];

	const table = useReactTable({
		data: tableData ?? [],
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: { sorting, columnFilters, columnVisibility, rowSelection }
	});

	const [creating, setCreating] = useState<boolean>(false);

	return (
		<div className="px-6 py-4">
			<header>
				<Header2>
					<div className="flex flex-row justify-between">
						Subjects
						{showCreate && (
							<Button onClick={() => setCreating(true)}>
								Add Subjects
							</Button>
						)}
					</div>
				</Header2>
			</header>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead
											key={header.id}
											className="text-center"
										>
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
						{!subjects ? (
							<>
								{[1, 2, 3, 4].map((i) => (
									<TableRow key={i}>
										<TableCell colSpan={columns.length}>
											<Skeleton className="w-full h-10 rounded-lg text-center" />
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
													<TableCell
														key={cell.id}
														className="text-center"
													>
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
				<CreateSubjectsForm
					open={creating}
					setOpen={setCreating}
					refetchSubjects={refetchSubjects}
				/>
			)}
			{viewing && (
				<SubjectDetail subjectId={viewing} setSubjectId={setViewing} />
			)}
			{editting && (
				<EditSubjectForm
					editting={editting}
					setEditting={setEditting}
					refetchSubjects={refetchSubjects}
				/>
			)}
		</div>
	);
};
