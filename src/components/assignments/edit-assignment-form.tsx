import { Button } from "@/components/button";
import { Calendar } from "@/components/calendar";
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
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle
} from "@/components/sheet";
import { Skeleton } from "@/components/skeleton";
import { ToastInvoker, useToast } from "@/hooks/use-toast";
import { Assignment0Schema } from "@/models/cms/assignment-0";
import { cn } from "@/utils/cn";
import { dateToHourColonMinute } from "@/utils/date-to-hour-colon-minute";
import { hourColonMinuteToDate } from "@/utils/hour-colon-minute-to-date";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import qs from "qs";
import { Dispatch, FC, SetStateAction, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { UploadAssignmentMedia } from "./upload-assignment-media";

const FormSchema = z.object({
	title: z.string().min(2).max(100),
	dueAtDate: z.date(),
	dueAtTime: z.date(),
	content: z.string().optional(),
	documents: z.array(z.string()).optional(),
	course: z.string()
});

type FormSchema = z.infer<typeof FormSchema>;

const staticProps = {
	title: "Update Assignment",
	description: "",
	formFields: {
		title: {
			label: "Assignment Title",
			placeholder: ""
		},
		dueAtDate: {
			label: "Due Date",
			placeholder: "Pick A Due Date"
		},
		dueAtTime: {
			label: "Due Time",
			placeholder: "Pick A Due Hour"
		},
		richTextContent: {
			label: "Assignment Content",
			placeholder: "Enter Assignment Content"
		},
		documents: {
			label: "Assignment Documents",
			placeholder: ""
		}
	},
	formSubmitText: "Update Assignment"
};

async function onSubmit(
	values: FormSchema,
	assignmentId: string,
	setEditting: Dispatch<SetStateAction<string | null>>,
	refetch: () => Promise<void>,
	toast: ToastInvoker
) {
	const dueAt = new Date(values.dueAtDate);
	dueAt.setHours(values.dueAtTime.getHours());
	dueAt.setMinutes(values.dueAtTime.getMinutes());
	const newAssignment: Partial<Assignment0Schema> = {
		title: values.title,
		dueAt: dueAt.toISOString(),
		content: values.content,
		documents: values.documents,
		course: values.course
	};
	try {
		toast({ title: "Updating..." });
		const resp = await fetch(`/api/assignments/${assignmentId}`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(newAssignment)
		});
		if (resp.ok)
			toast({ title: "Success", description: "Updated assignment" });
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
	await refetch();
	setEditting(null);
}

interface Props {
	editting: string;
	setEditting: Dispatch<SetStateAction<string | null>>;
	refetchAssignments: () => Promise<void>;
}

const fetchDefaultValue = async (
	assignmentId: string,
	setDefaultValues: Dispatch<SetStateAction<FormSchema | null>>
) => {
	const endpoint = `/api/assignments/${assignmentId}${qs.stringify(
		{ depth: 0 },
		{ addQueryPrefix: true }
	)}`;
	const resp = await fetch(endpoint);
	const assignment = Assignment0Schema.parse(await resp.json());
	const defaultValues = {
		title: assignment.title,
		dueAtDate: new Date(assignment.dueAt),
		dueAtTime: new Date(assignment.dueAt),
		content: assignment.content,
		documents: assignment.documents,
		course: assignment.course
	};
	setDefaultValues(defaultValues);
	return defaultValues;
};

export const EditAssignmentForm: FC<Props> = (props) => {
	const { toast } = useToast();
	const [defaultValues, setDefaultValues] = useState<FormSchema | null>(null);

	const form = useForm<FormSchema>({
		resolver: zodResolver(FormSchema),
		defaultValues: async () =>
			fetchDefaultValue(props.editting, setDefaultValues)
	});

	const formRef = useRef<HTMLFormElement>(null);

	return (
		<Sheet open={!!props.editting}>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit((onValid) =>
						onSubmit(
							onValid,
							props.editting,
							props.setEditting,
							async () => {
								await props.refetchAssignments();
							},
							toast
						)
					)}
					ref={formRef}
				>
					<SheetContent
						position="right"
						size="xl"
						onClickOutside={() => props.setEditting(null)}
						onClickClose={() => props.setEditting(null)}
						className="overflow-y-scroll"
					>
						<SheetHeader>
							<SheetTitle>{staticProps.title}</SheetTitle>
							<SheetDescription>
								{staticProps.description}
							</SheetDescription>
						</SheetHeader>
						<div className="space-y-8 max-w-xs">
							<FormField
								control={form.control}
								name="title"
								defaultValue=""
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											{staticProps.formFields.title.label}
										</FormLabel>
										{field.value ? (
											<FormControl>
												<Input
													placeholder={
														staticProps.formFields
															.title.placeholder
													}
													{...field}
												/>
											</FormControl>
										) : (
											<Skeleton className="w-full h-10 rounded-lg" />
										)}
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="dueAtDate"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>
											{
												staticProps.formFields.dueAtDate
													.label
											}
										</FormLabel>
										<Popover>
											{field.value ? (
												<PopoverTrigger asChild>
													<FormControl>
														<Button
															variant={"outline"}
															className={cn(
																"w-full pl-3 text-left font-normal",
																!field.value &&
																	"text-muted-foreground"
															)}
														>
															{field.value ? (
																format(
																	field.value,
																	"PPP"
																)
															) : (
																<span>
																	{
																		staticProps
																			.formFields
																			.dueAtDate
																			.placeholder
																	}
																</span>
															)}
															<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
														</Button>
													</FormControl>
												</PopoverTrigger>
											) : (
												<Skeleton className="w-full h-10 rounded-lg" />
											)}

											<PopoverContent
												className="w-auto p-0"
												align="start"
											>
												<Calendar
													mode="single"
													selected={field.value}
													onSelect={(
														_,
														selectedDay
													) =>
														field.onChange(
															selectedDay
														)
													}
													initialFocus
												/>
											</PopoverContent>
										</Popover>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="dueAtTime"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>
											{
												staticProps.formFields.dueAtTime
													.label
											}
										</FormLabel>
										{field.value ? (
											<div className="flex flex-row">
												<FormControl>
													<Input
														type="time"
														value={dateToHourColonMinute(
															field.value
														)}
														onChange={(e) => {
															if (
																e.target
																	.value ===
																""
															) {
																form.setValue(
																	"dueAtTime",
																	field.value
																);
															} else {
																form.setValue(
																	"dueAtTime",
																	hourColonMinuteToDate(
																		e.target
																			.value
																	)
																);
															}
														}}
													/>
												</FormControl>
											</div>
										) : (
											<Skeleton className="w-full h-10 rounded-lg" />
										)}
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="content"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											{
												staticProps.formFields
													.richTextContent.label
											}
										</FormLabel>
										{defaultValues ? (
											<FormControl>
												<Input
													placeholder={
														staticProps.formFields
															.richTextContent
															.placeholder
													}
													{...field}
												/>
											</FormControl>
										) : (
											<Skeleton className="w-full h-10 rounded-lg" />
										)}
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="documents"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											{
												staticProps.formFields.documents
													.label
											}
										</FormLabel>
										{defaultValues ? (
											<FormControl>
												<UploadAssignmentMedia
													mode="edit"
													courseId={form.getValues(
														"course"
													)}
													documentsId={
														field.value ?? []
													}
													setValue={form.setValue}
												/>
											</FormControl>
										) : (
											<Skeleton className="w-full h-40 rounded-lg" />
										)}
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="flex space-x-4">
								<Button
									variant={"secondary"}
									onClick={() => props.setEditting(null)}
								>
									Cancel
								</Button>
								<Button
									onClick={() =>
										formRef.current?.requestSubmit()
									}
								>
									{staticProps.formSubmitText}
								</Button>
							</div>
						</div>
					</SheetContent>
				</form>
			</Form>
		</Sheet>
	);
};
