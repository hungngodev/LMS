import { Button } from "@/components/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel
} from "@/components/form";
import { Input } from "@/components/input";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle
} from "@/components/sheet";
import { Skeleton } from "@/components/skeleton";
import { ToastInvoker, useToast } from "@/hooks/use-toast";
import { Subject0Schema } from "@/models/cms/subject-0";
import { zodResolver } from "@hookform/resolvers/zod";
import qs from "qs";
import { Dispatch, FC, SetStateAction, useRef } from "react";
import { UseFormReset, useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
	name: z.string()
});

type FormSchema = z.infer<typeof FormSchema>;

async function onSubmit(
	values: FormSchema,
	refetchSubjects: () => Promise<void>,
	reset: UseFormReset<z.infer<typeof FormSchema>>,
	editting: string,
	setEditting: Dispatch<SetStateAction<string | null>>,
	toast: ToastInvoker
) {
	const updatedSubject = { name: values.name };
	try {
		toast({ title: "Updating subject" });
		await fetch(`/api/subjects/${editting}`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(updatedSubject)
		});
		toast({
			title: "Success",
			description: `Updated subject ${values.name}`
		});
	} catch (error) {
		console.error(error);
		toast({
			title: "Uh oh, something went wrong",
			description:
				"There was a problem with our system, please try again later",
			variant: "destructive"
		});
	}
	await refetchSubjects();
	reset();
	setEditting(null);
}

interface EditSubjectsFormProps {
	editting: string;
	setEditting: Dispatch<SetStateAction<string | null>>;
	refetchSubjects: () => Promise<void>;
}

const fetchDefaultValue = async (subjectId: string) => {
	const endpoint = `/api/subjects/${subjectId}${qs.stringify(
		{ depth: 0 },
		{ addQueryPrefix: true }
	)}`;
	const resp = await fetch(endpoint);
	const subject = Subject0Schema.parse(await resp.json());
	const defaultValue: FormSchema = { name: subject.name };
	return defaultValue;
};

export const EditSubjectForm: FC<EditSubjectsFormProps> = (props) => {
	const { toast } = useToast();

	const form = useForm<FormSchema>({
		resolver: zodResolver(FormSchema),
		defaultValues: async () => fetchDefaultValue(props.editting)
	});

	const formRef = useRef<HTMLFormElement>(null);

	return (
		<Sheet open={!!props.editting}>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit((onValid) =>
						onSubmit(
							onValid,
							props.refetchSubjects,
							form.reset,
							props.editting,
							props.setEditting,
							toast
						)
					)}
					ref={formRef}
				>
					<SheetContent
						position="right"
						size="xl"
						onClickClose={() => props.setEditting(null)}
						onClickOutside={() => props.setEditting(null)}
					>
						<SheetHeader>
							<SheetTitle>Edit Subject</SheetTitle>
						</SheetHeader>
						<div className="space-y-8 max-w-xs">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										{field.value ? (
											<FormControl>
												<Input
													placeholder="Full name"
													{...field}
												/>
											</FormControl>
										) : (
											<Skeleton className="w-full h-10 rounded-lg" />
										)}
									</FormItem>
								)}
							/>
							<Button
								onClick={() => formRef.current?.requestSubmit()}
							>
								Edit Subject
							</Button>
						</div>
					</SheetContent>
				</form>
			</Form>
		</Sheet>
	);
};
