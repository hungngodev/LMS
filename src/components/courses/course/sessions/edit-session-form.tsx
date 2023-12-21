import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger
} from "@/components/alert-dialog";
import { Button } from "@/components/button";
import { Calendar } from "@/components/calendar";
import { Command, CommandGroup, CommandItem } from "@/components/command";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel
} from "@/components/form";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import { RadioGroup, RadioGroupItem } from "@/components/radio-group";
import { Separator } from "@/components/separator";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle
} from "@/components/sheet";
import { Skeleton } from "@/components/skeleton";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from "@/components/tooltip";
import { Header5 } from "@/components/typography/h5";
import { Day, days } from "@/constants/days";
import { Frequency, frequencies } from "@/constants/frequencies";
import { Month, months } from "@/constants/months";
import {
	UpdateSessionChoice,
	updateSessionChoices
} from "@/constants/update-session-choice";
import { ToastInvoker, useToast } from "@/hooks/use-toast";
import { Course0Schema } from "@/models/cms/course-0";
import { Session0Schema } from "@/models/cms/session-0";
import { SessionRecurrence0Schema } from "@/models/cms/session-recurrence-0";
import { splitArray } from "@/payload/utils/split-array";
import { annuallyMonthsToSelectedMonths } from "@/utils/annually-months-to-selected-months";
import { cn } from "@/utils/cn";
import { dateToHourColonMinute } from "@/utils/date-to-hour-colon-minute";
import { hourColonMinuteToDate } from "@/utils/hour-colon-minute-to-date";
import { initMonthOnDate } from "@/utils/init-month-on-date";
import { initSelectedDays } from "@/utils/init-selected-days";
import { initSelectedMonths } from "@/utils/init-selected-months";
import { initYearOnDate } from "@/utils/init-year-on-date";
import { sameArray } from "@/utils/same-array";
import { weeklyDaysToSelectedDays } from "@/utils/weekly-days-to-selected-days";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown, XCircle } from "lucide-react";
import { Where } from "payload/types";
import qs from "qs";
import {
	Dispatch,
	FC,
	SetStateAction,
	useCallback,
	useEffect,
	useState
} from "react";
import { ControllerRenderProps, UseFormReturn, useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { z } from "zod";

const FormSchema = z.object({
	title: z.string(),
	date: z.date(),
	startTime: z.date(),
	endTime: z.date(),
	course: z.string(),
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
	title: "Edit Session",
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
	formSubmitText: "Save Changes"
};

interface CourseFieldProps {
	form: UseFormReturn<FormSchema>;
}

const SessionTitle: FC<CourseFieldProps> = ({ form }) => {
	return (
		<FormField
			control={form.control}
			name="title"
			render={({ field }) => (
				<FormItem className="flex flex-col">
					<FormLabel>Title</FormLabel>
					{field.value !== undefined ? (
						<FormControl>
							<Input
								placeholder="New Session"
								className="w-full"
								{...field}
							/>
						</FormControl>
					) : (
						<Skeleton className="w-full h-10 rounded-lg" />
					)}
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
			{field.value ? (
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
			) : (
				<Skeleton className="w-full h-10 rounded-lg" />
			)}

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
				{field.value ? (
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
				) : (
					<Skeleton className="w-full h-10 rounded-lg" />
				)}
			</div>
		);
	};

	return (
		<FormField
			control={form.control}
			name="startTime"
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
				{field.value ? (
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
				) : (
					<Skeleton className="w-full h-10 rounded-lg" />
				)}
			</div>
		);
	};

	return (
		<FormField
			control={form.control}
			name="endTime"
			render={({ field }) => (
				<FormItem className="flex flex-col">
					<FormLabel>End Time</FormLabel>
					<StartTime field={field} />
				</FormItem>
			)}
		/>
	);
};
const SessionRecurrenceSetting: FC<
	CourseFieldProps & {
		course: Course0Schema | undefined;
		defaultValue: FormSchema | undefined;
	}
> = ({ form, course, defaultValue }) => {
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

	useEffect(() => {
		setFrequency(
			defaultValue?.isAnnually
				? "annually"
				: defaultValue?.isMonthly
				? "monthly"
				: defaultValue?.isWeekly
				? "weekly"
				: "daily"
		);
		setSelectedDays(
			weeklyDaysToSelectedDays(
				defaultValue?.weeklyDays?.reduce<Day[]>(
					(weeklyDays, weeklyDay) => {
						if (weeklyDay?.day) weeklyDays.push(weeklyDay.day);
						return weeklyDays;
					},
					[]
				)
			) ?? initSelectedDays()
		);
		setEveryMonthOnDate(defaultValue?.monthlyOnDate ?? initMonthOnDate());
		setSelectedMonths(
			annuallyMonthsToSelectedMonths(
				defaultValue?.annuallyMonths?.reduce<Month[]>(
					(annuallyMonths, annuallyMonth) => {
						if (annuallyMonth?.month)
							annuallyMonths.push(annuallyMonth.month);
						return annuallyMonths;
					},
					[]
				)
			) ?? initSelectedMonths()
		);
		setEveryYearOnDate(
			defaultValue?.annuallyMonthsDate ?? initYearOnDate()
		);
	}, [defaultValue]);

	useEffect(() => {
		const everyMap = {
			annually: defaultValue?.annuallyFrequency,
			monthly: defaultValue?.monthlyFrequency,
			weekly: defaultValue?.weeklyFrequency,
			daily: defaultValue?.dailyFrequency
		};
		setEvery(everyMap[frequency] ?? 1);
	}, [defaultValue, frequency]);

	useEffect(() => {
		switch (frequency) {
			case "daily":
				form.setValue("isDaily", true);
				form.setValue("dailyFrequency", every);
				form.setValue("isWeekly", false);
				form.setValue("weeklyFrequency", defaultValue?.weeklyFrequency);
				form.setValue("weeklyDays", defaultValue?.weeklyDays);
				form.setValue("isMonthly", false);
				form.setValue(
					"monthlyFrequency",
					defaultValue?.monthlyFrequency
				);
				form.setValue("monthlyOnDate", defaultValue?.monthlyOnDate);
				form.setValue("isAnnually", false);
				form.setValue(
					"annuallyFrequency",
					defaultValue?.annuallyFrequency
				);
				form.setValue("annuallyMonths", defaultValue?.annuallyMonths);
				form.setValue(
					"annuallyMonthsDate",
					defaultValue?.annuallyMonthsDate
				);
				break;
			case "weekly":
				form.setValue("isDaily", false);
				form.setValue("dailyFrequency", defaultValue?.dailyFrequency);
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
				form.setValue("isMonthly", false);
				form.setValue(
					"monthlyFrequency",
					defaultValue?.monthlyFrequency
				);
				form.setValue("monthlyOnDate", defaultValue?.monthlyOnDate);
				form.setValue("isAnnually", false);
				form.setValue(
					"annuallyFrequency",
					defaultValue?.annuallyFrequency
				);
				form.setValue("annuallyMonths", defaultValue?.annuallyMonths);
				form.setValue(
					"annuallyMonthsDate",
					defaultValue?.annuallyMonthsDate
				);
				break;
			case "monthly":
				form.setValue("isDaily", false);
				form.setValue("dailyFrequency", defaultValue?.dailyFrequency);
				form.setValue("isWeekly", false);
				form.setValue("weeklyFrequency", defaultValue?.weeklyFrequency);
				form.setValue("weeklyDays", defaultValue?.weeklyDays);
				form.setValue("isMonthly", true);
				form.setValue("monthlyFrequency", every);
				form.setValue("monthlyOnDate", everyMonthOnDate);
				form.setValue("isAnnually", false);
				form.setValue(
					"annuallyFrequency",
					defaultValue?.annuallyFrequency
				);
				form.setValue("annuallyMonths", defaultValue?.annuallyMonths);
				form.setValue(
					"annuallyMonthsDate",
					defaultValue?.annuallyMonthsDate
				);
				break;
			case "annually":
				form.setValue("isDaily", false);
				form.setValue("dailyFrequency", defaultValue?.dailyFrequency);
				form.setValue("isWeekly", false);
				form.setValue("weeklyFrequency", defaultValue?.weeklyFrequency);
				form.setValue("weeklyDays", defaultValue?.weeklyDays);
				form.setValue("isMonthly", false);
				form.setValue(
					"monthlyFrequency",
					defaultValue?.monthlyFrequency
				);
				form.setValue("monthlyOnDate", defaultValue?.monthlyOnDate);
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
				break;
		}
	}, [
		every,
		everyMonthOnDate,
		everyYearOnDate,
		form,
		form.setValue,
		frequency,
		defaultValue,
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
							<FormLabel>Ends After Date</FormLabel>
							<DatePicker field={field} />
						</FormItem>
					)}
				/>
			) : (
				<Skeleton className="w-80 h-10 rounded-lg" />
			)}
		</div>
	);
};

