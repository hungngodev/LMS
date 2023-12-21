import { Paragraph } from "@/components/typography/p";
import { classNames } from "@/utils/class-names";
import { generateDatesInMonth } from "@/utils/days-in-month";
import { sameDate } from "@/utils/same-date";
import { Menu, Transition } from "@headlessui/react";
import {
	ChevronDownIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	EllipsisHorizontalIcon
} from "@heroicons/react/20/solid";
import Link from "next/link";
import { FC, Fragment, useEffect, useState } from "react";

export interface CalendarEvent {
	id: string;
	name: string;
	startTime: string;
	endTime: string;
	date: string;
	href?: string;
	recurrenceId?: string;
}

export interface CalendarDay {
	date: string;
	isCurrentMonth?: boolean;
	isToday?: boolean;
	isSelected?: boolean;
	events: CalendarEvent[];
}

const months = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec"
];

const viewModes: { label: string; value: "day" | "week" | "month" | "year" }[] =
	[
		// { label: "Day view", value: "day" },
		// { label: "Week view", value: "week" },
		{ label: "Month view", value: "month" }
		// { label: "Year view", value: "year" }
	];

export interface CalendarEventPopoverProps {
	day: CalendarDay;
	event: CalendarEvent;
}

interface CalendarWithEventsProps {
	events: CalendarEvent[];
	onClickDayMonthView?: (day: CalendarDay) => void | Promise<void>;
	onClickEventMonthView?: (
		day: CalendarDay,
		event: CalendarEvent
	) => void | Promise<void>;
	EventPopover?: FC<CalendarEventPopoverProps>;
}

