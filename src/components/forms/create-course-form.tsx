import { Button } from "@/components/button";
import { Calendar } from "@/components/calendar";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem
} from "@/components/command";
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
	SheetClose,
	SheetContent,
	SheetHeader
} from "@/components/sheet";
import { Spinner } from "@/components/spinner";
import { Header2 } from "@/components/typography/h2";
import { ToastInvoker, useToast } from "@/hooks/use-toast";
import { Location0Schema } from "@/models/cms/location-0";
import { Subject0Schema } from "@/models/cms/subject-0";
import { Subject } from "@/types";
import { cn } from "@/utils/cn";
import { CalendarIcon } from "@heroicons/react/20/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Check, ChevronsUpDown } from "lucide-react";
import qs from "qs";
import { Dispatch, FC, SetStateAction, useRef } from "react";
import { ControllerRenderProps, UseFormReturn, useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { z } from "zod";

const FormSchema = z
	.object({
		title: z.string().min(2).max(100),
		startDate: z.date(),
		endDate: z.date(),
		location: z.string(),
		subject: z.string()
	})
	.refine((data) => data.endDate > data.startDate, {
		message: "End date must be after the start date",
		path: ["endDate"] // You can specify which field triggers the error
	});
type FormSchema = z.infer<typeof FormSchema>;

const staticProps = {
	title: "Create Course",
	description: "",
	formFields: {
		title: {
			label: "Course Title",
			placeholder: ""
		},
		startDate: {
			label: "Start Date",
			placeholder: "Pick A Start Date"
		},
		endDate: {
			label: "End Date",
			placeholder: "Pick An End Date"
		},
		location: {
			label: "Location",
			placeholder: "Pick A Location",
			searchBarPlaceholder: "Search A Location",
			emptySearchText: "No Location Found"
		},
		subject: {
			label: "Subject",
			placeholder: "Pick A Subject",
			searchBarPlaceholder: "Search A Subject",
			emptySearchText: "No Subject Found"
		}
	},
	formSubmitText: "Create Course"
};

interface Props {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	refetchCourses: () => Promise<void>;
}

interface CourseFieldProps {
	form: UseFormReturn<FormSchema>;
}

interface Choice {
	label: string;
	value: string;
}

const CourseFieldTitle: FC<CourseFieldProps> = ({ form }) => {
	return (
		<FormField
			control={form.control}
			name="title"
			render={({ field }) => (
				<FormItem>
					<FormLabel>{staticProps.formFields.title.label}</FormLabel>
					<FormControl>
						<Input
							placeholder={
								staticProps.formFields.title.placeholder
							}
							className="w-full"
							{...field}
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};

const CourseFieldStartDate: FC<CourseFieldProps> = ({ form }) => {
	const StartDate: FC<{
		field: ControllerRenderProps<FormSchema, "startDate">;
	}> = ({ field }) => (
		<Popover>
			<PopoverTrigger asChild>
				<FormControl>
					<Button
						variant={"outline"}
						className={cn(
							"w-full pl-3 text-left font-normal",
							!field.value && "text-muted-foreground",
							form.formState.errors.startDate && "border-red-500"
						)}
					>
						{field.value ? (
							format(field.value, "PPP")
						) : (
							<span>
								{staticProps.formFields.startDate.placeholder}
							</span>
						)}
						<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
					</Button>
				</FormControl>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				<Calendar
					mode="single"
					selected={field.value}
					onSelect={(_, selectedDay) => field.onChange(selectedDay)}
					initialFocus
				/>
			</PopoverContent>
		</Popover>
	);
	return (
		<FormField
			control={form.control}
			name="startDate"
			render={({ field }) => (
				<FormItem className="flex flex-col">
					<FormLabel>
						{staticProps.formFields.startDate.label}
					</FormLabel>
					<StartDate field={field} />
					{form.formState.errors.startDate && ( // Display error message if there's an error
						<FormMessage>
							{form.formState.errors.startDate.message}
						</FormMessage>
					)}
				</FormItem>
			)}
		/>
	);
};

const CourseFieldEndDate: FC<CourseFieldProps> = ({ form }) => {
	const EndDate: FC<{
		field: ControllerRenderProps<FormSchema, "endDate">;
	}> = ({ field }) => (
		<Popover>
			<PopoverTrigger asChild>
				<FormControl>
					<Button
						variant={"outline"}
						className={cn(
							"w-full pl-3 text-left font-normal",
							!field.value && "text-muted-foreground",
							form.formState.errors.startDate && "border-red-500"
						)}
					>
						{field.value ? (
							format(field.value, "PPP")
						) : (
							<span>
								{staticProps.formFields.endDate.placeholder}
							</span>
						)}
						<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
					</Button>
				</FormControl>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				<Calendar
					mode="single"
					selected={field.value}
					onSelect={(_, selectedDay) => field.onChange(selectedDay)}
					initialFocus
				/>
			</PopoverContent>
		</Popover>
	);
	return (
		<FormField
			control={form.control}
			name="endDate"
			render={({ field }) => (
				<FormItem className="flex flex-col">
					<FormLabel>
						{staticProps.formFields.endDate.label}
					</FormLabel>
					<EndDate field={field} />
					{form.formState.errors.endDate && ( // Display error message if there's an error
						<FormMessage>
							{form.formState.errors.endDate.message}
						</FormMessage>
					)}
				</FormItem>
			)}
		/>
	);
};

const CourseFieldLocation: FC<CourseFieldProps & { locations?: Choice[] }> = ({
	form,
	locations
}) => {
	const Location: FC<{
		field: ControllerRenderProps<FormSchema, "location">;
	}> = ({ field }) => (
		<Popover>
			<PopoverTrigger asChild>
				<FormControl>
					<Button
						variant="outline"
						role="combobox"
						className={cn(
							"w-full justify-between",
							!field.value && "text-muted-foreground"
						)}
					>
						{field.value
							? locations?.find(
									(location) => location.value === field.value
							  )?.label
							: staticProps.formFields.location.placeholder}
						<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</FormControl>
			</PopoverTrigger>
			<PopoverContent className="w-80 p-0">
				<Command>
					<CommandInput
						placeholder={
							staticProps.formFields.location.searchBarPlaceholder
						}
						className="py-3"
					/>
					<CommandEmpty>
						{staticProps.formFields.location.emptySearchText}
					</CommandEmpty>
					<CommandGroup>
						{locations ? (
							locations.map((location) => (
								<CommandItem
									value={location.value}
									key={location.value}
									onSelect={(value) => {
										form.setValue("location", value);
									}}
								>
									<Check
										className={cn(
											"mr-2 h-4 w-4",
											location.value === field.value
												? "opacity-100"
												: "opacity-0"
										)}
									/>
									{location.label}
								</CommandItem>
							))
						) : (
							<Spinner />
						)}
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover>
	);
	return (
		<FormField
			control={form.control}
			name="location"
			render={({ field }) => (
				<FormItem className="flex flex-col">
					<FormLabel>
						{staticProps.formFields.location.label}
					</FormLabel>
					<Location field={field} />
				</FormItem>
			)}
		/>
	);
};

const CourseFieldSubject: FC<CourseFieldProps & { subjects?: Choice[] }> = ({
	form,
	subjects
}) => {
	const Subject: FC<{
		field: ControllerRenderProps<FormSchema, "subject">;
	}> = ({ field }) => (
		<Popover>
			<PopoverTrigger asChild>
				<FormControl>
					<Button
						variant="outline"
						role="combobox"
						className={cn(
							"w-full justify-between",
							!field.value && "text-muted-foreground"
						)}
					>
						{field.value
							? subjects?.find(
									(subject) => subject.value === field.value
							  )?.label
							: staticProps.formFields.subject.placeholder}
						<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</FormControl>
			</PopoverTrigger>
			<PopoverContent className="w-80 p-0">
				<Command>
					<CommandInput
						placeholder={
							staticProps.formFields.subject.searchBarPlaceholder
						}
						className="py-3"
					/>
					<CommandEmpty>
						{staticProps.formFields.subject.emptySearchText}
					</CommandEmpty>
					<CommandGroup>
						{subjects ? (
							subjects.map((subject) => (
								<CommandItem
									value={subject.value}
									key={subject.value}
									onSelect={(value) => {
										form.setValue("subject", value);
									}}
								>
									<Check
										className={cn(
											"mr-2 h-4 w-4",
											subject.value === field.value
												? "opacity-100"
												: "opacity-0"
										)}
									/>
									{subject.label}
								</CommandItem>
							))
						) : (
							<Spinner />
						)}
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover>
	);
	return (
		<FormField
			control={form.control}
			name="subject"
			render={({ field }) => (
				<FormItem className="flex flex-col">
					<FormLabel>
						{staticProps.formFields.subject.label}
					</FormLabel>
					<Subject field={field} />
				</FormItem>
			)}
		/>
	);
};

const useLocationChoices = () => {
	const endpoint = `/api/locations${qs.stringify(
		{ depth: 0 },
		{ addQueryPrefix: true }
	)}`;
	const { data: locations } = useQuery(endpoint, async () => {
		const resp = await fetch(endpoint);
		const body = await resp.json();
		const locations = z.array(Location0Schema).optional().parse(body.docs);
		return locations?.map((location) => ({
			label: location.name,
			value: location.id
		}));
	});
	return { locations };
};

const useSubjectChoices = () => {
	const endpoint = `/api/subjects${qs.stringify(
		{ depth: 0 },
		{ addQueryPrefix: true }
	)}`;
	const { data: subjects } = useQuery(endpoint, async () => {
		const resp = await fetch(endpoint);
		const body = await resp.json();
		const subjects = z.array(Subject0Schema).optional().parse(body.docs);
		return subjects?.map((subject: Subject) => ({
			label: subject.name,
			value: subject.id
		}));
	});
	return { subjects };
};

const onSubmit = async (
	values: FormSchema,
	form: UseFormReturn<FormSchema>,
	refetch: () => Promise<void>,
	setOpen: Dispatch<SetStateAction<boolean>>,
	toast: ToastInvoker
) => {
	try {
		await fetch("/api/courses", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(values)
		});
		toast({
			title: "Success",
			description: `Created course ${values.title}`
		});
		form.reset();
		await refetch();
		setOpen(false);
	} catch (error) {
		console.error(error);
		toast({
			title: "Uh oh, something went wrong",
			description:
				"There was a problem in our system, please try again later",
			variant: "destructive"
		});
	}
};

export const CreateCourseForm: FC<Props> = (props) => {
	const { toast } = useToast();
	const form = useForm<FormSchema>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			title: ""
		}
	});

	const formRef = useRef<HTMLFormElement>(null);

	const { locations } = useLocationChoices();

	const { subjects } = useSubjectChoices();

	return (
		<Sheet open={props.open}>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit((onValid) =>
						onSubmit(
							onValid,
							form,
							props.refetchCourses,
							props.setOpen,
							toast
						)
					)}
					ref={formRef}
				>
					<SheetContent
						position="right"
						size="xl"
						onClickOutside={() => props.setOpen(false)}
						onClickClose={() => props.setOpen(false)}
						className="overflow-y-scroll"
					>
						<SheetHeader>
							<Header2>{staticProps.title}</Header2>
						</SheetHeader>
						<div className="space-y-8 pt-8 max-w-xs">
							<CourseFieldTitle form={form} />
							<CourseFieldStartDate form={form} />
							<CourseFieldEndDate form={form} />
							<CourseFieldLocation
								form={form}
								locations={locations}
							/>
							<CourseFieldSubject
								form={form}
								subjects={subjects}
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
