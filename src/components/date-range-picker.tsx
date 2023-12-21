"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/button";
import { Calendar } from "@/components/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import { cn } from "@/utils/cn";
import { Dispatch, FC, HTMLAttributes, SetStateAction } from "react";

export interface DateRangePickerProps {
	className?: HTMLAttributes<HTMLDivElement>;
	dateRange: DateRange | undefined;
	setDateRange: Dispatch<SetStateAction<DateRange | undefined>>;
	customPopoverWrapper?: boolean;
}

const _DateRangePicker: FC<DateRangePickerProps> = (props) => {
	return (
		<>
			<PopoverTrigger asChild>
				<Button
					id="date"
					variant={"outline"}
					className={cn(
						"w-[300px] justify-start text-left font-normal",
						!props.dateRange && "text-muted-foreground"
					)}
				>
					<CalendarIcon className="mr-2 h-4 w-4" />
					{props.dateRange?.from ? (
						props.dateRange.to ? (
							<>
								{format(props.dateRange.from, "LLL dd, y")} -{" "}
								{format(props.dateRange.to, "LLL dd, y")}
							</>
						) : (
							format(props.dateRange.from, "LLL dd, y")
						)
					) : (
						<span>Pick a date</span>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				<Calendar
					initialFocus
					mode="range"
					defaultMonth={props.dateRange?.from}
					selected={props.dateRange}
					onSelect={props.setDateRange}
					numberOfMonths={2}
				/>
			</PopoverContent>
		</>
	);
};

export const DateRangePicker: FC<DateRangePickerProps> = (props) => {
	return (
		<div className={cn("grid gap-2", props.className)}>
			{props.customPopoverWrapper ? (
				<_DateRangePicker {...props} />
			) : (
				<Popover>
					<_DateRangePicker {...props} />
				</Popover>
			)}
		</div>
	);
};
