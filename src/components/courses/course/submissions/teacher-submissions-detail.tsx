import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { UploadGradeMedia } from "@/components/courses/course/grades/upload-grade-media";
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
import { Input } from "@/components/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/select";
import { Separator } from "@/components/separator";
import { Skeleton } from "@/components/skeleton";
import { Header4 } from "@/components/typography/h4";
import { Paragraph } from "@/components/typography/p";
import { ToastInvoker, useToast } from "@/hooks/use-toast";
import { Grade0Schema } from "@/models/cms/grade-0";
import { Submission1Schema } from "@/models/cms/submission-1";
import { formatBytes } from "@/utils/bytes-to-megabytes";
import { jsDateToDateMonthHourMinute } from "@/utils/js-date-to-date-month-hour-minute";
import { zodResolver } from "@hookform/resolvers/zod";
import { DownloadIcon, PaperclipIcon } from "lucide-react";
import {
	Dispatch,
	FC,
	SetStateAction,
	useEffect,
	useRef,
	useState
} from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
	grade: z
		.string()
		.refine(
			(s) =>
				typeof parseFloat(s) === "number" &&
				parseFloat(s) >= 0 &&
				parseFloat(s) <= 10
		),
	content: z.string().optional(),
	documents: z.array(z.string()).optional()
});

type FormSchema = z.infer<typeof FormSchema>;

async function onSubmit(
	values: FormSchema,
	currentSubmission: Submission1Schema,
	courseId: string,
	assignmentId: string,
	toast: ToastInvoker,
	setCurrentAuthorBeingGraded: Dispatch<SetStateAction<string | null>>,
	resetForm: () => void,
	refetchSubmission: () => Promise<void>
) {
	const newGrade: Partial<Grade0Schema> = {
		grade: parseFloat(values.grade),
		content: values.content,
		documents: values.documents,
		course: courseId,
		assignment: assignmentId,
		submission: currentSubmission.id
	};
	toast({ title: "Grading..." });
	try {
		const resp = await fetch("/api/grades", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(newGrade)
		});
		if (resp.ok) {
			toast({
				title: "Hooray",
				description: `Graded assignment of ${currentSubmission.createdBy.fullName}`
			});
			resetForm();
		} else
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
	await refetchSubmission();
	setCurrentAuthorBeingGraded(null);
}

export interface SubmissionDetailProps {
	courseId: string;
	assignmentId: string;
	submissions: Submission1Schema[];
	authorId: string;
	currentAuthorBeingGraded: string | null;
	setCurrentAuthorBeingGraded: Dispatch<SetStateAction<string | null>>;
	refetchSubmissions: () => Promise<void>;
}

