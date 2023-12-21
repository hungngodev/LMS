import { Button } from "@/components/button";
import { AddMembersFormTable } from "@/components/courses/course/members/add-members-form-table";
import { Form, FormControl, FormField, FormItem } from "@/components/form";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from "@/components/sheet";
import { ToastInvoker, useToast } from "@/hooks/use-toast";
import { Course1Schema } from "@/models/cms/course-1";
import { RoleEnum } from "@/payload/models/role-enum";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, FC, SetStateAction, useRef } from "react";
import { UseFormReset, useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
	membersId: z.array(z.string())
});

type FormSchema = z.infer<typeof FormSchema>;

const staticProps = {
	buttonText: "Add Member",
	title: "Add Member",
	description: "",
	formFields: {
		membersId: {
			label: "Members",
			placeholder: "Add members"
		}
	},
	formSubmitText: "Add"
};

async function onSubmit(
	values: FormSchema,
	course: Course1Schema | undefined,
	refetch: () => Promise<void>,
	reset: UseFormReset<z.infer<typeof FormSchema>>,
	setOpen: Dispatch<SetStateAction<boolean>>,
	toast: ToastInvoker
) {
	if (!course) return;
	const currentMembers = course.members?.map((member) => member.id) ?? [];
	try {
		toast({ title: "Adding user to course" });
		await fetch(`/api/courses/${course.id}`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				members: [...values.membersId, ...currentMembers]
			})
		});
		toast({
			title: "Success",
			description: `Added ${values.membersId.length} users to course`
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
	await refetch();
	reset();
	setOpen(false);
}

interface AddMemberFormProps {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	course: Course1Schema | undefined;
	refetch: () => Promise<void>;
	trigger?: FC;
	roles?: RoleEnum[];
}

export const AddMemberForm: FC<AddMemberFormProps> = (props) => {
	const { toast } = useToast();

	const form = useForm<FormSchema>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			membersId: props.course?.members?.map((member) => member.id) ?? []
		}
	});

	const formRef = useRef<HTMLFormElement>(null);

	return (
		<Sheet open={props.open}>
			{props.trigger ? (
				<props.trigger />
			) : (
				<SheetTrigger asChild>
					<Button onClick={() => props.setOpen(true)}>
						{staticProps.buttonText}
					</Button>
				</SheetTrigger>
			)}
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit((onValid) =>
						onSubmit(
							onValid,
							props.course,
							props.refetch,
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
							<SheetTitle>{staticProps.title}</SheetTitle>
							<SheetDescription>
								{staticProps.description}
							</SheetDescription>
						</SheetHeader>
						<div className="space-y-8">
							<FormField
								control={form.control}
								name="membersId"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<AddMembersFormTable
												course={props.course}
												currentMembersId={field.value}
												setValue={form.setValue}
												roles={props.roles}
											/>
										</FormControl>
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