const fetchSession = async (sessionId: string) => {
	const resp = await fetch(
		`/api/sessions/${sessionId}${qs.stringify(
			{ depth: 0 },
			{ addQueryPrefix: true }
		)}`
	);
	const session = Session0Schema.parse(await resp.json());
	return session;
};

const fetchSessionRecurrence = async (recurrenceId: string) => {
	const resp = await fetch(
		`/api/sessionsRecurrence/${recurrenceId}${qs.stringify(
			{ depth: 0 },
			{ addQueryPrefix: true }
		)}`
	);
	const sessionRecurrence = SessionRecurrence0Schema.parse(await resp.json());
	return sessionRecurrence;
};

const fetchSessionsOnwards = async (
	session: Session0Schema
): Promise<Session0Schema[]> => {
	const thisSessionOnwardsQuery: Where = {
		recurrenceId: { equals: session.recurrenceId },
		date: { greater_than_equal: session.date }
	};
	const resp = await fetch(
		`/api/sessions${qs.stringify(
			{
				where: thisSessionOnwardsQuery,
				limit: 1000,
				depth: 0
			},
			{ addQueryPrefix: true }
		)}`
	);
	const body = await resp.json();
	return z.array(Session0Schema).parse(body.docs);
};

const fetchEarliestSession = async (
	session: Session0Schema
): Promise<Session0Schema> => {
	const allSessionsQuery: Where = {
		recurrenceId: { equals: session.recurrenceId }
	};
	const resp = await fetch(
		`/api/sessions${qs.stringify(
			{
				where: allSessionsQuery,
				sort: "+date",
				limit: 1,
				depth: 0
			},
			{ addQueryPrefix: true }
		)}`
	);
	const body = await resp.json();
	const results = z.array(Session0Schema).parse(body.docs);
	return results[0];
};

