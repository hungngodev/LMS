import { padLeft } from "./pad-left";

export const dateToHourColonMinute = (date: Date) => {
	const hours = padLeft(date.getHours().toString(), "0", 2);
	const minutes = padLeft(date.getMinutes().toString(), "0", 2);
	return `${hours}:${minutes}`;
};
