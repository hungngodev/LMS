import { Button } from "@/components/button";
import { Checkbox } from "@/components/checkbox";
import { Form } from "@/components/form";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger
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
import { ToastInvoker, useToast } from "@/hooks/use-toast";
import { useUsersExceptIdsWithRoleId } from "@/hooks/users/use-users-except-ids-with-role-id";
import { Course0Schema } from "@/models/cms/course-0";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	useReactTable
} from "@tanstack/react-table";
import qs from "qs";
import {
	Dispatch,
	FC,
	SetStateAction,
	useEffect,
	useRef,
	useState
} from "react";
import { UseFormReturn, useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({ members: z.array(z.string()) });

type FormSchema = z.infer<typeof FormSchema>;

async function onSubmit(
	values: FormSchema,
	courseId: string,
	form: UseFormReturn<FormSchema>,
	setOpen: Dispatch<SetStateAction<boolean>>,
	refetchCourse: () => Promise<void>,
	toast: ToastInvoker
) {
	toast({ title: "Adding member to course..." });
	try {
		const resp = await fetch(`/api/courses/${courseId}`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ members: values.members })
		});
		if (resp.ok)
			toast({ title: "Success", description: "Added members to course" });
		else
			toast({
				title: "Uh oh, something went wrong",
				description:
					"There was a problem in our system, please try again",
				variant: "destructive"
			});
	} catch (error) {
		console.error(error);
		toast({
			title: "Uh oh, something went wrong",
			description: "There was a problem in our system, please try again",
			variant: "destructive"
		});
	}
	await refetchCourse();
	form.reset();
	setOpen(false);
}

const UsersTable: FC<{
	setSelectedUserIds: Dispatch<SetStateAction<Set<string>>>;
	currentMemberIds: string[];
	defaultRoleId?: string;
}> = (props) => {
	const [rowSelection, setRowSelection] = useState({});
	const { users } = useUsersExceptIdsWithRoleId(
		props.currentMemberIds,
		props.defaultRoleId
	);
	interface TableRow {
		id: string;
		fullName: string;
		email: string;
	}
	const [tableData, setTableData] = useState<TableRow[]>([]);
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
	useEffect(() => {
		const selectedUserIds = new Set<string>();
		Object.entries<boolean>(rowSelection).forEach(([key, val]) => {
			if (val) selectedUserIds.add(tableData[parseInt(key)].id);
		});
		props.setSelectedUserIds(selectedUserIds);

		// intentionally leave out "props.setSelectedUserIds" since
		// it will not change anyway
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [rowSelection, tableData]);

	const columns: ColumnDef<TableRow>[] = [
		{ accessorKey: "fullName", header: "Full Name" },
		{ accessorKey: "email", header: "Email" },
		{
			id: "select",
			cell: ({ row }) => (
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={(value) => row.toggleSelected(!!value)}
					aria-label="Select row"
				/>
			)
		}
	];
	const table = useReactTable({
		data: tableData,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onRowSelectionChange: setRowSelection,
		state: { rowSelection }
	});
	return (
		<div className="rounded-md border my-4">
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
					{!tableData ? (
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
						</>
					)}
				</TableBody>
			</Table>
		</div>
	);
};

interface Props {
	courseId: string;
	refetchCourse: () => Promise<void>;
	defaultRoleId?: string;
}

export const AddMemberForm: FC<Props> = (props) => {
	const { toast } = useToast();
	const [defaultValue, setDefaultValue] = useState<string[]>([]);
	const form = useForm<FormSchema>({
		resolver: zodResolver(FormSchema),
		defaultValues: async () => {
			const resp = await fetch(
				`/api/courses/${props.courseId}${qs.stringify(
					{ depth: 0 },
					{ addQueryPrefix: true }
				)}`
			);
			const course = Course0Schema.parse(await resp.json());
			const members = course.members ?? [];
			setDefaultValue(members);
			return { members };
		}
	});

	const [selectedUserIds, setSelectedUserIds] = useState(new Set<string>());
	useEffect(() => {
		const newUserIds = new Set<string>(selectedUserIds);
		form.getValues("members")?.forEach((id) => newUserIds.add(id));
		form.setValue("members", Array.from(newUserIds));
	}, [form, selectedUserIds]);

	const formRef = useRef<HTMLFormElement>(null);

	const [open, setOpen] = useState<boolean>(false);

	return (
		<Sheet open={open}>
			<SheetTrigger asChild>
				<Button onClick={() => setOpen(true)}>Add</Button>
			</SheetTrigger>
			<Form {...form}>
				<form
					ref={formRef}
					onSubmit={form.handleSubmit((onValid) =>
						onSubmit(
							onValid,
							props.courseId,
							form,
							setOpen,
							props.refetchCourse,
							toast
						)
					)}
				>
					<SheetContent
						position="right"
						size="xl"
						onClickOutside={() => setOpen(false)}
						onClickClose={() => setOpen(false)}
					>
						<SheetHeader>
							<SheetTitle>Add Member</SheetTitle>
						</SheetHeader>
						<UsersTable
							defaultRoleId={props.defaultRoleId}
							setSelectedUserIds={setSelectedUserIds}
							currentMemberIds={defaultValue}
						/>
						<div className="max-w-xs flex justify-between">
							<Button
								variant={"outline"}
								onClick={() => setOpen(false)}
							>
								Cancel
							</Button>
							<Button
								variant={"default"}
								onClick={() => formRef.current?.requestSubmit()}
							>
								Add Members To Course
							</Button>
						</div>
					</SheetContent>
				</form>
			</Form>
		</Sheet>
	);
};
