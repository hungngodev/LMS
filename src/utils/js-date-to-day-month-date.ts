import { days } from "@/constants/days";
import { months } from "@/constants/months";

export const jsDateToDayMonthDate = (date: Date): string => {
	return `${days[date.getDay()]}, ${
		months[date.getMonth()]
	} ${date.getDate()}`;
};
