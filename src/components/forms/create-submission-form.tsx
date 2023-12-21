import { Button } from "@/components/button";
import { UploadSubmissionMedia } from "@/components/courses/course/submissions/upload-submission-media";
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
import { SheetClose } from "@/components/sheet";
import { ToastInvoker, useToast } from "@/hooks/use-toast";
import { Submission0Schema } from "@/models/cms/submission-0";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, FC, SetStateAction, useRef } from "react";
import { UseFormReset, useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
	content: z.string().optional(),
	documents: z.array(z.string()).optional()
});

type FormSchema = z.infer<typeof FormSchema>;

const staticProps = {
	title: "Create Submission",
	description: "",
	formFields: {
		richTextContent: {
			label: "Content",
			placeholder: "Enter Content"
		},
		documents: {
			label: "Documents",
			placeholder: ""
		}
	},
	formSubmitText: "Create Submission"
};

async function onSubmit(
	values: FormSchema,
	courseId: string,
	assignmentId: string,
	refetchAssignmentsAndSubmissions: () => Promise<void>,
	reset: UseFormReset<FormSchema>,
	setOpen: Dispatch<SetStateAction<boolean>>,
	setCloseAssignment: Dispatch<SetStateAction<boolean>> | undefined,
	toast: ToastInvoker
) {
	const newSubmission: Partial<Submission0Schema> = {
		content: values.content,
		documents: values.documents,
		course: courseId,
		assignment: assignmentId
	};
	toast({ title: "Submitting..." });
	try {
		const resp = await fetch("/api/submissions", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(newSubmission)
		});
		if (resp.ok)
			toast({ title: "Hooray", description: `Created submission` });
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
	await refetchAssignmentsAndSubmissions();
	reset();
	setOpen(false);
	if (!!setCloseAssignment) setCloseAssignment(false);
}
interface Props {
	courseId: string;
	assignmentId: string;
	refetchAssignmentsAndSubmissions: () => Promise<void>;
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	setCloseAssignment?: Dispatch<SetStateAction<boolean>>;
}

export const CreateSubmissionForm: FC<Props> = (props) => {
	const { toast } = useToast();
	const form = useForm<FormSchema>({
		resolver: zodResolver(FormSchema)
	});

	const formRef = useRef<HTMLFormElement>(null);

	return (
		<>
			<Dialog open={props.open}>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit((onValid) =>
							onSubmit(
								onValid,
								props.courseId,
								props.assignmentId,
								props.refetchAssignmentsAndSubmissions,
								form.reset,
								props.setOpen,
								props.setCloseAssignment,
								toast
							)
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
													staticProps.formFields
														.documents.label
												}
											</FormLabel>
											<FormControl>
												<UploadSubmissionMedia
													courseId={props.courseId}
													assignmentId={
														props.assignmentId
													}
													documentsId={
														field.value ?? []
													}
													setValue={form.setValue}
												/>
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
		</>
	);
};
