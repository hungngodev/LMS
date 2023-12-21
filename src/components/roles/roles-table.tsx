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
import { CreateRoleForm } from "@/components/forms/create-role-form";
import { EditRoleForm } from "@/components/forms/edit-role-form";
import { RoleDetail } from "@/components/roles/role-detail";
import { Skeleton } from "@/components/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/table";
import { useAllRoles } from "@/hooks/roles/use-all-roles";
import { useAuth } from "@/hooks/use-auth";
import { ToastInvoker, useToast } from "@/hooks/use-toast";
import { Role0Schema } from "@/models/cms/role-0";
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
import { FC, useEffect, useState } from "react";

const useViews = (user: User2Schema | null) => {
	const [showCreate, setShowCreate] = useState<boolean>(false);
	const [showRead, setShowRead] = useState<boolean>(false);
	const [showEdit, setShowEdit] = useState<boolean>(false);
	const [showDelete, setShowDelete] = useState<boolean>(false);
	useEffect(() => {
		if (!user) return;
		const views = getUserAllowedViews(user);
		setShowCreate(views.has(ViewEnum["roles:table:create"]));
		setShowRead(views.has(ViewEnum["roles:table:read"]));
		setShowEdit(views.has(ViewEnum["roles:table:update"]));
		setShowDelete(views.has(ViewEnum["roles:table:delete"]));
	}, [user]);
	return { showCreate, showRead, showEdit, showDelete };
};
interface TableData {
	id: string;
	name: string;
}

const useTableData = (roles: Role0Schema[] | undefined) => {
	const [tableData, setTableData] = useState<TableData[]>([]);
	useEffect(() => {
		if (!roles) return;
		const tableData = roles.map((role) => ({
			id: role.id,
			name: role.name
		}));
		setTableData(tableData);
	}, [roles]);
	return { tableData };
};

const deleteRole = async (
	roleId: string,
	toast: ToastInvoker,
	refetchRoles: () => Promise<void>
) => {
	toast({ title: "Deleting" });
	try {
		const resp = await fetch(`/api/roles/${roleId}`, {
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
		toast({ title: "Success", description: "Role delete" });
	} catch (error) {
		console.error(error);
		toast({
			title: "Uh oh, something went wrong",
			description: "There was a problem in our system, please try again",
			variant: "destructive"
		});
	}
	await refetchRoles();
};

export const RolesTable: FC = () => {
	const { user } = useAuth();
	const { toast } = useToast();
	const { roles, refetchRoles } = useAllRoles();

	const [creating, setCreating] = useState<boolean>(false);
	const [viewing, setViewing] = useState<string | null>(null);
	const [editting, setEditting] = useState<string | null>(null);

	const { showCreate, showRead, showDelete, showEdit } = useViews(user);

	const { tableData } = useTableData(roles);

	const columns: ColumnDef<TableData>[] = [
		{ accessorKey: "name" },
		{
			id: "actions",
			enableHiding: false,
			cell: ({ row }) => {
				const role = row.original;
				return (
					<AlertDialog>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									Are you absolutely sure?
								</AlertDialogTitle>
								<AlertDialogDescription>
									This action cannot be undone. This will
									permanently delete your role.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction
									onClick={() =>
										deleteRole(role.id, toast, refetchRoles)
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
								{showRead && (
									<DropdownMenuItem
										onClick={() => setViewing(role.id)}
									>
										Detail
									</DropdownMenuItem>
								)}
								{showEdit && (
									<DropdownMenuItem
										onClick={() => setEditting(role.id)}
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

	const table = useReactTable({
		data: tableData,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel()
	});

	return (
		<>
			<div className="flex items-center py-4">
				{showCreate && (
					<Button onClick={() => setCreating(true)}>
						Create Role
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
						{!roles ? (
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
			{!!showCreate && (
				<CreateRoleForm
					open={creating}
					setOpen={setCreating}
					refetchRoles={refetchRoles}
				/>
			)}
			{!!editting && (
				<EditRoleForm
					editting={editting}
					setEditting={setEditting}
					refetchRoles={refetchRoles}
				/>
			)}
			{!!viewing && (
				<RoleDetail
					roleId={viewing}
					setRoleId={setViewing}
					variant="table"
				/>
			)}
		</>
	);
};
