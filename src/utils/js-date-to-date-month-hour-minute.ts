import { dateToHourColonMinute } from "./date-to-hour-colon-minute";

export const jsDateToDateMonthHourMinute = (date: Date) => {
	return `${date.getDate()}/${date.getMonth() + 1} - ${dateToHourColonMinute(
		date
	)}`;
};
