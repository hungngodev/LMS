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
import { CreateUserForm } from "@/components/forms/create-user-form";
import { EditUserForm } from "@/components/forms/edit-user-form";
import { Skeleton } from "@/components/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableRow as TableData,
	TableHead,
	TableHeader
} from "@/components/table";
import { UserCardDetail } from "@/components/users/user-card-detail";
import { useAuth } from "@/hooks/use-auth";
import { ToastInvoker, useToast } from "@/hooks/use-toast";
import { useAllUsers } from "@/hooks/users/use-all-users";
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

const deleteUser = async (
	uid: string,
	toast: ToastInvoker,
	refetchUsers: () => Promise<void>
) => {
	toast({ title: "Deleting user..." });
	try {
		const resp = await fetch(`/api/users/${uid}`, {
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
		toast({ title: "Success", description: "User delete" });
	} catch (error) {
		console.error(error);
		toast({
			title: "Uh oh, something went wrong",
			description: "There was a problem in our system, please try again",
			variant: "destructive"
		});
	}
	await refetchUsers();
};

interface TableData {
	id: string;
	fullName: string;
	email: string;
}

const useTableData = (users: User2Schema[] | undefined) => {
	const [tableData, setTableData] = useState<TableData[]>([]);
	useEffect(() => {
		if (!users) return;
		setTableData(
			users.map((user) => ({
				id: user.id,
				fullName: user.fullName,
				email: user.email
			}))
		);
	}, [users]);
	return { tableData };
};

const useViews = (user: User2Schema | null) => {
	const [showCreate, setShowCreate] = useState<boolean | null>(null);
	const [showView, setShowView] = useState<boolean>(false);
	const [showEdit, setShowEdit] = useState<boolean | null>(null);
	const [showDelete, setShowDelete] = useState<boolean | null>(null);
	useEffect(() => {
		if (!user) return;
		const views = getUserAllowedViews(user);
		setShowCreate(views.has(ViewEnum["users:table:create"]));
		setShowView(views.has(ViewEnum["users:table:read"]));
		setShowEdit(views.has(ViewEnum["users:table:update"]));
		setShowDelete(views.has(ViewEnum["users:table:delete"]));
	}, [user]);
	return { showCreate, showView, showEdit, showDelete };
};

interface Props {
	role?: string;
}

export const UsersTable: FC<Props> = (props) => {
	const { user } = useAuth();
	const { toast } = useToast();
	const { showCreate, showDelete, showEdit } = useViews(user);

	const [viewing, setViewing] = useState<string | null>(null);
	const [editting, setEditting] = useState<string | null>(null);
	const [creating, setCreating] = useState<boolean>(false);

	const { users, refetchUsers } = useAllUsers({
		roles: { contains: props.role }
	});

	const { tableData } = useTableData(users);

	const columns: ColumnDef<TableData>[] = [
		{ accessorKey: "fullName" },
		{ accessorKey: "email" },
		{
			id: "actions",
			enableHiding: false,
			cell: ({ row }) => {
				const user = row.original;
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
									onClick={() =>
										deleteUser(user.id, toast, refetchUsers)
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
									onClick={() => setViewing(user.id)}
								>
									Detail
								</DropdownMenuItem>
								{showEdit && (
									<DropdownMenuItem
										onClick={() => setEditting(user.id)}
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
		<div>
			<div className="flex items-center py-4">
				{showCreate && (
					<Button onClick={() => setCreating(true)}>
						Create User
					</Button>
				)}
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableData key={headerGroup.id}>
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
							</TableData>
						))}
					</TableHeader>
					<TableBody>
						{!tableData ? (
							<>
								{[1, 2, 3, 4].map((i) => (
									<TableData key={i}>
										<TableCell colSpan={columns.length}>
											<Skeleton className="w-full h-10 rounded-lg" />
										</TableCell>
									</TableData>
								))}
							</>
						) : (
							<>
								{table.getRowModel().rows?.length ? (
									table.getRowModel().rows.map((row) => (
										<TableData
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
										</TableData>
									))
								) : (
									<TableData>
										<TableCell
											colSpan={columns.length}
											className="h-24 text-center"
										>
											No results.
										</TableCell>
									</TableData>
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
			{viewing && (
				<UserCardDetail userId={viewing} setUserId={setViewing} />
			)}
			{editting && (
				<EditUserForm
					userId={editting}
					setUserId={setEditting}
					refetchUsers={refetchUsers}
				/>
			)}
			{creating && (
				<CreateUserForm open={creating} setOpen={setCreating} />
			)}
		</div>
	);
};
