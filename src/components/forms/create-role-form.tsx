import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from "@/components/accordion";
import { Button } from "@/components/button";
import { Checkbox } from "@/components/checkbox";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/components/form";
import { Input } from "@/components/input";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle
} from "@/components/sheet";
import { Skeleton } from "@/components/skeleton";
import { Header4 } from "@/components/typography/h4";
import { useAllActions } from "@/hooks/actions/use-all-actions";
import { useGroupedActions } from "@/hooks/actions/use-grouped-actions";
import { useAllRoles } from "@/hooks/roles/use-all-roles";
import { ToastInvoker, useToast } from "@/hooks/use-toast";
import { useAllViews } from "@/hooks/views/use-all-views";
import { useGroupedViews } from "@/hooks/views/use-grouped-views";
import { Role0Schema } from "@/models/cms/role-0";
import { encodeIamName } from "@/utils/encode-iam-name";
import { parseScopeToUserReadableScope } from "@/utils/parse-scope-to-user-readable-scope";
import { UnflatActionStrings } from "@/utils/unflat-action-strings";
import { UnflatViewStrings } from "@/utils/unflat-view-strings";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, FC, SetStateAction, useCallback, useRef } from "react";
import {
	ControllerRenderProps,
	UseFormReset,
	UseFormReturn,
	useForm
} from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
	name: z.string().nonempty({ message: "Role Name is required" }),
	actions: z
		.array(z.string())
		.min(1, { message: "Role must have some allowed actions" }),
	views: z.array(z.string()).min(0)
});

type FormSchema = z.infer<typeof FormSchema>;

