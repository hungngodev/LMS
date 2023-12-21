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
import { ToastInvoker, useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
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
	setOpen: Dispatch<SetStateAction<boolean>>,
	toast: ToastInvoker
) {
	const newSubject = { name: values.name };
	try {
		toast({ title: "Adding subject to organization" });
		await fetch(`/api/subjects`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(newSubject)
		});
		toast({
			title: "Success",
			description: `Added ${values.name} to organization`
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
	setOpen(false);
}

interface CreateSubjectFormProps {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	refetchSubjects: () => Promise<void>;
}

export const CreateSubjectsForm: FC<CreateSubjectFormProps> = (props) => {
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
							props.refetchSubjects,
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
						onClickClose={() => props.setOpen(false)}
						onClickOutside={() => props.setOpen(false)}
					>
						<SheetHeader>
							<SheetTitle>Add Subject To Organization</SheetTitle>
						</SheetHeader>
						<div className="space-y-8 max-w-xs">
							<FormField
								control={form.control}
								name="name"
								defaultValue=""
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input
												placeholder="Full name"
												{...field}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<Button
								onClick={() => formRef.current?.requestSubmit()}
							>
								Add Subject
							</Button>
						</div>
					</SheetContent>
				</form>
			</Form>
		</Sheet>
	);
};
