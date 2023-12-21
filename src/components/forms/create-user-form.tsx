import { Button } from "@/components/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem
} from "@/components/command";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/components/form";
import { Input } from "@/components/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle
} from "@/components/sheet";
import { Spinner } from "@/components/spinner";
import { ToastInvoker, useToast } from "@/hooks/use-toast";
import { Role0Schema } from "@/models/cms/role-0";
import { cn } from "@/utils/cn";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { Dispatch, FC, SetStateAction, useRef } from "react";
import { UseFormReturn, useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { z } from "zod";

const FormSchema = z.object({
	email: z.string().min(2).max(50),
	fullName: z.string(),
	password: z.string().min(8),
	confirmPassword: z.string().min(8),
	roles: z.string()
});
type FormSchema = z.infer<typeof FormSchema>;

const staticProps = {
	buttonText: "Create User",
	title: "Create User",
	description: "",
	formFields: {
		email: {
			label: "Email",
			placeholder: ""
		},
		fullName: {
			label: "Full Name",
			placeholder: ""
		},
		roles: {
			label: "Roles",
			placeholder: "Pick A Role",
			searchBarPlaceholder: "No Roles Found",
			emptySearchText: "Pick A Role"
		},
		password: {
			label: "Password",
			placeholder: ""
		},
		confirmPassword: {
			label: "Confirm Password",
			placeholder: ""
		}
	},
	formSubmitText: "Create User"
};

async function onSubmit(
	values: FormSchema,
	form: UseFormReturn<FormSchema>,
	setOpen: Dispatch<SetStateAction<boolean>>,
	toast: ToastInvoker,
	refetch?: () => Promise<void>
) {
	(values as any).roles = [values.roles];
	try {
		await fetch("/api/users", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(values)
		});
		form.reset();
		if (!!refetch) await refetch();
		setOpen(false);
		toast({
			title: "Success",
			description: `Created user ${values.email}`
		});
	} catch (error) {
		console.error(error);
		toast({
			title: "Uh oh, something went wrong",
			description:
				"There was a problem in our system, please try again later",
			variant: "destructive"
		});
	}
}

const useRoleChoices = () => {
	const { data: roles } = useQuery<{ label: string; value: string }[]>(
		"/api/roles",
		async () => {
			const resp = await fetch("/api/roles");
			const roles = await resp.json();
			return roles.docs.map((role: Role0Schema) => ({
				label: role.name,
				value: role.id
			}));
		}
	);
	return { roles };
};

interface Props {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	defaultRoleId?: string;
	refetchUsers?: () => Promise<void>;
}

export const CreateUserForm: FC<Props> = (props) => {
	const { toast } = useToast();

	const form = useForm<FormSchema>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			email: "",
			fullName: "",
			password: "",
			confirmPassword: "",
			roles: props.defaultRoleId ?? ""
		}
	});

	const formRef = useRef<HTMLFormElement>(null);

	const { roles } = useRoleChoices();

	return (
		<Sheet open={!!props.open}>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit((onValid) =>
						onSubmit(
							onValid,
							form,
							props.setOpen,
							toast,
							props.refetchUsers
						)
					)}
					ref={formRef}
				>
					<SheetContent
						position="right"
						size="xl"
						onClickOutside={() => props.setOpen(false)}
						onClickClose={() => props.setOpen(false)}
					>
						<SheetHeader>
							<SheetTitle>{staticProps.title}</SheetTitle>
							<SheetDescription>
								{staticProps.description}
							</SheetDescription>
						</SheetHeader>
						<div className="space-y-8 pt-8 max-w-xs">
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											{staticProps.formFields.email.label}
										</FormLabel>
										<FormControl>
											<Input
												placeholder={
													staticProps.formFields.email
														.placeholder
												}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="fullName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											{
												staticProps.formFields.fullName
													.label
											}
										</FormLabel>
										<FormControl>
											<Input
												placeholder={
													staticProps.formFields
														.fullName.placeholder
												}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											{
												staticProps.formFields.password
													.label
											}
										</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder={
													staticProps.formFields
														.password.placeholder
												}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											{
												staticProps.formFields
													.confirmPassword.label
											}
										</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder={
													staticProps.formFields
														.confirmPassword
														.placeholder
												}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="roles"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>
											{staticProps.formFields.roles.label}
										</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant="outline"
														role="combobox"
														className={cn(
															"w-full justify-between",
															!field.value &&
																"text-muted-foreground"
														)}
													>
														{field.value
															? roles?.find(
																	(role) =>
																		role.value ===
																		field.value
															  )?.label
															: staticProps
																	.formFields
																	.roles
																	.placeholder}
														<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-full p-0">
												<Command>
													<CommandInput
														placeholder={
															staticProps
																.formFields
																.roles
																.searchBarPlaceholder
														}
														className="py-3"
													/>
													<CommandEmpty>
														{
															staticProps
																.formFields
																.roles
																.emptySearchText
														}
													</CommandEmpty>
													<CommandGroup>
														{roles ? (
															roles.map(
																(role) => (
																	<CommandItem
																		value={
																			role.value
																		}
																		key={
																			role.value
																		}
																		onSelect={(
																			value
																		) => {
																			form.setValue(
																				"roles",
																				value
																			);
																		}}
																	>
																		<Check
																			className={cn(
																				"mr-2 h-4 w-4",
																				role.value ===
																					field.value
																					? "opacity-100"
																					: "opacity-0"
																			)}
																		/>
																		{
																			role.label
																		}
																	</CommandItem>
																)
															)
														) : (
															<Spinner />
														)}
													</CommandGroup>
												</Command>
											</PopoverContent>
										</Popover>
									</FormItem>
								)}
							/>
							<SheetClose asChild>
								<Button
									onClick={() =>
										formRef.current?.requestSubmit()
									}
								>
									{staticProps.formSubmitText}
								</Button>
							</SheetClose>
						</div>
					</SheetContent>
				</form>
			</Form>
		</Sheet>
	);
};