const onSubmit = async (
	formData: FormSchema,
	refetchRoles: () => Promise<void>,
	reset: UseFormReset<FormSchema>,
	setOpen: Dispatch<SetStateAction<boolean>>,
	toast: ToastInvoker
) => {
	const iamName = encodeIamName(formData.name);
	const newRole = { ...formData, iamName };
	try {
		toast({ title: `Adding new role "${formData.name}" to organization` });
		const resp = await fetch(`/api/roles`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(newRole)
		});
		if (resp.status === 201) {
			toast({
				title: "Success",
				description: `Added ${formData.name} to organization`
			});
			reset();
			setOpen(false);
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
	await refetchRoles();
};

interface RoleFieldProps {
	form: UseFormReturn<FormSchema>;
	allRoles: Role0Schema[];
}

const RoleFieldName: FC<RoleFieldProps> = (props) => {
	return (
		<FormField
			control={props.form.control}
			name="name"
			defaultValue=""
			render={({ field, fieldState }) => (
				<FormItem>
					<FormLabel asChild>
						<Header4>Role Name</Header4>
					</FormLabel>
					<FormControl>
						<Input placeholder="Enter role name" {...field} />
					</FormControl>
					{fieldState?.error && (
						<FormMessage>{fieldState.error.message}</FormMessage>
					)}
				</FormItem>
			)}
		/>
	);
};

interface NestedActionAccordionProps {
	currentLevelKey: string;
	actionId?: string;
	actionChildren?: UnflatActionStrings;
	allRoles: Role0Schema[];
	form: UseFormReturn<FormSchema>;
	formField: ControllerRenderProps<FormSchema, "actions">;
}

const NestedActionAccordion: FC<NestedActionAccordionProps> = (props) => {
	const handleOnCheckChanges = useCallback(
		(checked: boolean) => {
			if (!props.actionId) return;
			if (checked) {
				props.form.setValue(
					"actions",
					Array.from(
						new Set([...props.formField.value, props.actionId])
					)
				);
			} else {
				props.form.setValue(
					"actions",
					props.formField.value.filter((id) => id !== props.actionId)
				);
			}
		},
		[props.form, props.formField.value, props.actionId]
	);
	return (
		<div className="flex flex-col capitalize">
			{props.actionId ? (
				<div className="flex flex-col">
					{!!props.actionChildren && (
						<div className="border-y py-1 my-1">
							{props.currentLevelKey}
						</div>
					)}
					<div className="capitalize flex items-center">
						<FormControl>
							<Checkbox
								className="mr-1.5"
								checked={props.formField.value.includes(
									props.actionId
								)}
								onCheckedChange={handleOnCheckChanges}
							/>
						</FormControl>
						{!props.actionChildren
							? parseScopeToUserReadableScope(
									props.currentLevelKey,
									props.allRoles
							  )
							: "All"}
					</div>
					{props.actionChildren &&
						Object.entries(props.actionChildren).map(
							([key, val]) => (
								<NestedActionAccordion
									key={key}
									currentLevelKey={key}
									actionId={val.id}
									actionChildren={val.children}
									allRoles={props.allRoles}
									form={props.form}
									formField={props.formField}
								/>
							)
						)}
				</div>
			) : (
				<Accordion type="multiple" className="space-y-5 w-full">
					<AccordionItem
						value={props.currentLevelKey}
						className="border-b-0"
					>
						<AccordionTrigger className="capitalize">
							{props.currentLevelKey}
						</AccordionTrigger>
						<AccordionContent className="border-l ml-2.5 pl-2.5">
							{props.actionChildren &&
								Object.entries(props.actionChildren).map(
									([key, val]) => (
										<NestedActionAccordion
											key={key}
											currentLevelKey={key}
											actionId={val.id}
											actionChildren={val.children}
											allRoles={props.allRoles}
											form={props.form}
											formField={props.formField}
										/>
									)
								)}
						</AccordionContent>
						<div className="border-b ml-2.5" />
					</AccordionItem>
				</Accordion>
			)}
		</div>
	);
};

interface NestedViewAccordionProps {
	currentLevelKey: string;
	viewId?: string;
	viewChildren?: UnflatViewStrings;
	allRoles: Role0Schema[];
	form: UseFormReturn<FormSchema>;
	formField: ControllerRenderProps<FormSchema, "views">;
}

const NestedViewAccordion: FC<NestedViewAccordionProps> = (props) => {
	const handleOnCheckChanges = useCallback(
		(checked: boolean | "indeterminate") => {
			if (!props.viewId) return;
			if (!!checked) {
				props.form.setValue(
					"views",
					Array.from(
						new Set([...props.formField.value, props.viewId])
					)
				);
			} else {
				props.form.setValue(
					"views",
					props.formField.value.filter((id) => id !== props.viewId)
				);
			}
		},
		[props.form, props.formField.value, props.viewId]
	);
	return (
		<div className="flex flex-col">
			{props.viewId ? (
				<Accordion
					type="single"
					className="space-y-5 w-full"
					value={
						props.formField.value.includes(props.viewId)
							? props.viewId
							: undefined
					}
				>
					<div className="capitalize flex items-center">
						<FormControl>
							<Checkbox
								className="mr-1.5"
								checked={props.formField.value.includes(
									props.viewId
								)}
								onCheckedChange={handleOnCheckChanges}
							/>
						</FormControl>
						{parseScopeToUserReadableScope(
							props.currentLevelKey,
							props.allRoles
						)}
					</div>
					{props.viewChildren && (
						<AccordionItem
							value={props.viewId}
							className="border-b-0"
						>
							<AccordionContent className="border-l ml-2.5 pl-2.5">
								{Object.entries(props.viewChildren).map(
									([key, val]) => (
										<NestedViewAccordion
											key={key}
											currentLevelKey={key}
											viewId={val.id}
											viewChildren={val.children}
											allRoles={props.allRoles}
											form={props.form}
											formField={props.formField}
										/>
									)
								)}
							</AccordionContent>
							{props.formField.value.includes(props.viewId) && (
								<div className="border-b mb-1 ml-2.5" />
							)}
						</AccordionItem>
					)}
				</Accordion>
			) : (
				<Accordion type="multiple" className="space-y-5 w-full">
					<AccordionItem
						value={props.currentLevelKey}
						className="border-b-0"
					>
						<AccordionTrigger className="capitalize">
							{props.currentLevelKey}
						</AccordionTrigger>
						<AccordionContent className="border-l ml-2.5 pl-2.5">
							{props.viewChildren &&
								Object.entries(props.viewChildren).map(
									([key, val]) => (
										<NestedViewAccordion
											key={key}
											currentLevelKey={key}
											viewId={val.id}
											viewChildren={val.children}
											allRoles={props.allRoles}
											form={props.form}
											formField={props.formField}
										/>
									)
								)}
						</AccordionContent>
						<div className="border-b ml-2.5" />
					</AccordionItem>
				</Accordion>
			)}
		</div>
	);
};

const RoleFieldActions: FC<RoleFieldProps> = (props) => {
	const { actions } = useAllActions();
	const { groupedActions } = useGroupedActions(actions);
	return (
		<div className="space-y-8 pt-8 flex flex-col">
			<Header4>Actions</Header4>
			{groupedActions ? (
				<FormField
					control={props.form.control}
					name="actions"
					render={({ field, fieldState }) => (
						<FormItem>
							{fieldState?.error && (
								<FormMessage>
									{fieldState.error.message}
								</FormMessage>
							)}
							<div className="flex flex-col space-y-4">
								{groupedActions.children &&
									Object.entries(groupedActions.children).map(
										([key, val]) => (
											<NestedActionAccordion
												key={key}
												currentLevelKey={key}
												actionId={val.id}
												actionChildren={val.children}
												allRoles={props.allRoles}
												form={props.form}
												formField={field}
											/>
										)
									)}
							</div>
						</FormItem>
					)}
				/>
			) : (
				<Skeleton className="h-40 w-full rounded-lg" />
			)}
		</div>
	);
};

const RoleFieldViews: FC<RoleFieldProps> = (props) => {
	const { views } = useAllViews();
	const { groupedViews } = useGroupedViews(views);
	return (
		<div className="space-y-8 pt-8 flex flex-col">
			<Header4>Views</Header4>
			{groupedViews ? (
				<FormField
					control={props.form.control}
					name="views"
					render={({ field }) => (
						<div className="flex flex-col space-y-4">
							{groupedViews.children &&
								Object.entries(groupedViews.children).map(
									([key, val]) => (
										<NestedViewAccordion
											key={key}
											currentLevelKey={key}
											viewId={val.id}
											viewChildren={val.children}
											allRoles={props.allRoles}
											form={props.form}
											formField={field}
										/>
									)
								)}
						</div>
					)}
				/>
			) : (
				<Skeleton className="h-40 w-full rounded-lg" />
			)}
		</div>
	);
};

interface Props {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	refetchRoles: () => Promise<void>;
}

export const CreateRoleForm: FC<Props> = (props) => {
	const { toast } = useToast();
	const form = useForm<FormSchema>({
		resolver: zodResolver(FormSchema),
		defaultValues: { actions: [], views: [] }
	});
	const formRef = useRef<HTMLFormElement>(null);
	const { roles } = useAllRoles();

	return (
		<Sheet open={props.open}>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit((onValid) =>
						onSubmit(
							onValid,
							props.refetchRoles,
							form.reset,
							props.setOpen,
							toast
						)
					)}
					ref={formRef}
				>
					<SheetContent
						position="right"
						size="xl"
						onClickOutside={() => props.setOpen(false)}
						onClickClose={() => props.setOpen(false)}
						className="overflow-y-auto space-y-8"
					>
						<SheetHeader>
							<SheetTitle>
								Add Roles To Your Organization
							</SheetTitle>
						</SheetHeader>
						<div className="space-y-8 max-w-xs">
							<RoleFieldName form={form} allRoles={roles ?? []} />
							<RoleFieldActions
								form={form}
								allRoles={roles ?? []}
							/>
							<RoleFieldViews
								form={form}
								allRoles={roles ?? []}
							/>
						</div>
						<Button
							onClick={() => formRef.current?.requestSubmit()}
						>
							Create Role
						</Button>
					</SheetContent>
				</form>
			</Form>
		</Sheet>
	);
};
