export const hourColonMinuteToDate = (hourColonMinute: string) => {
	const date = new Date();
	if (hourColonMinute === "") return date;
	const hours = hourColonMinute.split(":")[0];
	const minutes = hourColonMinute.split(":")[1];
	date.setHours(parseInt(hours));
	date.setMinutes(parseInt(minutes));
	return date;
};
