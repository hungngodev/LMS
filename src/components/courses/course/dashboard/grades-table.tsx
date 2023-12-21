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
import { Checkbox } from "@/components/checkbox";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/dropdown-menu";
import { Spinner } from "@/components/spinner";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/table";
import { Grade0Schema } from "@/models/cms/grade-0";
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
import Link from "next/link";
import { Where } from "payload/types";
import qs from "qs";
import { FC, useState } from "react";
import { useQuery } from "react-query";
import { z } from "zod";

export interface GradesTableProps {
	courseId: string;
}

const useGrades = (courseId: string) => {
	const gradesQuery: Where = {
		course: { equals: courseId }
	};
	const {
		data: grades,
		refetch,
		isLoading
	} = useQuery(
		`/api/grades${qs.stringify(
			{ where: gradesQuery, depth: 0 },
			{ addQueryPrefix: true }
		)}`,
		async () => {
			const resp = await fetch(
				`/api/grades${qs.stringify(
					{ where: gradesQuery, depth: 0 },
					{ addQueryPrefix: true }
				)}`
			);
			const body = await resp.json();
			const assignments = z
				.array(Grade0Schema)
				.optional()
				.parse(body.docs);
			return assignments;
		}
	);
	return { grades: grades ?? [], refetch, isLoading };
};

export const GradesTable: FC<GradesTableProps> = (props) => {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
		{}
	);
	const [rowSelection, setRowSelection] = useState({});
	const { grades, refetch, isLoading } = useGrades(props.courseId);
	const deleteGrade = async (grade: Grade0Schema) => {
		await fetch(`/api/grades/${grade.id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json"
			}
		});
		await refetch();
	};

	const columns: ColumnDef<Grade0Schema>[] = [
		{ accessorKey: "id", header: "Id" },
		{
			accessorKey: "fullName",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() =>
							column.toggleSorting(column.getIsSorted() === "asc")
						}
					>
						Full Name
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			}
		},
		{
			accessorKey: "title",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() =>
							column.toggleSorting(column.getIsSorted() === "asc")
						}
					>
						Title
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			}
		},
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
			}
		},
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
									permanently delete your user.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction
									onClick={() => deleteGrade(assignment)}
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
									onClick={() =>
										navigator.clipboard.writeText(
											assignment.id
										)
									}
								>
									Copy ID
								</DropdownMenuItem>
								<Link
									href={`/courses/${props.courseId}/assignments/${assignment.id}`}
								>
									<DropdownMenuItem>Detail</DropdownMenuItem>
								</Link>
								<Link
									href={`/courses/${props.courseId}/assignments/${assignment.id}/edit`}
								>
									<DropdownMenuItem>Edit</DropdownMenuItem>
								</Link>
								<AlertDialogTrigger asChild>
									<DropdownMenuItem>Delete</DropdownMenuItem>
								</AlertDialogTrigger>
							</DropdownMenuContent>
						</DropdownMenu>
					</AlertDialog>
				);
			}
		},
		{
			id: "select",
			header: ({ table }) => (
				<Checkbox
					checked={table.getIsAllPageRowsSelected()}
					onCheckedChange={(value) =>
						table.toggleAllPageRowsSelected(!!value)
					}
					aria-label="Select all"
				/>
			),
			cell: ({ row }) => (
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={(value) => row.toggleSelected(!!value)}
					aria-label="Select row"
				/>
			),
			enableSorting: false,
			enableHiding: false
		}
	];

	const table = useReactTable({
		data: grades,
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
		<div>
			<div className="flex items-center py-4">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className="ml-auto w-24">
							Columns
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align="end"
						className="w-24 border border-gray-300 rounded-md bg-gray-200 mt-2"
					>
						{table
							.getAllColumns()
							.filter((column) => column.getCanHide())
							.map((column) => {
								return (
									<DropdownMenuCheckboxItem
										key={column.id}
										className="capitalize h-8 flex items-center"
										checked={column.getIsVisible()}
										onCheckedChange={(value) =>
											column.toggleVisibility(!!value)
										}
									>
										{column.id}
									</DropdownMenuCheckboxItem>
								);
							})}
					</DropdownMenuContent>
				</DropdownMenu>
				<div className="ml-4">
					<Button onClick={async () => await refetch()}>
						Refresh
					</Button>
				</div>
			</div>
			<div className="rounded-md border">
				{isLoading ? (
					<div className="flex justify-center items-center">
						<Spinner />
					</div>
				) : (
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
															header.column
																.columnDef
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
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row) => (
									<TableRow
										key={row.id}
										data-state={
											row.getIsSelected() && "selected"
										}
									>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id}>
												{flexRender(
													cell.column.columnDef.cell,
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
						</TableBody>
					</Table>
				)}
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
		</div>
	);
};
