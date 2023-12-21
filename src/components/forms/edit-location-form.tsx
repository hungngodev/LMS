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
import { Location0Schema } from "@/models/cms/location-0";
import { zodResolver } from "@hookform/resolvers/zod";
import qs from "qs";
import { Dispatch, FC, SetStateAction, useRef } from "react";
import { UseFormReset, useForm } from "react-hook-form";
import { z } from "zod";
import { Skeleton } from "../skeleton";

const FormSchema = z.object({
	name: z.string()
});

type FormSchema = z.infer<typeof FormSchema>;

async function onSubmit(
	values: FormSchema,
	refetchLocations: () => Promise<void>,
	reset: UseFormReset<z.infer<typeof FormSchema>>,
	editting: string,
	setEditting: Dispatch<SetStateAction<string | null>>,
	toast: ToastInvoker
) {
	const updatedLocation = { name: values.name };
	try {
		toast({ title: "Updating location" });
		await fetch(`/api/locations/${editting}`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(updatedLocation)
		});
		toast({
			title: "Success",
			description: `Updated location ${values.name}`
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
	setEditting(null);
}

interface EditLocationsFormProps {
	editting: string;
	setEditting: Dispatch<SetStateAction<string | null>>;
	refetchLocations: () => Promise<void>;
}

const fetchDefaultValue = async (locationId: string) => {
	const endpoint = `/api/locations/${locationId}${qs.stringify(
		{ depth: 0 },
		{ addQueryPrefix: true }
	)}`;
	const resp = await fetch(endpoint);
	const location = Location0Schema.parse(await resp.json());
	const defaultValue: FormSchema = { name: location.name };
	return defaultValue;
};

export const EditLocationsForm: FC<EditLocationsFormProps> = (props) => {
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
							props.refetchLocations,
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
							<SheetTitle>Edit Location</SheetTitle>
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
								Edit Location
							</Button>
						</div>
					</SheetContent>
				</form>
			</Form>
		</Sheet>
	);
};
