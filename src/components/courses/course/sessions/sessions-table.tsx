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
import { CreateSessionForm } from "@/components/courses/course/sessions/create-session-form";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/dropdown-menu";
import { Input } from "@/components/input";
import { Spinner } from "@/components/spinner";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/table";
import { Session0Schema } from "@/models/cms/session-0";
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
export interface SessionTableProps {
	courseId: string;
}

const useSessions = (courseId: string) => {
	const sessionsQuery: Where = {
		course: { equals: courseId }
	};
	const {
		data: sessions,
		refetch,
		isLoading
	} = useQuery(
		`/api/sessions${qs.stringify(
			{ where: sessionsQuery, depth: 0 },
			{ addQueryPrefix: true }
		)}`,
		async () => {
			const resp = await fetch(
				`/api/sessions${qs.stringify(
					{ where: sessionsQuery, depth: 0 },
					{ addQueryPrefix: true }
				)}`
			);
			const body = await resp.json();
			const sessions = z
				.array(Session0Schema)
				.optional()
				.parse(body.docs);
			return sessions;
		}
	);
	return { sessions: sessions ?? [], refetch, isLoading };
};

export const SessionsTable: FC<SessionTableProps> = (props) => {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
		{}
	);
	const [rowSelection, setRowSelection] = useState({});
	const { sessions, refetch, isLoading } = useSessions(props.courseId);
	const deleteSession = async (session: Session0Schema) => {
		await fetch(`/api/sessions/${session.id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json"
			}
		});
		await refetch();
	};

	const columns: ColumnDef<Session0Schema>[] = [
		{
			accessorKey: "id",
			header: "Id"
		},
		{
			accessorKey: "startTime",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() =>
							column.toggleSorting(column.getIsSorted() === "asc")
						}
					>
						Start Time
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			}
		},
		{
			accessorKey: "endTime",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() =>
							column.toggleSorting(column.getIsSorted() === "asc")
						}
					>
						End Time
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
			id: "actions",
			enableHiding: false,
			cell: ({ row }) => {
				const session = row.original;
				return (
					<AlertDialog>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									Are you absolutely sure?
								</AlertDialogTitle>
								<AlertDialogDescription>
									This action cannot be undone. This will
									permanently delete your location.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction
									onClick={() => deleteSession(session)}
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
											session.id
										)
									}
								>
									Copy ID
								</DropdownMenuItem>
								<Link
									href={`/courses/${props.courseId}/sessions/${session.id}`}
								>
									<DropdownMenuItem>Detail</DropdownMenuItem>
								</Link>
								<Link
									href={`/courses/${props.courseId}/sessions/${session.id}/edit`}
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
		data: sessions,
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

	const [open, setOpen] = useState<boolean>(false);
	return (
		<div>
			<div className="flex items-center py-4">
				<Input
					placeholder="Filter name"
					value={
						(table.getColumn("name")?.getFilterValue() as string) ??
						""
					}
					onChange={(event) =>
						table
							.getColumn("name")
							?.setFilterValue(event.target.value)
					}
					className="max-w-sm"
				/>
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
				<div className="ml-4">
					<CreateSessionForm
						refetch={async () => {
							await refetch();
						}}
						courseId={props.courseId}
						open={open}
						setOpen={setOpen}
					/>
				</div>
			</div>
			<div className="rounded-md border">
				{isLoading && sessions ? (
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
