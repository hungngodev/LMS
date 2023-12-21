import { Button } from "@/components/button";
import { Calendar } from "@/components/calendar";
import { Checkbox } from "@/components/checkbox";
import { Command, CommandGroup, CommandItem } from "@/components/command";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel
} from "@/components/form";
import { Input } from "@/components/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from "@/components/sheet";
import { Skeleton } from "@/components/skeleton";
import { Day, days } from "@/constants/days";
import { Frequency, frequencies } from "@/constants/frequencies";
import { Month, months } from "@/constants/months";
import { ToastInvoker, useToast } from "@/hooks/use-toast";
import { Course0Schema } from "@/models/cms/course-0";
import { Session0Schema } from "@/models/cms/session-0";
import { SessionRecurrence0Schema } from "@/models/cms/session-recurrence-0";
import { cn } from "@/utils/cn";
import { dateToHourColonMinute } from "@/utils/date-to-hour-colon-minute";
import { hourColonMinuteToDate } from "@/utils/hour-colon-minute-to-date";
import { initMonthOnDate } from "@/utils/init-month-on-date";
import { initSelectedDays } from "@/utils/init-selected-days";
import { initSelectedMonths } from "@/utils/init-selected-months";
import { initYearOnDate } from "@/utils/init-year-on-date";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import qs from "qs";
import {
	Dispatch,
	FC,
	SetStateAction,
	useEffect,
	useRef,
	useState
} from "react";
import {
	ControllerRenderProps,
	UseFormReset,
	UseFormReturn,
	useForm
} from "react-hook-form";
import { useQuery } from "react-query";
import { z } from "zod";

const FormSchema = z.object({
	course: z.string(),
	title: z.string(),
	date: z.date(),
	startTime: z.date(),
	endTime: z.date(),
	isRecurrence: z.boolean().optional(),
	isDaily: z.boolean().optional(),
	dailyFrequency: z.number().min(1).optional(),
	isWeekly: z.boolean().optional(),
	weeklyFrequency: z.number().min(1).optional(),
	weeklyDays: z
		.array(
			z.object({
				day: z.union([
					z.literal("Mon"),
					z.literal("Tue"),
					z.literal("Wed"),
					z.literal("Thu"),
					z.literal("Fri"),
					z.literal("Sat"),
					z.literal("Sun")
				])
			})
		)
		.optional(),
	isMonthly: z.boolean().optional(),
	monthlyFrequency: z.number().min(1).optional(),
	monthlyOnDate: z.number().min(1).optional(),
	isAnnually: z.boolean().optional(),
	annuallyFrequency: z.number().min(1).optional(),
	annuallyMonths: z
		.array(
			z.object({
				month: z.union([
					z.literal("Jan"),
					z.literal("Feb"),
					z.literal("Mar"),
					z.literal("Apr"),
					z.literal("May"),
					z.literal("Jun"),
					z.literal("Jul"),
					z.literal("Aug"),
					z.literal("Sep"),
					z.literal("Oct"),
					z.literal("Nov"),
					z.literal("Dec")
				])
			})
		)
		.optional(),
	annuallyMonthsDate: z.number().optional(),
	endsAfterDate: z.date().optional()
});

type FormSchema = z.infer<typeof FormSchema>;

const staticProps = {
	buttonText: "Create Session",
	title: "Create Session",
	description: "",
	formFields: {
		date: {
			label: "Date",
			placeholder: "Pick a date for this session"
		},
		startHour: {
			label: "Start Hour",
			placeholder: "Hour"
		},
		startMinute: {
			label: "Start Minute",
			placeholder: "Minute"
		},
		endHour: {
			label: "End Hour",
			placehodler: "Hour"
		},
		endMinute: {
			label: "End Minute",
			placeholder: "Minute"
		}
	},
	formSubmitText: "Create Session"
};

interface CourseFieldProps {
	form: UseFormReturn<FormSchema>;
}

