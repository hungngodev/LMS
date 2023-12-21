import { Button } from "@/components/button";
import { Calendar } from "@/components/calendar";
import { UploadAssignmentMedia } from "@/components/courses/course/assignments/upload-assignment-media";
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
import { Assignment } from "@/types";
import { cn } from "@/utils/cn";
import { dateToHourColonMinute } from "@/utils/date-to-hour-colon-minute";
import { hourColonMinuteToDate } from "@/utils/hour-colon-minute-to-date";
import { CalendarIcon } from "@heroicons/react/20/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Dispatch, FC, SetStateAction, useRef } from "react";
import { UseFormReset, useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
	title: z.string().min(2).max(100),
	dueAtDate: z.date(),
	dueAtTime: z.date(),
	content: z.string().optional(),
	documents: z.array(z.string()).optional()
});

type FormSchema = z.infer<typeof FormSchema>;

const staticProps = {
	title: "Create Assignment",
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
	formSubmitText: "Create Assignment"
};

async function onSubmit(
	values: z.infer<typeof FormSchema>,
	courseId: string,
	toast: ToastInvoker,
	refetch: () => Promise<void>,
	reset: UseFormReset<FormSchema>,
	setOpen: Dispatch<SetStateAction<boolean>>
) {
	const dueAt = new Date(values.dueAtDate);
	dueAt.setHours(values.dueAtTime.getHours());
	dueAt.setMinutes(values.dueAtTime.getMinutes());
	const newAssignment: Partial<Assignment> = {
		title: values.title,
		dueAt: dueAt.toISOString(),
		content: values.content,
		documents: values.documents,
		course: courseId
	};
	toast({ title: "Creating assignment..." });
	try {
		await fetch("/api/assignments", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(newAssignment)
		});
	} catch (error) {
		console.error(error);
		toast({
			title: "Uh oh, something went wrong",
			description: "There was a problem in our system, please try again",
			variant: "destructive"
		});
	}
	toast({
		title: "Success",
		description: `Created assignment ${newAssignment.title}`
	});
	await refetch();
	reset();
	setOpen(false);
}

interface Props {
	courseId: string;
	refetchAssignments: () => Promise<void>;
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
}

export const CreateAssignmentForm: FC<Props> = (props) => {
	const { toast } = useToast();
	const form = useForm<FormSchema>({
		resolver: zodResolver(FormSchema)
	});
	const formRef = useRef<HTMLFormElement>(null);
	return (
		<Sheet open={props.open}>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit((onValid) =>
						onSubmit(
							onValid,
							props.courseId,
							toast,
							props.refetchAssignments,
							form.reset,
							props.setOpen
						)
					)}
					ref={formRef}
				>
					<SheetContent
						position="right"
						size="xl"
						onClickOutside={() => props.setOpen(false)}
						onClickClose={() => props.setOpen(false)}
						className="overflow-y-auto"
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
										<FormControl>
											<Input
												placeholder={
													staticProps.formFields.title
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
								name="dueAtDate"
								defaultValue={new Date()}
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>
											{
												staticProps.formFields.dueAtDate
													.label
											}
										</FormLabel>
										<Popover>
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
								defaultValue={new Date()}
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>
											{
												staticProps.formFields.dueAtTime
													.label
											}
										</FormLabel>
										<div className="flex flex-row">
											<FormControl>
												<Input
													type="time"
													value={dateToHourColonMinute(
														field.value
													)}
													onChange={(e) => {
														if (
															e.target.value ===
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
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="content"
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
											<Input
												placeholder={
													staticProps.formFields
														.richTextContent
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
								name="documents"
								defaultValue={[]}
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											{
												staticProps.formFields.documents
													.label
											}
										</FormLabel>
										{field.value ? (
											<FormControl>
												<UploadAssignmentMedia
													mode="edit"
													courseId={props.courseId}
													documentsId={field.value}
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
									onClick={() => props.setOpen(false)}
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
