import { Day, days } from "@/constants/days";

export const weeklyDaysToSelectedDays = (weeklyDays: Day[] | undefined) => {
	if (!weeklyDays) return;
	const selectedDays = new Array(7).fill(false);
	weeklyDays.forEach((weeklyDay) => {
		const dayIndex = days.findIndex((day) => day === weeklyDay);
		if (dayIndex === -1) return;
		selectedDays[dayIndex] = true;
	});
	return selectedDays;
};