const SessionTitle: FC<CourseFieldProps> = ({ form }) => {
	return (
		<FormField
			control={form.control}
			name="title"
			defaultValue=""
			render={({ field }) => (
				<FormItem className="flex flex-col">
					<FormLabel>Title</FormLabel>
					<FormControl>
						<Input
							placeholder="New Session"
							className="w-full"
							{...field}
						/>
					</FormControl>
				</FormItem>
			)}
		/>
	);
};

const SessionDate: FC<CourseFieldProps> = ({ form }) => {
	const DatePicker: FC<{
		field: ControllerRenderProps<FormSchema, "date">;
	}> = ({ field }) => (
		<Popover>
			<PopoverTrigger asChild>
				<FormControl>
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
								{staticProps.formFields.date.placeholder}
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
			name="date"
			defaultValue={new Date()}
			render={({ field }) => (
				<FormItem className="flex flex-col">
					<FormLabel>{staticProps.formFields.date.label}</FormLabel>
					<DatePicker field={field} />
				</FormItem>
			)}
		/>
	);
};

const SessionStartTime: FC<CourseFieldProps> = ({ form }) => {
	const StartTime: FC<{
		field: ControllerRenderProps<FormSchema, "startTime">;
	}> = ({ field }) => {
		return (
			<div className="flex flex-row">
				<FormControl>
					<Input
						type="time"
						value={dateToHourColonMinute(field.value)}
						onChange={(e) => {
							if (e.target.value === "") {
								form.setValue("startTime", field.value);
							} else {
								form.setValue(
									"startTime",
									hourColonMinuteToDate(e.target.value)
								);
							}
						}}
					/>
				</FormControl>
			</div>
		);
	};

	return (
		<FormField
			control={form.control}
			name="startTime"
			defaultValue={new Date()}
			render={({ field }) => (
				<FormItem className="flex flex-col">
					<FormLabel>Start Time</FormLabel>
					<StartTime field={field} />
				</FormItem>
			)}
		/>
	);
};

const SessionEndTime: FC<CourseFieldProps> = ({ form }) => {
	const StartTime: FC<{
		field: ControllerRenderProps<FormSchema, "endTime">;
	}> = ({ field }) => {
		return (
			<div className="flex flex-row">
				<FormControl>
					<Input
						type="time"
						value={dateToHourColonMinute(field.value)}
						onChange={(e) => {
							if (e.target.value === "") {
								form.setValue("endTime", field.value);
							} else {
								form.setValue(
									"endTime",
									hourColonMinuteToDate(e.target.value)
								);
							}
						}}
					/>
				</FormControl>
			</div>
		);
	};

	return (
		<FormField
			control={form.control}
			name="endTime"
			defaultValue={new Date()}
			render={({ field }) => (
				<FormItem className="flex flex-col">
					<FormLabel>End Time</FormLabel>
					<StartTime field={field} />
				</FormItem>
			)}
		/>
	);
};

const SessionIsRecurrence: FC<CourseFieldProps> = ({ form }) => {
	const IsRecurrence: FC<{
		field: ControllerRenderProps<FormSchema, "isRecurrence">;
	}> = ({ field }) => {
		return (
			<div className="flex flex-row space-x-2 items-center">
				<FormControl>
					<Checkbox
						checked={field.value}
						onCheckedChange={(checked) =>
							field.onChange(
								checked === "indeterminate" ? false : checked
							)
						}
					/>
				</FormControl>
				<FormLabel>Recurring Session</FormLabel>
			</div>
		);
	};

	return (
		<FormField
			control={form.control}
			name="isRecurrence"
			defaultValue={false}
			render={({ field }) => (
				<FormItem className="flex flex-col">
					<IsRecurrence field={field} />
				</FormItem>
			)}
		/>
	);
};

const SessionRecurrenceSetting: FC<
	CourseFieldProps & { course: Course0Schema | undefined }
