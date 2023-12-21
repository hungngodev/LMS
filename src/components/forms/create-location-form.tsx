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
	refetchLocations: () => Promise<void>,
	reset: UseFormReset<FormSchema>,
	setOpen: Dispatch<SetStateAction<boolean>>,
	toast: ToastInvoker
) {
	const newLocation = { name: values.name };
	try {
		toast({ title: "Adding location to organization" });
		await fetch(`/api/locations`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(newLocation)
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
	await refetchLocations();
	reset();
	setOpen(false);
}

interface CreateLocationFormProps {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	refetchLocations: () => Promise<void>;
}

export const CreateLocationsForm: FC<CreateLocationFormProps> = (props) => {
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
							props.refetchLocations,
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
							<SheetTitle>
								Add Location To Organization
							</SheetTitle>
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
								Add Location
							</Button>
						</div>
					</SheetContent>
				</form>
			</Form>
		</Sheet>
	);
};
