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
import { EditLocationsForm } from "@/components/forms/edit-location-form";
import { LocationDetail } from "@/components/locations/location-detail";
import { Skeleton } from "@/components/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/table";
import { useAllLocations } from "@/hooks/locations/use-all-locations";
import { useAuth } from "@/hooks/use-auth";
import { ToastInvoker, useToast } from "@/hooks/use-toast";
import { Location0Schema } from "@/models/cms/location-0";
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
import { CreateLocationsForm } from "../forms/create-location-form";

const useViews = (user: User2Schema | null) => {
	const [showView, setShowView] = useState<boolean>(false);
	const [showEdit, setShowEdit] = useState<boolean | null>(null);
	const [showDelete, setShowDelete] = useState<boolean | null>(null);
	const [showCreate, setShowCreate] = useState<boolean | null>(null);
	useEffect(() => {
		if (!user) return;
		const views = getUserAllowedViews(user);
		setShowCreate(views.has(ViewEnum["locations:table:create"]));
		setShowView(views.has(ViewEnum["locations:table:read"]));
		setShowEdit(views.has(ViewEnum["locations:table:update"]));
		setShowDelete(views.has(ViewEnum["locations:table:delete"]));
	}, [user]);
	return { showEdit, showView, showDelete, showCreate };
};

interface TableData {
	id: string;
	name: string;
	updatedAt: string;
	createdAt: string;
}

const useTableData = (locations: Location0Schema[] | undefined) => {
	const [tableData, setTableData] = useState<TableData[]>([]);
	useEffect(() => {
		if (!locations) return;
		const tableData = locations.map((location) => ({
			id: location.id,
			name: location.name,
			updatedAt: jsDateToDateMonthHourMinute(
				new Date(location.updatedAt)
			),
			createdAt: jsDateToDateMonthHourMinute(new Date(location.createdAt))
		}));
		setTableData(tableData);
	}, [locations]);
	return { tableData, setTableData };
};

const deleteLocation = async (
	locationId: string,
	toast: ToastInvoker,
	refetchLocations: () => Promise<void>
) => {
	try {
		const resp = await fetch(`/api/locations/${locationId}`, {
			method: "DELETE",
			headers: { "Content-Type": "application/json" }
		});
		if (resp.status === 200) {
			toast({ title: "Success", description: "Deleted location" });
		} else {
			toast({
				title: "Uh oh, something went wrong",
				description:
					"There was a problem with our system, please try again later",
				variant: "destructive"
			});
		}
	} catch (error) {
		console.error(error);
		toast({
			title: "Uh oh, something went wrong",
			description:
				"There was a problem with our system, please try again later",
			variant: "destructive"
		});
	}
	await refetchLocations();
};

export const LocationsTable: FC = (props) => {
	const { user } = useAuth();
	const { toast } = useToast();
	const { showCreate, showView, showDelete, showEdit } = useViews(user);

	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
		{}
	);
	const [rowSelection, setRowSelection] = useState({});

	const { locations, refetchLocations } = useAllLocations();

	const [creating, setCreating] = useState<boolean>(false);
	const [editting, setEditting] = useState<string | null>(null);
	const [viewing, setViewing] = useState<string | null>(null);

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
			cell: ({ row }) => {
				const location = row.original;
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
									onClick={() =>
										deleteLocation(
											location.id,
											toast,
											refetchLocations
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
										onClick={() => setViewing(location.id)}
									>
										Detail
									</DropdownMenuItem>
								)}
								{showEdit && (
									<DropdownMenuItem
										onClick={() => setEditting(location.id)}
									>
										Edit
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

	const { tableData } = useTableData(locations);

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
		<div>
			<div className="flex items-center py-4">
				{showCreate && (
					<Button onClick={() => setCreating(true)}>
						Create Location
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
						{!locations ? (
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
			{!!creating && (
				<CreateLocationsForm
					open={creating}
					setOpen={setCreating}
					refetchLocations={refetchLocations}
				/>
			)}
			{!!editting && (
				<EditLocationsForm
					editting={editting}
					setEditting={setEditting}
					refetchLocations={refetchLocations}
				/>
			)}
			{!!viewing && (
				<LocationDetail
					locationId={viewing}
					setLocationId={setViewing}
				/>
			)}
		</div>
	);
};