async function updateSession(
	sessionId: string,
	updateChoice: UpdateSessionChoice,
	hasUpdateSessionSpecificProps: boolean,
	hasUpdatedTemporalProps: boolean,
	hasUpdatedFrequencyProps: boolean,
	values: FormSchema,
	toast: ToastInvoker,
	setEditting: Dispatch<SetStateAction<string | null>>,
	refetchSession: () => void | Promise<void>
) {
	try {
		toast({ title: "Updating session..." });
		const session = await fetchSession(sessionId);
		if (!session.recurrenceId) {
			await fetch(`/api/sessions/${sessionId}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					course: values.course,
					date: values.date,
					title: values.title,
					startTime: values.startTime,
					endTime: values.endTime
				})
			});
		} else {
			const recurrenceId = session.recurrenceId;
			switch (updateChoice) {
				case "this-session-only":
					await fetch(`/api/sessions/${sessionId}`, {
						method: "PATCH",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							course: values.course,
							date: values.date,
							title: values.title,
							startTime: values.startTime,
							endTime: values.endTime
						})
					});
					break;
				case "this-session-onwards":
					const sessionsOnwards = await fetchSessionsOnwards(session);
					const sessionsOnwardsId = sessionsOnwards.map(
						(session) => session.id
					);
					if (hasUpdatedFrequencyProps) {
						const updatedRecurrence: Omit<
							SessionRecurrence0Schema,
							"id" | "updatedAt" | "createdAt"
						> = {
							title: values.title,
							date: values.date.toISOString(),
							startTime: values.startTime.toISOString(),
							endTime: values.endTime.toISOString(),
							course: values.course,
							isDaily: values.isDaily ?? false,
							dailyFrequency: values.dailyFrequency,
							isWeekly: values.isWeekly ?? false,
							weeklyFrequency: values.weeklyFrequency,
							weeklyDays: values.weeklyDays,
							isMonthly: values.isMonthly ?? false,
							monthlyFrequency: values.monthlyFrequency,
							monthlyOnDate: values.monthlyOnDate,
							isAnnually: values.isAnnually ?? false,
							annuallyFrequency: values.annuallyFrequency,
							annuallyMonthsDate: values.annuallyMonthsDate,
							endsAfterDate: values.endsAfterDate?.toISOString()
						};
						await fetch(`/api/sessionsRecurrence/${recurrenceId}`, {
							method: "PATCH",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify(updatedRecurrence)
						});
						break;
					}
					if (hasUpdatedTemporalProps) {
						const batches = splitArray<string>(
							sessionsOnwardsId,
							20
						);
						for (let i = 0; i < batches.length; i++) {
							const sessionsOnwardsId = batches[i];
							const updateSessionsQuery: Where = {
								id: { in: sessionsOnwardsId.join(",") }
							};
							await fetch(
								`/api/sessions${qs.stringify(
									{ where: updateSessionsQuery, limit: 1000 },
									{ addQueryPrefix: true }
								)}`,
								{
									method: "PATCH",
									headers: {
										"Content-Type": "application/json"
									},
									body: JSON.stringify({
										title: values.title,
										startTime: values.startTime,
										endTime: values.endTime
									})
								}
							);
						}
						break;
					}
					const batches = splitArray<string>(sessionsOnwardsId, 20);
					for (let i = 0; i < batches.length; i++) {
						const sessionsOnwardsId = batches[i];
						const updateSessionsQuery: Where = {
							id: { in: sessionsOnwardsId.join(",") }
						};
						await fetch(
							`/api/sessions${qs.stringify(
								{ where: updateSessionsQuery, limit: 1000 },
								{ addQueryPrefix: true }
							)}`,
							{
								method: "PATCH",
								headers: { "Content-Type": "application/json" },
								body: JSON.stringify({
									title: values.title
								})
							}
						);
					}
					break;
				case "all-sessions":
					const earliestSession = await fetchEarliestSession(session);
					const updatedRecurrence: Omit<
						SessionRecurrence0Schema,
						"id" | "updatedAt" | "createdAt"
					> = {
						title: values.title,
						date: earliestSession.date,
						startTime: values.startTime.toISOString(),
						endTime: values.endTime.toISOString(),
						course: values.course,
						isDaily: values.isDaily ?? false,
						dailyFrequency: values.dailyFrequency,
						isWeekly: values.isWeekly ?? false,
						weeklyFrequency: values.weeklyFrequency,
						weeklyDays: values.weeklyDays,
						isMonthly: values.isMonthly ?? false,
						monthlyFrequency: values.monthlyFrequency,
						monthlyOnDate: values.monthlyOnDate,
						isAnnually: values.isAnnually ?? false,
						annuallyFrequency: values.annuallyFrequency,
						annuallyMonthsDate: values.annuallyMonthsDate,
						endsAfterDate: values.endsAfterDate?.toISOString()
					};
					await fetch(`/api/sessionsRecurrence/${recurrenceId}`, {
						method: "PATCH",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(updatedRecurrence)
					});
					break;
				default:
					console.error(`Invalid update choice: ${updateChoice}`);
					toast({
						title: "Uh oh, something went wrong",
						description:
							"There was a problem in our system, please try again",
						variant: "destructive"
					});
					break;
			}
		}
		await refetchSession();
		toast({
			title: "Success",
			description: `Updated session ${values.title}`
		});
		setEditting(null);
	} catch (error) {
		console.error(error);
		toast({
			title: "Uh oh, something went wrong",
			description:
				"There was a problem in our system, please try again later",
			variant: "destructive"
		});
	}
}

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

const fetchDefaultValues = async (
	editting: string,
	setDefaultValue: Dispatch<SetStateAction<FormSchema | undefined>>
) => {
	const session = await fetchSession(editting);
	const values: FormSchema = {
		title: session.title,
		date: new Date(session.date),
		startTime: new Date(session.startTime),
		endTime: new Date(session.endTime),
		course: session.course
	};
	if (session.recurrenceId) {
		values.isRecurrence = true;
		const recurrence = await fetchSessionRecurrence(session.recurrenceId);
		values.isDaily = recurrence.isDaily;
		values.dailyFrequency = recurrence.dailyFrequency;
		values.isWeekly = recurrence.isWeekly;
		values.weeklyFrequency = recurrence.weeklyFrequency;
		values.weeklyDays = recurrence.weeklyDays;
		values.isMonthly = recurrence.isMonthly;
		values.monthlyFrequency = recurrence.monthlyFrequency;
		values.monthlyOnDate = recurrence.monthlyOnDate;
		values.isAnnually = recurrence.isAnnually;
		values.annuallyFrequency = recurrence.annuallyFrequency;
		values.annuallyMonths = recurrence.annuallyMonths;
		values.annuallyMonthsDate = recurrence.annuallyMonthsDate;
		values.endsAfterDate = recurrence.endsAfterDate
			? new Date(recurrence.endsAfterDate)
			: undefined;
	}
	setDefaultValue(values);
	return values;
};

interface Props {
	courseId: string;
	refetch: () => void | Promise<void>;
	editting: string;
	setEditting: Dispatch<SetStateAction<string | null>>;
}

export const EditSessionForm: FC<Props> = (props) => {
	const { toast } = useToast();

	const { course } = useCourse(props.courseId);

	const [defaultValue, setDefaultValue] = useState<FormSchema | undefined>();

	const form = useForm<FormSchema>({
		resolver: zodResolver(FormSchema),
		defaultValues: async () =>
			await fetchDefaultValues(props.editting, setDefaultValue)
	});

	const [hasUpdatedTemporalProps, setHasUpdatedTemporalProps] =
		useState<boolean>(false);
	const [hasUpdatedFrequencyProps, setHasUpdatedFrequencyProps] =
		useState<boolean>(false);
	const [hasUpdatedSessionSpecificProps, setHasUpdatedSessionSpecificProps] =
		useState<boolean>(false);
	const [hasUpdated, setHasUpdated] = useState<boolean>(false);
	useEffect(() => {
		const subscription = form.watch((value) => {
			setHasUpdatedSessionSpecificProps(
				value.date?.toISOString() !== defaultValue?.date.toISOString()
			);
			setHasUpdatedTemporalProps(
				value.startTime?.toISOString() !==
					defaultValue?.startTime.toISOString() ||
					value.endTime?.toISOString() !==
						defaultValue?.endTime.toISOString()
			);
			setHasUpdatedFrequencyProps(
				value.isRecurrence !== defaultValue?.isRecurrence ||
					value.isDaily !== defaultValue?.isDaily ||
					value.dailyFrequency !== defaultValue?.dailyFrequency ||
					value.isWeekly !== defaultValue?.isWeekly ||
					value.weeklyFrequency !== defaultValue?.weeklyFrequency ||
					!sameArray(
						value.weeklyDays?.reduce<Day[]>(
							(weeklyDays, weeklyDay) => {
								if (weeklyDay?.day)
									weeklyDays.push(weeklyDay.day);
								return weeklyDays;
							},
							[]
						),
						defaultValue?.weeklyDays?.reduce<Day[]>(
							(weeklyDays, weeklyDay) => {
								if (weeklyDay?.day)
									weeklyDays.push(weeklyDay.day);
								return weeklyDays;
							},
							[]
						)
					) ||
					value.isMonthly !== defaultValue?.isMonthly ||
					value.monthlyOnDate !== defaultValue?.monthlyOnDate ||
					value.isAnnually !== defaultValue?.isAnnually ||
					value.annuallyFrequency !==
						defaultValue?.annuallyFrequency ||
					!sameArray(
						value.annuallyMonths?.reduce<Month[]>(
							(annuallyMonths, annuallyMonth) => {
								if (annuallyMonth?.month)
									annuallyMonths.push(annuallyMonth.month);
								return annuallyMonths;
							},
							[]
						),
						defaultValue?.annuallyMonths?.reduce<Month[]>(
							(annuallyMonths, annuallyMonth) => {
								if (annuallyMonth?.month)
									annuallyMonths.push(annuallyMonth.month);
								return annuallyMonths;
							},
							[]
						)
					) ||
					value.annuallyMonthsDate !==
						defaultValue?.annuallyMonthsDate ||
					value.endsAfterDate?.toISOString() !==
						defaultValue?.endsAfterDate?.toISOString()
			);
			setHasUpdated(
				value.title !== defaultValue?.title ||
					value.date?.toISOString() !==
						defaultValue?.date.toISOString() ||
					value.startTime?.toISOString() !==
						defaultValue?.startTime.toISOString() ||
					value.endTime?.toISOString() !==
						defaultValue?.endTime.toISOString() ||
					value.course !== defaultValue?.course ||
					value.isRecurrence !== defaultValue?.isRecurrence ||
					value.isDaily !== defaultValue?.isDaily ||
					value.dailyFrequency !== defaultValue?.dailyFrequency ||
					value.isWeekly !== defaultValue?.isWeekly ||
					value.weeklyFrequency !== defaultValue?.weeklyFrequency ||
					!sameArray(
						value.weeklyDays?.reduce<Day[]>(
							(weeklyDays, weeklyDay) => {
								if (weeklyDay?.day)
									weeklyDays.push(weeklyDay.day);
								return weeklyDays;
							},
							[]
						),
						defaultValue?.weeklyDays?.reduce<Day[]>(
							(weeklyDays, weeklyDay) => {
								if (weeklyDay?.day)
									weeklyDays.push(weeklyDay.day);
								return weeklyDays;
							},
							[]
						)
					) ||
					value.isMonthly !== defaultValue?.isMonthly ||
					value.monthlyOnDate !== defaultValue?.monthlyOnDate ||
					value.isAnnually !== defaultValue?.isAnnually ||
					value.annuallyFrequency !==
						defaultValue?.annuallyFrequency ||
					!sameArray(
						value.annuallyMonths?.reduce<Month[]>(
							(annuallyMonths, annuallyMonth) => {
								if (annuallyMonth?.month)
									annuallyMonths.push(annuallyMonth.month);
								return annuallyMonths;
							},
							[]
						),
						defaultValue?.annuallyMonths?.reduce<Month[]>(
							(annuallyMonths, annuallyMonth) => {
								if (annuallyMonth?.month)
									annuallyMonths.push(annuallyMonth.month);
								return annuallyMonths;
							},
							[]
						)
					) ||
					value.annuallyMonthsDate !==
						defaultValue?.annuallyMonthsDate ||
					value.endsAfterDate?.toISOString() !==
						defaultValue?.endsAfterDate?.toISOString()
			);
		});
		return () => subscription.unsubscribe();
	}, [defaultValue, form]);

	const [updateSessionChoicesStatus, setUpdateSessionChoicesStatus] =
		useState<boolean[]>(new Array(3).fill(true));

	useEffect(() => {
		if (hasUpdatedFrequencyProps || hasUpdatedSessionSpecificProps) {
			setUpdateSessionChoicesStatus((status) => {
				const _status = status.map((_) => _);
				_status[2] = false;
				return _status;
			});
		} else {
			setUpdateSessionChoicesStatus((status) => {
				const _status = status.map((_) => _);
				_status[2] = true;
				return _status;
			});
		}
		if (hasUpdatedFrequencyProps) {
			setUpdateSessionChoicesStatus((status) => {
				const _status = status.map((_) => _);
				_status[0] = false;
				return _status;
			});
		} else {
			setUpdateSessionChoicesStatus((status) => {
				const _status = status.map((_) => _);
				_status[0] = true;
				return _status;
			});
		}
		if (hasUpdatedSessionSpecificProps) {
			setUpdateSessionChoicesStatus((status) => {
				const _status = status.map((_) => _);
				_status[1] = false;
				return _status;
			});
		} else {
			setUpdateSessionChoicesStatus((status) => {
				const _status = status.map((_) => _);
				_status[1] = true;
				return _status;
			});
		}
	}, [
		hasUpdatedFrequencyProps,
		hasUpdatedSessionSpecificProps,
		hasUpdatedTemporalProps
	]);

	const [updateChoice, setUpdateChoice] =
		useState<UpdateSessionChoice>("this-session-only");

	useEffect(() => {
		const choiceIndex = updateSessionChoicesStatus.findIndex(
			(status) => status === true
		);
		if (choiceIndex !== -1)
			setUpdateChoice(updateSessionChoices[choiceIndex]);
	}, [updateSessionChoicesStatus]);

	const updateSessionCallback = useCallback(async () => {
		await updateSession(
			props.editting,
			updateChoice,
			hasUpdatedSessionSpecificProps,
			hasUpdatedTemporalProps,
			hasUpdatedFrequencyProps,
			form.getValues(),
			toast,
			props.setEditting,
			async () => {
				await props.refetch();
			}
		);
	}, [
		form,
		hasUpdatedFrequencyProps,
		hasUpdatedSessionSpecificProps,
		hasUpdatedTemporalProps,
		props,
		toast,
		updateChoice
	]);

	return (
		<Sheet open={!!props.editting}>
			<Form {...form}>
				<form>
					<SheetContent
						position="right"
						size="xl"
						onClickOutside={() => props.setEditting(null)}
						onClickClose={() => props.setEditting(null)}
					>
						<SheetHeader className="max-w-xs">
							<div className="w-full flex justify-between">
								<SheetTitle>{staticProps.title}</SheetTitle>
								<Button
									onClick={() => {
										form.reset();
										setDefaultValue((defaultValue) =>
											defaultValue
												? {
														...defaultValue
												  }
												: undefined
										);
									}}
								>
									Reset
								</Button>
							</div>
							<SheetDescription>
								{staticProps.description}
							</SheetDescription>
						</SheetHeader>
						<div className="space-y-8 max-w-xs">
							<SessionTitle form={form} />
							<>
								{hasUpdatedFrequencyProps && (
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<div>
													<Header5>
														Session specific
														properties
													</Header5>
													<div className="w-full h-20 border-2 border-dotted flex justify-center items-center border-muted-foreground mt-4">
														<XCircle className="w-10 h-10 text-muted-foreground" />
													</div>
												</div>
											</TooltipTrigger>
											<TooltipContent>
												<Label>
													{`Cannot update Session specific properties since you have already updated Frequency properties`}
												</Label>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								)}
								<div
									className={`space-y-4 ${
										hasUpdatedFrequencyProps ? "hidden" : ""
									}`}
								>
									<div>
										<Header5>
											Session specific properties
										</Header5>
										<Separator />
									</div>
									<SessionDate form={form} />
								</div>
							</>
							<div className="space-y-4">
								<div>
									<Header5>Temporal properties</Header5>
									<Separator />
								</div>
								<SessionStartTime form={form} />
								<SessionEndTime form={form} />
							</div>
							{form.getValues("isRecurrence") && (
								<>
									{hasUpdatedSessionSpecificProps && (
										<TooltipProvider>
											<Tooltip>
												<TooltipTrigger asChild>
													<div>
														<Header5>
															Frequency properties
														</Header5>
														<div className="w-full h-20 border-2 border-dotted flex justify-center items-center border-muted-foreground mt-4">
															<XCircle className="w-10 h-10 text-muted-foreground" />
														</div>
													</div>
												</TooltipTrigger>
												<TooltipContent>
													<Label>
														{`Cannot update Frequency properties since you have already updated Session specific properties`}
													</Label>
												</TooltipContent>
											</Tooltip>
										</TooltipProvider>
									)}
									<div
										className={`space-y-4 ${
											hasUpdatedSessionSpecificProps
												? "hidden"
												: ""
										}`}
									>
										<div>
											<Header5>
												Frequency properties
											</Header5>
											<Separator />
										</div>
										<SessionRecurrenceSetting
											form={form}
											course={course}
											defaultValue={defaultValue}
										/>
										<Separator />
									</div>
								</>
							)}
							{!hasUpdated ? (
								<Button onClick={() => props.setEditting(null)}>
									{staticProps.formSubmitText}
								</Button>
							) : (
								<AlertDialog>
									<AlertDialogTrigger asChild>
										<Button>
											{staticProps.formSubmitText}
										</Button>
									</AlertDialogTrigger>
									<AlertDialogContent>
										{!!form.getValues("isRecurrence") && (
											<RadioGroup
												defaultValue={updateChoice}
												onValueChange={(value) => {
													if (
														updateSessionChoices.includes(
															value as any
														)
													)
														setUpdateChoice(
															value as UpdateSessionChoice
														);
												}}
											>
												{updateSessionChoices.map(
													(choice, i) => (
														<div
															className="flex items-center space-x-2"
															key={choice}
														>
															{updateSessionChoicesStatus[
																i
															] ? (
																<>
																	<RadioGroupItem
																		value={
																			choice
																		}
																		id={
																			choice
																		}
																	/>
																	<Label
																		htmlFor={
																			choice
																		}
																		className={`capitalize`}
																	>
																		{choice.replace(
																			/\-/g,
																			" "
																		)}
																	</Label>
																</>
															) : (
																<TooltipProvider>
																	<Tooltip>
																		<TooltipTrigger
																			asChild
																		>
																			<div className="flex items-center space-x-2">
																				<RadioGroupItem
																					value={
																						choice
																					}
																					id={
																						choice
																					}
																					disabled={
																						true
																					}
																				/>
																				<Label
																					htmlFor={
																						choice
																					}
																					className={`capitalize line-through`}
																				>
																					{choice.replace(
																						/\-/g,
																						" "
																					)}
																				</Label>
																			</div>
																		</TooltipTrigger>
																		<TooltipContent>
																			<Label>
																				{i ===
																					0 &&
																					'Cannot update "this session only" if you have updated Frequency properties'}
																				{i ===
																					1 &&
																					'Cannot update "this session onwards" if you have updated Frequency properties or Session specific properties'}
																				{i ===
																					2 &&
																					'Cannot update "all session" if you have updated Temporal properties or Session specific properties'}
																			</Label>
																		</TooltipContent>
																	</Tooltip>
																</TooltipProvider>
															)}
														</div>
													)
												)}
											</RadioGroup>
										)}
										<AlertDialogHeader>
											<AlertDialogTitle>
												Are you absolutely sure?
											</AlertDialogTitle>
											<AlertDialogDescription>
												{updateChoice ===
													"this-session-only" &&
													`This action cannot be undone. This will permanently update the session.`}
												{updateChoice ===
													"this-session-onwards" &&
													`This action cannot be undone. This will permanently update this sessions and all sessions into the future.`}
												{updateChoice ===
													"all-sessions" &&
													`This action cannot be undone. This will permanently update this sessions, all sessions in the past and future.`}
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>
												Cancel
											</AlertDialogCancel>
											<AlertDialogAction
												onClick={updateSessionCallback}
											>
												Update
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							)}
						</div>
					</SheetContent>
				</form>
			</Form>
		</Sheet>
	);
};
