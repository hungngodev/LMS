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
import { Sheet, SheetContent, SheetHeader } from "@/components/sheet";
import { Skeleton } from "@/components/skeleton";
import { Spinner } from "@/components/spinner";
import { Header2 } from "@/components/typography/h2";
import { ToastInvoker, useToast } from "@/hooks/use-toast";
import { Course0Schema } from "@/models/cms/course-0";
import { Location0Schema } from "@/models/cms/location-0";
import { Subject0Schema } from "@/models/cms/subject-0";
import { Subject } from "@/types";
import { cn } from "@/utils/cn";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import qs from "qs";
import { Dispatch, FC, SetStateAction, useRef } from "react";
import {
	ControllerRenderProps,
	UseFormReset,
	UseFormReturn,
	useForm
} from "react-hook-form";
import { useQuery } from "react-query";
import { z } from "zod";

const FormSchema = z.object({
	title: z.string().min(2).max(100),
	startDate: z.date(),
	endDate: z.date(),
	location: z.string(),
	subject: z.string()
});

type FormSchema = z.infer<typeof FormSchema>;

const staticProps = {
	title: "Edit Course",
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
	formSubmitText: "Save Changes"
};

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
			defaultValue=""
			render={({ field }) => (
				<FormItem>
					<FormLabel>{staticProps.formFields.title.label}</FormLabel>
					<FormControl>
						{field.value ? (
							<Input
								placeholder={
									staticProps.formFields.title.placeholder
								}
								className="w-full"
								{...field}
							/>
						) : (
							<Skeleton className="w-full h-10 rounded-lg" />
						)}
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
					{field.value ? (
						<Button
							variant={"outline"}
							className={cn(
								"w-full pl-3 text-left font-normal",
								!field.value && "text-muted-foreground"
							)}
						>
							{field.value ? (
								format(field.value, "PPP")
							) : (
								<span>
									{
										staticProps.formFields.startDate
											.placeholder
									}
								</span>
							)}
							<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
						</Button>
					) : (
						<Skeleton className="w-full h-10 rounded-lg" />
					)}
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
					<FormLabel>Start Date</FormLabel>
					<StartDate field={field} />
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
					{field.value ? (
						<Button
							variant={"outline"}
							className={cn(
								"w-full pl-3 text-left font-normal",
								!field.value && "text-muted-foreground"
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
					) : (
						<Skeleton className="w-full h-10 rounded-lg" />
					)}
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
					{field.value ? (
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
										(location) =>
											location.value === field.value
								  )?.label
								: staticProps.formFields.location.placeholder}
							<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
						</Button>
					) : (
						<Skeleton className="w-full h-10 rounded-lg" />
					)}
				</FormControl>
			</PopoverTrigger>
			<PopoverContent className="w-full p-0">
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
					{field.value ? (
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
										(subject) =>
											subject.value === field.value
								  )?.label
								: staticProps.formFields.subject.placeholder}
							<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
						</Button>
					) : (
						<Skeleton className="w-full h-10 rounded-lg" />
					)}
				</FormControl>
			</PopoverTrigger>
			<PopoverContent className="w-full p-0">
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
			defaultValue=""
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

async function onSubmit(
	courseId: string,
	setCourseId: Dispatch<SetStateAction<string | null>>,
	values: FormSchema,
	toast: ToastInvoker,
	refetchCourse: () => Promise<void>,
	reset: UseFormReset<{
		title: string;
		startDate: Date;
		endDate: Date;
		location: string;
		subject: string;
	}>
) {
	try {
		const resp = await fetch(`/api/courses/${courseId}`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(values)
		});
		if (resp.ok)
			toast({
				title: "Success",
				description: `Updated course ${values.title}`
			});
		else
			toast({
				title: "Uh oh, something went wrong",
				description:
					"There was a problem in our system, please try again later",
				variant: "destructive"
			});
	} catch (error) {
		console.error(error);
		toast({
			title: "Uh oh, something went wrong",
			description:
				"There was a problem in our system, please try again later",
			variant: "destructive"
		});
	}
	await refetchCourse();
	reset();
	setCourseId(null);
}

const useEditCourseForm = (courseId: string) => {
	const getDefaultValue = async () => {
		const res = await fetch(
			`/api/courses/${courseId}${qs.stringify(
				{ depth: 0 },
				{ addQueryPrefix: true }
			)}`
		);
		const course = Course0Schema.parse(await res.json());
		return {
			...course,
			startDate: new Date(course.startDate),
			endDate: new Date(course.endDate)
		};
	};
	const form = useForm<FormSchema>({
		resolver: zodResolver(FormSchema),
		defaultValues: getDefaultValue
	});
	return { form };
};

interface Props {
	courseId: string;
	setCourseId: Dispatch<SetStateAction<string | null>>;
	refetchCourses: () => Promise<void>;
}

export const EditCourseForm: FC<Props> = (props) => {
	const { toast } = useToast();

	const { form } = useEditCourseForm(props.courseId);

	const { locations } = useLocationChoices();

	const { subjects } = useSubjectChoices();

	const formRef = useRef<HTMLFormElement>(null);

	return (
		<Sheet open={!!props.courseId}>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit((onValid) =>
						onSubmit(
							props.courseId,
							props.setCourseId,
							onValid,
							toast,
							props.refetchCourses,
							form.reset
						)
					)}
					ref={formRef}
				>
					<SheetContent
						position="right"
						size="xl"
						onClickOutside={() => props.setCourseId(null)}
						onClickClose={() => props.setCourseId(null)}
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
							<Button
								type="submit"
								onClick={() => formRef.current?.requestSubmit()}
							>
								{staticProps.formSubmitText}
							</Button>
						</div>
					</SheetContent>
				</form>
			</Form>
		</Sheet>
	);
};
