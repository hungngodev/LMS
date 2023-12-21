import { Button } from "@/components/button";
import {
	Command,
	CommandEmpty,
	CommandInput,
	CommandItem
} from "@/components/command";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle
} from "@/components/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/components/form";
import { CreateSubmissionForm } from "@/components/forms/create-submission-form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import { SheetClose } from "@/components/sheet";
import { Spinner } from "@/components/spinner";
import { useCourseAssignments } from "@/hooks/assignments/use-course-assignments";
import { cn } from "@/utils/cn";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommandGroup } from "cmdk";
import { Check, ChevronsUpDown } from "lucide-react";
import { Dispatch, FC, SetStateAction, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface Props {
	courseId: string;
	open: boolean;
	refetchAssignmentsAndSubmissions: () => Promise<void>;
	setOpen: Dispatch<SetStateAction<boolean>>;
}

const FormSchema = z.object({
	assignmentId: z.string().nonempty()
});

type FormSchema = z.infer<typeof FormSchema>;

const staticProps = {
	title: "Select your assignment",
	description: "",
	formFields: {
		title: {
			label: "Assignment Title",
			searchBarPlaceholder: "Search An Assignment",
			emptySearchText: "No Assignment Found",
			placeholder: ""
		},
		richTextContent: {
			label: "Title",
			placeholder: "Enter Content"
		}
	},
	formSubmitText: "Open Create Submission Form"
};

export const SelectASMSubmissionForm: FC<Props> = (props) => {
	const [creating, setCreating] = useState<boolean>(false);
	const [id, setId] = useState<string>("");
	async function onSubmit(values: FormSchema, courseId: string) {
		setCreating(true);
		setId(values.assignmentId);
	}
	const { assignments } = useCourseAssignments(props.courseId);
	const form = useForm<FormSchema>({
		resolver: zodResolver(FormSchema)
	});

	const formRef = useRef<HTMLFormElement>(null);

	const [searchQuery, setSearchQuery] = useState<string>(""); // Local state to store the search query
	const filteredAssignments = assignments?.filter((assignment) =>
		assignment.title.toLowerCase().includes(searchQuery.toLowerCase())
	);
	return (
		<>
			<Dialog open={props.open}>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit((onValid) =>
							onSubmit(onValid, props.courseId)
						)}
						ref={formRef}
					>
						<DialogContent
							onClickClose={() => props.setOpen(false)}
							onClickOutside={() => props.setOpen(false)}
						>
							<DialogHeader>
								<DialogTitle>{staticProps.title}</DialogTitle>
							</DialogHeader>
							<div className="space-y-8">
								<FormField
									control={form.control}
									name="assignmentId"
									defaultValue=""
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												{
													staticProps.formFields
														.richTextContent.label
												}
											</FormLabel>
											<FormControl>
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
																	? assignments?.find(
																			(
																				assignment
																			) =>
																				assignment.id ===
																				field.value
																	  )?.title
																	: staticProps
																			.formFields
																			.title
																			.placeholder}
																<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
															</Button>
														</FormControl>
													</PopoverTrigger>
													<PopoverContent className="w-80 p-0">
														<Command>
															<CommandInput
																placeholder={
																	staticProps
																		.formFields
																		.title
																		.searchBarPlaceholder
																}
																className="py-3"
																value={
																	searchQuery
																}
																onValueChange={(
																	newValue
																) =>
																	setSearchQuery(
																		newValue
																	)
																}
															/>
															<CommandEmpty>
																{
																	staticProps
																		.formFields
																		.title
																		.emptySearchText
																}
															</CommandEmpty>
															<CommandGroup>
																{filteredAssignments ? (
																	filteredAssignments?.map(
																		(
																			assignment
																		) => (
																			<CommandItem
																				value={
																					assignment.id
																				}
																				key={
																					assignment.id
																				}
																				onSelect={(
																					id
																				) => {
																					form.setValue(
																						"assignmentId",
																						id
																					);
																				}}
																			>
																				<Check
																					className={cn(
																						"mr-2 h-4 w-4",
																						assignment.id ===
																							field.value
																							? "opacity-100"
																							: "opacity-0"
																					)}
																				/>
																				{
																					assignment.title
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
											</FormControl>
											<FormMessage />
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
						</DialogContent>
					</form>
				</Form>
			</Dialog>
			<div>
				{creating && (
					<CreateSubmissionForm
						courseId={props.courseId}
						open={creating}
						setOpen={setCreating}
						assignmentId={id}
						refetchAssignmentsAndSubmissions={
							props.refetchAssignmentsAndSubmissions
						}
						setCloseAssignment={props.setOpen}
					/>
				)}
			</div>
		</>
	);
};