export const TeacherSubmissionsDetail: FC<SubmissionDetailProps> = (props) => {
	const [gradingIndex, setGradingIndex] = useState<number>(
		props.submissions.findIndex((submission) => !!submission.grade) !== -1
			? props.submissions.findIndex((submission) => !!submission.grade)
			: 0
	);
	const [gradingIndexStr, setGradingIndexStr] = useState<string>("0");
	useEffect(() => {
		if (Number.isInteger(parseInt(gradingIndexStr))) {
			setGradingIndex(parseInt(gradingIndexStr));
		}
	}, [gradingIndexStr]);

	const [currentSubmission, setCurrentSubmission] =
		useState<Submission1Schema>(props.submissions[gradingIndex]);
	useEffect(() => {
		setCurrentSubmission(props.submissions[gradingIndex]);
	}, [gradingIndex, props.submissions]);

	const [currentGrade, setCurrentGrade] = useState<Grade0Schema | null>(null);
	useEffect(() => {
		for (let i = 0; i < props.submissions.length; i++) {
			const submission = props.submissions[i].grade;
			if (!!submission) {
				setCurrentGrade(submission);
				break;
			}
		}
	}, [props.submissions]);

	const { toast } = useToast();

	const form = useForm<FormSchema>({
		resolver: zodResolver(FormSchema)
	});

	const formRef = useRef<HTMLFormElement>(null);

	return (
		<Dialog open={props.currentAuthorBeingGraded === props.authorId}>
			<Button
				onClick={() =>
					props.setCurrentAuthorBeingGraded(props.authorId)
				}
			>
				Grade
			</Button>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit((onValid) =>
						onSubmit(
							onValid,
							currentSubmission,
							props.courseId,
							props.assignmentId,
							toast,
							props.setCurrentAuthorBeingGraded,
							form.reset,
							props.refetchSubmissions
						)
					)}
					ref={formRef}
				>
					<DialogContent
						onClickOutside={() =>
							props.setCurrentAuthorBeingGraded(null)
						}
						onClickClose={() =>
							props.setCurrentAuthorBeingGraded(null)
						}
					>
						{currentSubmission ? (
							<>
								<DialogHeader>
									<DialogTitle>
										Grading{" "}
										{currentSubmission.createdBy.fullName}
									</DialogTitle>
								</DialogHeader>
								<div className="flex flex-col space-y-4">
									<Header4>
										Attempts
										<Separator />
									</Header4>
									<Select
										value={gradingIndexStr}
										onValueChange={setGradingIndexStr}
									>
										<SelectTrigger className="w-full">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{props.submissions.map(
												(submission, i) => (
													<SelectItem
														key={submission.id}
														value={i.toString()}
													>
														{jsDateToDateMonthHourMinute(
															new Date(
																submission.createdAt
															)
														)}
													</SelectItem>
												)
											)}
										</SelectContent>
									</Select>
									{currentSubmission.content && (
										<div className="flex flex-col space-y-4">
											<Header4>
												Content
												<Separator />
											</Header4>
											<Paragraph>
												{currentSubmission.content}
											</Paragraph>
										</div>
									)}
									{currentSubmission.documents && (
										<div className="flex flex-col space-y-4">
											<Header4>
												Documents
												<Separator />
											</Header4>
											{currentSubmission.documents.map(
												(doc) => (
													<div
														className="flex w-full flex-1 items-center"
														key={doc.id}
													>
														<PaperclipIcon
															className="h-5 w-5 flex-shrink-0 text-gray-400"
															aria-hidden="true"
														/>
														<div className="ml-4 flex min-w-0 flex-1 gap-2">
															<span className="truncate font-medium">
																{doc.filename}
															</span>
															<span className="flex-shrink-0 text-gray-400">
																{formatBytes(
																	doc.filesize
																)}
															</span>
														</div>
														<a
															href={`/api/submissionsMedia/static/${doc.id}`}
															download
														>
															<DownloadIcon className="w-5 h-5" />
														</a>
													</div>
												)
											)}
										</div>
									)}
									<div>
										<div>
											<div className="flex flex-row items-center">
												<Header4>Grade</Header4>
												{currentGrade !== null ? (
													<Badge className="ml-2">
														Graded
													</Badge>
												) : (
													<Badge
														variant={"destructive"}
														className="ml-2"
													>
														Not Graded
													</Badge>
												)}
											</div>
											<Separator />
										</div>
										<div>
											<div className="space-y-8 mt-2">
												<FormField
													control={form.control}
													name="grade"
													defaultValue={
														currentGrade?.grade
															? currentGrade.grade.toString()
															: ""
													}
													render={({ field }) => (
														<FormItem>
															<FormLabel>
																Score
															</FormLabel>
															<FormControl>
																<Input
																	placeholder="Score"
																	type="number"
																	value={
																		field.value
																	}
																	onChange={(
																		e
																	) =>
																		field.onChange(
																			e
																				.target
																				.value
																		)
																	}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name="content"
													defaultValue={
														currentGrade
															? currentGrade.content
															: ""
													}
													render={({ field }) => (
														<FormItem>
															<FormLabel>
																Feedback Content
															</FormLabel>
															<FormControl>
																<Input
																	placeholder="Content"
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
													defaultValue={
														currentGrade?.documents ??
														[]
													}
													render={({ field }) => (
														<FormItem>
															<FormLabel>
																Feedback
																Documents
															</FormLabel>
															{field.value ? (
																<FormControl>
																	<UploadGradeMedia
																		courseId={
																			props.courseId
																		}
																		submissionId={
																			currentSubmission.id
																		}
																		assignmentId={
																			props.assignmentId
																		}
																		documentsId={
																			field.value
																		}
																		setValue={
																			form.setValue
																		}
																		mode={
																			currentGrade
																				? "edit"
																				: "create"
																		}
																	/>
																</FormControl>
															) : (
																<Skeleton className="w-full h-40 rounded-lg" />
															)}
															<FormMessage />
														</FormItem>
													)}
												/>
												<div className="w-full flex justify-between">
													<Button
														variant={"secondary"}
														onClick={() =>
															props.setCurrentAuthorBeingGraded(
																null
															)
														}
													>
														Cancel
													</Button>
													<Button
														onClick={() =>
															formRef.current?.requestSubmit()
														}
													>
														Grade This Attempt
													</Button>
												</div>
											</div>
										</div>
									</div>
								</div>
							</>
						) : (
							<Skeleton className="w-full h-32 rounded-lg" />
						)}
					</DialogContent>
				</form>
			</Form>
		</Dialog>
	);
};