> = ({ form, course }) => {
	const [frequency, setFrequency] = useState<Frequency>("daily");
	const [every, setEvery] = useState<number>(1);
	const [selectedDays, setSelectedDays] = useState<boolean[]>(
		initSelectedDays()
	);
	const [everyMonthOnDate, setEveryMonthOnDate] = useState<number>(
		initMonthOnDate()
	);
	const [selectedMonths, setSelectedMonths] = useState<boolean[]>(
		initSelectedMonths()
	);
	const [everyYearOnDate, setEveryYearOnDate] = useState<number>(
		initYearOnDate()
	);
	const [endAtCourseEndDate, setEndAtCourseEndDate] = useState<
		boolean | "indeterminate"
	>(true);

	useEffect(() => {
		switch (frequency) {
			case "daily":
				form.setValue("isDaily", true);
				form.setValue("dailyFrequency", every);
				form.setValue("isWeekly", undefined);
				form.setValue("weeklyFrequency", undefined);
				form.setValue("weeklyDays", undefined);
				form.setValue("isMonthly", undefined);
				form.setValue("monthlyFrequency", undefined);
				form.setValue("monthlyOnDate", undefined);
				form.setValue("isAnnually", undefined);
				form.setValue("annuallyFrequency", undefined);
				form.setValue("annuallyMonths", undefined);
				form.setValue("annuallyMonthsDate", undefined);
				break;
			case "weekly":
				form.setValue("isDaily", undefined);
				form.setValue("dailyFrequency", undefined);
				form.setValue("isWeekly", true);
				form.setValue("weeklyFrequency", every);
				form.setValue(
					"weeklyDays",
					selectedDays.reduce<{ day: Day }[]>(
						(selectedDays, selected, i) => {
							if (selected) selectedDays.push({ day: days[i] });
							return selectedDays;
						},
						[]
					)
				);
				form.setValue("isMonthly", undefined);
				form.setValue("monthlyFrequency", undefined);
				form.setValue("monthlyOnDate", undefined);
				form.setValue("isAnnually", undefined);
				form.setValue("annuallyFrequency", undefined);
				form.setValue("annuallyMonths", undefined);
				form.setValue("annuallyMonthsDate", undefined);
				break;
			case "monthly":
				form.setValue("isDaily", undefined);
				form.setValue("dailyFrequency", undefined);
				form.setValue("isWeekly", undefined);
				form.setValue("weeklyFrequency", undefined);
				form.setValue("weeklyDays", undefined);
				form.setValue("isMonthly", true);
				form.setValue("monthlyFrequency", every);
				form.setValue("monthlyOnDate", everyMonthOnDate);
				form.setValue("isAnnually", undefined);
				form.setValue("annuallyFrequency", undefined);
				form.setValue("annuallyMonths", undefined);
				form.setValue("annuallyMonthsDate", undefined);
				break;
			case "annually":
				form.setValue("isDaily", undefined);
				form.setValue("dailyFrequency", undefined);
				form.setValue("isWeekly", undefined);
				form.setValue("weeklyFrequency", undefined);
				form.setValue("weeklyDays", undefined);
				form.setValue("isMonthly", undefined);
				form.setValue("monthlyFrequency", undefined);
				form.setValue("monthlyOnDate", undefined);
				form.setValue("isAnnually", true);
				form.setValue("annuallyFrequency", every);
				form.setValue(
					"annuallyMonths",
					selectedMonths.reduce<{ month: Month }[]>(
						(selectedMonths, selected, i) => {
							if (selected)
								selectedMonths.push({ month: months[i] });
							return selectedMonths;
						},
						[]
					)
				);
				form.setValue("annuallyMonthsDate", everyYearOnDate);
				break;
			default:
				form.setValue("isDaily", undefined);
				form.setValue("dailyFrequency", undefined);
				form.setValue("isWeekly", undefined);
				form.setValue("weeklyFrequency", undefined);
				form.setValue("weeklyDays", undefined);
				form.setValue("isMonthly", undefined);
				form.setValue("monthlyFrequency", undefined);
				form.setValue("monthlyOnDate", undefined);
				form.setValue("isAnnually", undefined);
				form.setValue("annuallyFrequency", undefined);
				form.setValue("annuallyMonths", undefined);
				form.setValue("annuallyMonthsDate", undefined);
				break;
		}
	}, [
		every,
		everyMonthOnDate,
		everyYearOnDate,
		form,
		form.setValue,
		frequency,
		selectedDays,
		selectedMonths
	]);

	interface FrequencyProps {
		frequency: Frequency;
		setFrequency: Dispatch<SetStateAction<Frequency>>;
	}
	const Frequency: FC<FrequencyProps> = (props) => {
		const [open, setOpen] = useState(false);
		return (
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						aria-expanded={open}
						className="w-full justify-between"
					>
						{props.frequency
							? frequencies.find(
									(_frequency) =>
										_frequency === props.frequency
							  )
							: "Select Frequency"}
						<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-60 p-0">
					<Command>
						<CommandGroup>
							{frequencies.map((_frequency) => (
								<CommandItem
									key={_frequency}
									onSelect={(currentValue) => {
										props.setFrequency(
											currentValue as Frequency
										);
										setOpen(false);
									}}
								>
									<Check
										className={cn(
											"mr-2 h-4 w-4",
											props.frequency === _frequency
												? "opacity-100"
												: "opacity-0"
										)}
									/>
									{_frequency}
								</CommandItem>
							))}
						</CommandGroup>
					</Command>
				</PopoverContent>
			</Popover>
		);
	};

	interface EveryProps {
		every: number;
		setEvery: Dispatch<SetStateAction<number>>;
	}
	const Every: FC<EveryProps> = (props) => {
		return (
			<>
				Every{" "}
				<Input
					type="number"
					value={props.every}
					onChange={(e) => props.setEvery(parseInt(e.target.value))}
					className="w-20 mx-2"
					min={1}
				/>{" "}
				{
					{
						daily: `day${every === 1 ? "" : "s"}`,
						weekly: `week${every === 1 ? "" : "s"}`,
						monthly: `month${every === 1 ? "" : "s"}`,
						annually: `year${every === 1 ? "" : "s"}`
					}[frequency]
				}
			</>
		);
	};

	interface DaysSelectionProps {
		selectedDays: boolean[];
		setSelectedDays: Dispatch<SetStateAction<boolean[]>>;
	}
	const DaysSelection: FC<DaysSelectionProps> = (props) => {
		return (
			<div className="grid gap-4 grid-cols-7">
				{days.map((day, i) => (
					<button
						key={day}
						className={`rounded-full w-10 h-10 flex justify-center items-center text-sm font-light ${
							props.selectedDays[i]
								? "bg-primary text-muted"
								: "bg-muted text-primary"
						}`}
						onClick={() => {
							const dayIndex = days.findIndex(
								(_day) => _day === day
							);
							if (dayIndex === -1) return;
							const _selectedDays = props.selectedDays.map(
								(_) => _
							);
							if (
								_selectedDays.filter((_) => _).length > 1 ||
								!_selectedDays[dayIndex]
							) {
								_selectedDays[dayIndex] =
									!_selectedDays[dayIndex];
							}
							props.setSelectedDays(_selectedDays);
						}}
					>
						{day}
					</button>
				))}
			</div>
		);
	};

	interface EveryMonthOnDateProps {
		every: number;
		everyMonthOnDate: number;
		setEveryMonthOnDate: Dispatch<SetStateAction<number>>;
	}
	const EveryMonthOnDate: FC<EveryMonthOnDateProps> = (props) => {
		return (
			<>
				Every {props.every === 1 ? "" : props.every.toString()} month
				{props.every === 1 ? "" : "s"} on date{" "}
				<Input
					type="number"
					value={props.everyMonthOnDate}
					onChange={(e) =>
						props.setEveryMonthOnDate(parseInt(e.target.value))
					}
					max={31}
					min={1}
					className="w-20 mx-2"
				/>
			</>
		);
	};

	interface MonthsSelectionProps {
		selectedMonths: boolean[];
		setSelectedMonths: Dispatch<SetStateAction<boolean[]>>;
	}
	const MonthsSelection: FC<MonthsSelectionProps> = (props) => {
		return (
			<div className="grid gap-4 grid-cols-4 grid-rows-3">
				{months.map((month, i) => (
					<button
						key={month}
						className={`rounded-full w-10 h-10 flex justify-center items-center text-sm font-light ${
							props.selectedMonths[i]
								? "bg-primary text-muted"
								: "bg-muted text-primary"
						}`}
						onClick={() => {
							const monthIndex = months.findIndex(
								(_month) => _month === month
							);
							if (monthIndex === -1) return;
							const _selectedMonths = props.selectedMonths.map(
								(_) => _
							);
							if (
								_selectedMonths.filter((_) => _).length > 1 ||
								!_selectedMonths[monthIndex]
							) {
								_selectedMonths[monthIndex] =
									!_selectedMonths[monthIndex];
							}
							props.setSelectedMonths(_selectedMonths);
						}}
					>
						{month}
					</button>
				))}
			</div>
		);
	};

	interface EveryYearOnDateProps {
		every: number;
		everyYearOnDate: number;
		setEveryYearOnDate: Dispatch<SetStateAction<number>>;
		selectedMonths: boolean[];
	}
	const EveryYearOnDate: FC<EveryYearOnDateProps> = (props) => {
		return (
			<div>
				Every {props.every === 1 ? "" : props.every.toString()} year
				{props.every === 1 ? "" : "s"} on date{" "}
				<Input
					type="number"
					value={props.everyYearOnDate}
					onChange={(e) =>
						props.setEveryYearOnDate(parseInt(e.target.value))
					}
					max={31}
					min={1}
					className="w-20 mx-2 inline"
				/>{" "}
				of{" "}
				{months
					.reduce<Month[]>((prev, month, i) => {
						if (props.selectedMonths[i]) {
							prev.push(month);
						}
						return prev;
					}, [])
					.join(", ")}
			</div>
		);
	};

	const DatePicker: FC<{
		field: ControllerRenderProps<FormSchema, "endsAfterDate">;
	}> = ({ field }) => (
		<Popover>
			<PopoverTrigger asChild>
				<FormControl>
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
								{staticProps.formFields.date.placeholder}
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
					onSelect={field.onChange}
					initialFocus
				/>
			</PopoverContent>
		</Popover>
	);

	return (
		<div className="space-y-8 w-full">
			<FormItem className="flex flex-col">
				<FormLabel>Frequency</FormLabel>
				<Frequency frequency={frequency} setFrequency={setFrequency} />
			</FormItem>
			<FormItem className="flex items-center">
				<Every every={every} setEvery={setEvery} />
			</FormItem>
			{frequency === "weekly" && (
				<FormItem>
					<DaysSelection
						selectedDays={selectedDays}
						setSelectedDays={setSelectedDays}
					/>
				</FormItem>
			)}
			{frequency === "monthly" && (
				<FormItem className="flex items-center">
					<EveryMonthOnDate
						every={every}
						everyMonthOnDate={everyMonthOnDate}
						setEveryMonthOnDate={setEveryMonthOnDate}
					/>
				</FormItem>
			)}
			{frequency === "annually" && (
				<FormItem className="flex flex-col">
					<MonthsSelection
						selectedMonths={selectedMonths}
						setSelectedMonths={setSelectedMonths}
					/>
					<EveryYearOnDate
						every={every}
						everyYearOnDate={everyYearOnDate}
						setEveryYearOnDate={setEveryYearOnDate}
						selectedMonths={selectedMonths}
					/>
				</FormItem>
			)}
			{course ? (
				<FormField
					control={form.control}
					name="endsAfterDate"
					defaultValue={new Date(course.endDate)}
					render={({ field }) => (
						<FormItem>
							<div className="flex flex-row space-x-2 items-center">
								<FormControl>
									<Checkbox
										checked={endAtCourseEndDate}
										onCheckedChange={setEndAtCourseEndDate}
									/>
								</FormControl>
								<FormLabel>
									End at course&apos;s end date
								</FormLabel>
							</div>
							{!endAtCourseEndDate && (
								<DatePicker field={field} />
							)}
						</FormItem>
					)}
				/>
			) : (
				<Skeleton className="w-80 h-10 rounded-lg" />
			)}
		</div>
	);
};

