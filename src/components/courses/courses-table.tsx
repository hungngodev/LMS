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
import { CreateCourseForm } from "@/components/forms/create-course-form";
import { EditCourseForm } from "@/components/forms/edit-course-form";
import { Skeleton } from "@/components/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/table";
import { useAuth } from "@/hooks/use-auth";
import { Course0Schema } from "@/models/cms/course-0";
import { User2Schema } from "@/models/cms/user-2";
import { ViewEnum } from "@/payload/models/view-enum";
import { getUserAllowedViews } from "@/payload/utils/get-user-allowed-views";
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
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import qs from "qs";
import { FC, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { z } from "zod";

const useCourses = () => {
	const endpoint = `/api/courses${qs.stringify(
		{ depth: 0, sort: "-updatedAt" },
		{ addQueryPrefix: true }
	)}`;
	const { data: courses, refetch } = useQuery(endpoint, async () => {
		const resp = await fetch(endpoint);
		const body = await resp.json();
		return z.array(Course0Schema).parse(body.docs);
	});
	return {
		courses,
		refetchCourses: async () => {
			await refetch();
		}
	};
};

const useViews = (user: User2Schema | null) => {
	const [showCreate, setShowCreate] = useState<boolean>(false);
	const [showRead, setShowRead] = useState<boolean>(false);
	const [showEdit, setShowEdit] = useState<boolean>(false);
	const [showDelete, setShowDelete] = useState<boolean>(false);
	useEffect(() => {
		if (!user) return;
		const views = getUserAllowedViews(user);
		setShowCreate(views.has(ViewEnum["courses:table:create"]));
		setShowRead(views.has(ViewEnum["courses:table:read"]));
		setShowEdit(views.has(ViewEnum["courses:table:update"]));
		setShowDelete(views.has(ViewEnum["courses:table:delete"]));
	}, [user]);
	return { showCreate, showRead, showEdit, showDelete };
};

interface TableData {
	id: string;
	title: string;
}

const useTableData = (courses: Course0Schema[] | undefined) => {
	const [tableData, setTableData] = useState<TableData[]>([]);
	useEffect(() => {
		if (!courses) return;
		const tableData = courses.map((course) => ({
			id: course.id,
			title: course.title
		}));
		setTableData(tableData);
	}, [courses]);
	return { tableData };
};

const deleteCourse = async (
	courseId: string,
	refetchCourses: () => Promise<void>
) => {
	await fetch(`/api/courses/${courseId}`, {
		method: "DELETE",
		headers: { "Content-Type": "application/json" }
	});
	await refetchCourses();
};

export const CoursesTable: FC = () => {
	const { user } = useAuth();
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
		{}
	);
	const [rowSelection, setRowSelection] = useState({});
	const { courses, refetchCourses } = useCourses();

	const [creating, setCreating] = useState<boolean>(false);
	const [editting, setEditting] = useState<string | null>(null);

	const { showCreate, showDelete, showEdit } = useViews(user);

	const { tableData } = useTableData(courses);

	const columns: ColumnDef<TableData>[] = [
		{ accessorKey: "title" },
		{
			id: "actions",
			cell: ({ row: { original: course } }) => (
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
									deleteCourse(course.id, refetchCourses)
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
							{showCreate && (
								<Link href={`/courses/${course.id}`}>
									<DropdownMenuItem>Detail</DropdownMenuItem>
								</Link>
							)}
							{showEdit && (
								<DropdownMenuItem
									onClick={() => setEditting(course.id)}
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
		state: { sorting, columnFilters, columnVisibility, rowSelection }
	});

	return (
		<>
			<div className="flex items-center py-4">
				{showCreate && (
					<Button onClick={() => setCreating(true)}>
						Create Course
					</Button>
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
						{!courses ? (
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
			<div className="flex-1 text-sm text-muted-foreground">
				{table.getFilteredSelectedRowModel().rows.length} of{" "}
				{table.getFilteredRowModel().rows.length} row(s) selected.
			</div>
			{!!creating && (
				<CreateCourseForm
					open={creating}
					setOpen={setCreating}
					refetchCourses={refetchCourses}
				/>
			)}
			{!!editting && (
				<EditCourseForm
					courseId={editting}
					setCourseId={setEditting}
					refetchCourses={refetchCourses}
				/>
			)}
		</>
	);
};