export const CalendarWithEvents: FC<CalendarWithEventsProps> = (props) => {
	const [days, setDays] = useState<CalendarDay[]>([]);

	const [viewMode, setViewMode] = useState<"day" | "week" | "month" | "year">(
		"month"
	);

	const [viewingDate, setViewingDate] = useState<Date>(new Date());

	useEffect(() => {
		const dates = generateDatesInMonth(
			viewingDate.getMonth(),
			viewingDate.getFullYear()
		);
		setDays(
			dates.map((date) => ({
				date,
				events: props.events.filter((event) =>
					sameDate(new Date(event.date), new Date(date))
				),
				isCurrentMonth:
					viewingDate.getMonth() === new Date(date).getMonth()
			}))
		);
	}, [viewingDate, props.events]);

	const prevHandler = () => {
		if (viewMode === "month") {
			setViewingDate(
				new Date(viewingDate.setMonth(viewingDate.getMonth() - 1))
			);
		}
	};

	const nextHandler = () => {
		if (viewMode === "month") {
			setViewingDate(
				new Date(viewingDate.setMonth(viewingDate.getMonth() + 1))
			);
		}
	};

	const currentHandler = () => {
		setViewingDate(new Date());
	};

	const onClickDay = async (day: CalendarDay) => {
		if (props.onClickDayMonthView) await props.onClickDayMonthView(day);
	};

	const onClickEvent = async (day: CalendarDay, event: CalendarEvent) => {
		if (props.onClickEventMonthView)
			await props.onClickEventMonthView(day, event);
	};

	return (
		<>
			<header className="flex items-center justify-between border-b border-gray-200 px-6 py-4 lg:flex-none">
				<h1 className="text-base font-semibold leading-6 text-gray-900">
					{viewMode === "month" && (
						<time
							dateTime={`${viewingDate.getFullYear()}-${
								viewingDate.getMonth() + 1
							}`}
						>
							{months[viewingDate.getMonth()]}
							{" - "}
							{viewingDate.getFullYear()}
						</time>
					)}
				</h1>
				<div className="flex items-center">
					<div className="relative flex items-center rounded-md bg-white shadow-sm md:items-stretch">
						<div
							className="pointer-events-none absolute inset-0 rounded-md ring-1 ring-inset ring-gray-300"
							aria-hidden="true"
						/>
						<button
							type="button"
							className="flex items-center justify-center rounded-l-md py-2 pl-3 pr-4 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:px-2 md:hover:bg-gray-50"
							onClick={() => prevHandler()}
						>
							<span className="sr-only">Previous {viewMode}</span>
							<ChevronLeftIcon
								className="h-5 w-5"
								aria-hidden="true"
							/>
						</button>
						<button
							type="button"
							className="hidden px-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:relative md:block"
							onClick={() => currentHandler()}
						>
							{viewMode === "day" && "Today"}
							{viewMode === "month" && "This Month"}
							{viewMode === "week" && "This Week"}
							{viewMode === "year" && "This Year"}
						</button>
						<span className="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
						<button
							type="button"
							className="flex items-center justify-center rounded-r-md py-2 pl-4 pr-3 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:px-2 md:hover:bg-gray-50"
							onClick={() => nextHandler()}
						>
							<span className="sr-only">Next {viewMode}</span>
							<ChevronRightIcon
								className="h-5 w-5"
								aria-hidden="true"
							/>
						</button>
					</div>
					<div className="hidden md:ml-4 md:flex md:items-center">
						<Menu as="div" className="relative">
							<Menu.Button
								type="button"
								className="flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
							>
								Month view
								<ChevronDownIcon
									className="-mr-1 h-5 w-5 text-gray-400"
									aria-hidden="true"
								/>
							</Menu.Button>

							<Transition
								as={Fragment}
								enter="transition ease-out duration-100"
								enterFrom="transform opacity-0 scale-95"
								enterTo="transform opacity-100 scale-100"
								leave="transition ease-in duration-75"
								leaveFrom="transform opacity-100 scale-100"
								leaveTo="transform opacity-0 scale-95"
							>
								<Menu.Items className="absolute right-0 z-10 mt-3 w-36 origin-top-right overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
									<div className="py-1">
										{viewModes.map((viewMode) => (
											<Menu.Item key={viewMode.value}>
												{({ active }) => (
													<button
														onClick={() =>
															setViewMode(
																viewMode.value
															)
														}
														className={classNames(
															active
																? "bg-gray-100 text-gray-900"
																: "text-gray-700",
															"block px-4 py-2 text-sm w-full text-left"
														)}
													>
														{viewMode.label}
													</button>
												)}
											</Menu.Item>
										))}
									</div>
								</Menu.Items>
							</Transition>
						</Menu>
					</div>
					<Menu as="div" className="relative ml-6 md:hidden">
						<Menu.Button className="-mx-2 flex items-center rounded-full border border-transparent p-2 text-gray-400 hover:text-gray-500">
							<span className="sr-only">Open menu</span>
							<EllipsisHorizontalIcon
								className="h-5 w-5"
								aria-hidden="true"
							/>
						</Menu.Button>

						<Transition
							as={Fragment}
							enter="transition ease-out duration-100"
							enterFrom="transform opacity-0 scale-95"
							enterTo="transform opacity-100 scale-100"
							leave="transition ease-in duration-75"
							leaveFrom="transform opacity-100 scale-100"
							leaveTo="transform opacity-0 scale-95"
						>
							<Menu.Items className="absolute right-0 z-10 mt-3 w-36 origin-top-right divide-y divide-gray-100 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
								<div className="py-1">
									<Menu.Item>
										{({ active }) => (
											<a
												href="#"
												className={classNames(
													active
														? "bg-gray-100 text-gray-900"
														: "text-gray-700",
													"block px-4 py-2 text-sm"
												)}
											>
												Create event
											</a>
										)}
									</Menu.Item>
								</div>
								<div className="py-1">
									<Menu.Item>
										{({ active }) => (
											<a
												href="#"
												className={classNames(
													active
														? "bg-gray-100 text-gray-900"
														: "text-gray-700",
													"block px-4 py-2 text-sm"
												)}
											>
												Go to today
											</a>
										)}
									</Menu.Item>
								</div>
								<div className="py-1">
									<Menu.Item>
										{({ active }) => (
											<a
												href="#"
												className={classNames(
													active
														? "bg-gray-100 text-gray-900"
														: "text-gray-700",
													"block px-4 py-2 text-sm"
												)}
											>
												Day view
											</a>
										)}
									</Menu.Item>
									<Menu.Item>
										{({ active }) => (
											<a
												href="#"
												className={classNames(
													active
														? "bg-gray-100 text-gray-900"
														: "text-gray-700",
													"block px-4 py-2 text-sm"
												)}
											>
												Week view
											</a>
										)}
									</Menu.Item>
									<Menu.Item>
										{({ active }) => (
											<a
												href="#"
												className={classNames(
													active
														? "bg-gray-100 text-gray-900"
														: "text-gray-700",
													"block px-4 py-2 text-sm"
												)}
											>
												Month view
											</a>
										)}
									</Menu.Item>
									<Menu.Item>
										{({ active }) => (
											<a
												href="#"
												className={classNames(
													active
														? "bg-gray-100 text-gray-900"
														: "text-gray-700",
													"block px-4 py-2 text-sm"
												)}
											>
												Year view
											</a>
										)}
									</Menu.Item>
								</div>
							</Menu.Items>
						</Transition>
					</Menu>
				</div>
			</header>
			<div className="shadow ring-1 ring-black ring-opacity-5 lg:flex lg:flex-auto lg:flex-col">
				<div className="grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs font-semibold leading-6 text-gray-700 lg:flex-none">
					<div className="bg-white py-2">
						M<span className="sr-only sm:not-sr-only">on</span>
					</div>
					<div className="bg-white py-2">
						T<span className="sr-only sm:not-sr-only">ue</span>
					</div>
					<div className="bg-white py-2">
						W<span className="sr-only sm:not-sr-only">ed</span>
					</div>
					<div className="bg-white py-2">
						T<span className="sr-only sm:not-sr-only">hu</span>
					</div>
					<div className="bg-white py-2">
						F<span className="sr-only sm:not-sr-only">ri</span>
					</div>
					<div className="bg-white py-2">
						S<span className="sr-only sm:not-sr-only">at</span>
					</div>
					<div className="bg-white py-2">
						S<span className="sr-only sm:not-sr-only">un</span>
					</div>
				</div>
				<div className="flex bg-gray-200 text-xs leading-6 text-gray-700 lg:flex-auto h-full">
					<div
						className={`isolate grid w-full grid-cols-7 grid-rows-${Math.ceil(
							days.length / 7
						)} gap-px`}
					>
						{days.map((day) => (
							<button
								key={day.date}
								type="button"
								className={classNames(
									day.isCurrentMonth
										? "bg-white"
										: "bg-gray-50",
									!!day.isSelected || !!day.isToday
										? "font-semibold"
										: "",
									!!day.isSelected ? "text-white" : "",
									!!day.isSelected || !!day.isToday
										? "text-indigo-600"
										: "",
									!day.isSelected &&
										!!day.isCurrentMonth &&
										!day.isToday
										? "text-gray-900"
										: "",
									!day.isSelected &&
										!day.isCurrentMonth &&
										!day.isToday
										? "text-gray-500"
										: "",
									"flex flex-col px-3 py-2 hover:bg-gray-100 hover:z-10 h-32"
								)}
								onClick={async () => await onClickDay(day)}
							>
								<time
									dateTime={day.date}
									className={classNames(
										sameDate(new Date(day.date), new Date())
											? "bg-primary text-white"
											: "",
										"ml-auto flex h-6 w-6 items-center justify-center rounded-full"
									)}
								>
									{(day.date.split("-").pop() as any).replace(
										/^0/,
										""
									)}
								</time>
								<span className="sr-only">
									{day.events.length} events
								</span>
								{day.events.length > 0 && (
									<div className="-mx-0.5 flex flex-col w-full space-y-1 mt-1">
										{day.events.map((event) => {
											if (event.href)
												return (
													<Link
														className="w-full text-left bg-gray-200 rounded-md px-2 hover:bg-gray-400"
														href={event.href}
														key={event.id}
													>
														<Paragraph className="truncate ...">
															{event.name}
														</Paragraph>
													</Link>
												);

											if (props.EventPopover)
												return (
													<div
														key={event.id}
														onClick={(e) =>
															e.stopPropagation()
														}
													>
														<props.EventPopover
															day={day}
															event={event}
														/>
													</div>
												);

											return (
												<div
													className="w-full text-left bg-gray-200 rounded-md px-2 hover:bg-gray-400"
													key={event.id}
													onClick={async (e) => {
														e.stopPropagation();
														await onClickEvent(
															day,
															event
														);
													}}
												>
													<Paragraph className="truncate ...">
														{event.name}
													</Paragraph>
												</div>
											);
										})}
									</div>
								)}
							</button>
						))}
					</div>
				</div>
			</div>
		</>
	);
};
