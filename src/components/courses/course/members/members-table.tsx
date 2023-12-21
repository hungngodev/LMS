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
import { AddMemberForm } from "@/components/courses/course/members/add-member-form";
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
import { Course1Schema } from "@/models/cms/course-1";
import { User1Schema } from "@/models/cms/user-1";
import { RoleEnum } from "@/payload/models/role-enum";
import { User } from "@/types";
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
import { FC, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { z } from "zod";

export interface MembersTableProps {
	courseId: string;
	roles?: RoleEnum[];
}

const useCourse = (courseId: string) => {
	const endpoint = `/api/courses/${courseId}${qs.stringify(
		{ depth: 1 },
		{ addQueryPrefix: true }
	)}`;
	const {
		data: course,
		refetch,
		isLoading
	} = useQuery(endpoint, async () => {
		const resp = await fetch(endpoint);
		const course = Course1Schema.parse(await resp.json());
		return course;
	});
	return { course, refetch, isLoading };
};

const useMembers = (
	course: Course1Schema | undefined,
	roles: RoleEnum[] | undefined
) => {
	const [members, setMembers] = useState<User[]>([]);
	const [courseMembersQuery, setCourseMembersQuery] = useState<Where | {}>(
		{}
	);
	useEffect(() => {
		if (!course?.members) return;
		const courseMembersQuery: Where = { and: [] };
		courseMembersQuery.and?.push({
			id: { in: course.members.map((member) => member.id).join(",") }
		});
		if (roles) {
			courseMembersQuery.and?.push({ "roles.name": { like: roles } });
		}
		setCourseMembersQuery(courseMembersQuery);
	}, [course, roles]);

	const { data: _members } = useQuery(
		`/api/users${qs.stringify(
			{ where: courseMembersQuery, depth: 1 },
			{ addQueryPrefix: true }
		)}`,
		async () => {
			const resp = await fetch(
				`/api/users${qs.stringify(
					{ where: courseMembersQuery, depth: 1 },
					{ addQueryPrefix: true }
				)}`
			);
			const body = await resp.json();
			const members = z.array(User1Schema).optional().parse(body.docs);
			return members;
		},
		{
			enabled: JSON.stringify(courseMembersQuery) !== "{}"
		}
	);

	useEffect(() => {
		if (!_members) return;
		setMembers(
			_members.map((member) => ({
				...member,
				roles: member.roles.map((role) => role.name)
			}))
		);
	}, [_members]);
	return members;
};

export const MembersTable: FC<MembersTableProps> = (props) => {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
		{}
	);
	const [rowSelection, setRowSelection] = useState({});

	const { course, refetch, isLoading } = useCourse(props.courseId);

	const members = useMembers(course, props.roles);

	const removeMember = async (user: User) => {
		if (!course?.members) return;
		await fetch(`/api/courses/${props.courseId}`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				members: course.members
					.filter((member) => member.id !== user.id)
					.map((member) => member.id)
					.join(",")
			})
		});
		await refetch();
	};

	const columns: ColumnDef<User>[] = [
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
						Fullname
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			}
		},
		{
			accessorKey: "email",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() =>
							column.toggleSorting(column.getIsSorted() === "asc")
						}
					>
						Email
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			}
		},
		{
			accessorKey: "roles",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() =>
							column.toggleSorting(column.getIsSorted() === "asc")
						}
					>
						Roles
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
									permanently remove this member.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction
									onClick={() => removeMember(user)}
								>
									Remove
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
										navigator.clipboard.writeText(user.id)
									}
								>
									Copy ID
								</DropdownMenuItem>
								<Link href={`/users/${user.id}`}>
									<DropdownMenuItem>Detail</DropdownMenuItem>
								</Link>
								<Link href={`/users/${user.id}/edit`}>
									<DropdownMenuItem>Edit</DropdownMenuItem>
								</Link>
								<AlertDialogTrigger asChild>
									<DropdownMenuItem>Remove</DropdownMenuItem>
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
		data: members,
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
					<AddMemberForm
						refetch={async () => {
							await refetch();
						}}
						course={course}
						roles={props.roles}
						open={open}
						setOpen={setOpen}
					/>
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