async function onSubmit(
	values: FormSchema,
	courseId: string,
	refetch: () => void | Promise<void>,
	reset: UseFormReset<FormSchema>,
	toast: ToastInvoker,
	setOpen: Dispatch<SetStateAction<boolean>>
) {
	if (!values.isRecurrence) {
		const newSession: Omit<
			Session0Schema,
			"id" | "updatedAt" | "createdAt"
		> = {
			title: values.title,
			date: values.date.toISOString(),
			startTime: values.startTime.toISOString(),
			endTime: values.endTime.toISOString(),
			course: courseId
		};
		try {
			toast({ title: `Creating session ${newSession.title}` });
			await fetch("/api/sessions", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(newSession)
			});
			toast({
				title: "Success",
				description: `Created ${newSession.title}`
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
	} else {
		const newRecurrenceSession: Omit<
			SessionRecurrence0Schema,
			"id" | "updatedAt" | "createdAt"
		> = {
			...values,
			course: courseId,
			date: values.date.toISOString(),
			startTime: values.startTime.toISOString(),
			endTime: values.endTime.toISOString(),
			isDaily: values.isDaily ?? false,
			isWeekly: values.isWeekly ?? false,
			isMonthly: values.isMonthly ?? false,
			isAnnually: values.isAnnually ?? false,
			endsAfterDate: values.endsAfterDate?.toISOString()
		};
		try {
			toast({ title: `Creating session ${newRecurrenceSession.title}` });
			await fetch("/api/sessionsRecurrence", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(newRecurrenceSession)
			});
			toast({
				title: "Success",
				description: `Created ${newRecurrenceSession.title}`
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
	}
	await refetch();
	setOpen(false);
	reset();
}

interface Props {
	courseId: string;
	refetch: () => void | Promise<void>;
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
}

const useOpenRecurrenceSetting = (form: UseFormReturn<FormSchema>) => {
	const [openRecurrenceSetting, setOpenRecurrenceSetting] =
		useState<boolean>();
	useEffect(() => {
		const subscription = form.watch((value, { name, type }) =>
			setOpenRecurrenceSetting(value.isRecurrence)
		);
		return () => subscription.unsubscribe();
	}, [form]);
	return { openRecurrenceSetting, setOpenRecurrenceSetting };
};

const useCourse = (courseId: string) => {
	const endpoint = `/api/courses/${courseId}${qs.stringify(
		{ depth: 0 },
		{ addQueryPrefix: true }
	)}`;
	const { data: course } = useQuery(endpoint, async () => {
		const resp = await fetch(endpoint);
		return Course0Schema.parse(await resp.json());
	});
	return { course };
};

export const CreateSessionForm: FC<Props> = (props) => {
	const { toast } = useToast();

	const { course } = useCourse(props.courseId);

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: { course: props.courseId }
	});

	const formRef = useRef<HTMLFormElement>(null);

	const { openRecurrenceSetting } = useOpenRecurrenceSetting(form);

	return (
		<Sheet open={props.open}>
			<SheetTrigger asChild>
				<Button onClick={() => props.setOpen(true)}>
					{staticProps.buttonText}
				</Button>
			</SheetTrigger>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit((onValid) =>
						onSubmit(
							onValid,
							props.courseId,
							props.refetch,
							form.reset,
							toast,
							props.setOpen
						)
					)}
					ref={formRef}
				>
					<SheetContent
						position="right"
						size="xl"
						onClickOutside={() => props.setOpen(false)}
						onClickClose={() => props.setOpen(false)}
					>
						<SheetHeader>
							<SheetTitle>{staticProps.title}</SheetTitle>
							<SheetDescription>
								{staticProps.description}
							</SheetDescription>
						</SheetHeader>
						<div className="space-y-8 max-w-xs">
							<SessionTitle form={form} />
							<SessionDate form={form} />
							<SessionStartTime form={form} />
							<SessionEndTime form={form} />
							<SessionIsRecurrence form={form} />
							{openRecurrenceSetting && (
								<SessionRecurrenceSetting
									form={form}
									course={course}
								/>
							)}
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
