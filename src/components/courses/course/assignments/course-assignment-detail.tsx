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
import { useAssignmentDocuments } from "@/hooks/assignments/use-assignment-documents";
import { Assignment0Schema } from "@/models/cms/assignment-0";
import { AssignmentMedia0Schema } from "@/models/cms/assignment-media-0";
import { formatBytes } from "@/utils/bytes-to-megabytes";
import { cn } from "@/utils/cn";
import { dateToHourColonMinute } from "@/utils/date-to-hour-colon-minute";
import { hourColonMinuteToDate } from "@/utils/hour-colon-minute-to-date";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, DownloadIcon, PaperclipIcon } from "lucide-react";
import qs from "qs";
import { Dispatch, FC, SetStateAction, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
	title: z.string().min(2).max(100),
	dueAtDate: z.date(),
	dueAtTime: z.date(),
	content: z.string().optional(),
	documents: Assignment0Schema
});

type FormSchema = z.infer<typeof FormSchema>;

const staticProps = {
	title: "Course Assignment Detail",
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

const AssignmentDetailDocuments: FC<{
	assignment: Assignment0Schema | undefined;
}> = ({ assignment }) => {
	const {documents} = useAssignmentDocuments(assignment);
	return (
		<>
			{documents ? (
				<>
					{documents.length > 0 ? (
						<div className="w-full">
							<ul
								role="list"
								className="divide-y divide-gray-100 rounded-md border border-gray-200"
							>
								{documents.map((file, i) => (
									<li
										className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6"
										key={i}
									>
										<div className="flex w-0 flex-1 items-center">
											<PaperclipIcon
												className="h-5 w-5"
												aria-hidden="true"
											/>
											<div className="ml-4 flex min-w-0 flex-1 gap-2">
												<span className="truncate font-medium">
													{file.filename}
												</span>
												<span className="flex-shrink-0 text-gray-400">
													{formatBytes(file.filesize)}
												</span>
											</div>
											<a
												href={`/api/assignmentsMedia/static/${file.id}`}
												download
											>
												<DownloadIcon className="w-5 h-5" />
											</a>
										</div>
									</li>
								))}
							</ul>
						</div>
					) : (
						<div className="w-full h-16 flex justify-center items-center border-2 border-dashed">
							No document
						</div>
					)}
				</>
			) : (
				<Skeleton className="w-full h-32 rounded-lg" />
			)}
		</>
	);
};

interface Props {
	courseId: string;
	viewing: string;
	setViewing: Dispatch<SetStateAction<string | null>>;
	refetch: () => Promise<void>;
}

export const CourseAssignmentDetail: FC<Props> = (props) => {
	const [hasFetchedDefault, setHasFetchedDefault] = useState<boolean>(false);
	const form = useForm<FormSchema>({
		resolver: zodResolver(FormSchema),
		defaultValues: async () => {
			const endpoint = `/api/assignments/${props.viewing}${qs.stringify(
				{ depth: 0 },
				{ addQueryPrefix: true }
			)}`;
			const resp = await fetch(endpoint);
			const assignment = Assignment0Schema.parse(await resp.json());
			setHasFetchedDefault(true);
			return {
				title: assignment.title,
				dueAtDate: new Date(assignment.dueAt),
				dueAtTime: new Date(assignment.dueAt),
				content: assignment.content,
				documents: assignment
			};
		}
	});

	const formRef = useRef<HTMLFormElement>(null);

	return (
		<Sheet open={!!props.viewing}>
			<Form {...form}>
				<form ref={formRef}>
					<SheetContent
						position="right"
						size="xl"
						onClickOutside={() => props.setViewing(null)}
						onClickClose={() => props.setViewing(null)}
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
										{hasFetchedDefault ? (
											field.value ? (
												<FormControl>
													<Input
														disabled
														placeholder={
															staticProps
																.formFields
																.title
																.placeholder
														}
														{...field}
													/>
												</FormControl>
											) : (
												<div className="w-full h-16 flex justify-center items-center border-2 border-dashed">
													No Title
												</div>
											)
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
											{hasFetchedDefault ? (
												field.value ? (
													<PopoverTrigger asChild>
														<FormControl>
															<Button
																disabled
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
													<div className="w-full h-16 flex justify-center items-center border-2 border-dashed">
														No Due Date
													</div>
												)) : (
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
										{hasFetchedDefault ? (
											field.value ? (
												<div className="flex flex-row">
													<FormControl>
														<Input
															disabled
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
												<div className="w-full h-16 flex justify-center items-center border-2 border-dashed">
													No due date
												</div>
											)) : (<Skeleton className="w-full h-10 rounded-lg" />)}
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
										{hasFetchedDefault ? (
											field.value ? (
												<FormControl>
													<Input
														disabled
														placeholder={
															staticProps.formFields
																.richTextContent
																.placeholder
														}
														{...field}
													/>
												</FormControl>
											) : (
												<div className="w-full h-16 flex justify-center items-center border-2 border-dashed">
													No content
												</div>
											)) : (<Skeleton className="w-full h-10 rounded-lg" />)}
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
										{hasFetchedDefault ? (
											<AssignmentDetailDocuments assignment={field.value} />) : (<Skeleton className="w-full h-40 rounded-lg" />)}
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</SheetContent>
				</form>
			</Form>
		</Sheet>
	);
};
