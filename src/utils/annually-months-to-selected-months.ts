import { Month, months } from "@/constants/months";

export const annuallyMonthsToSelectedMonths = (
	annuallyMonths: Month[] | undefined
) => {
	if (!annuallyMonths) return;
	const selectedMonths = new Array(12).fill(false);
	annuallyMonths.forEach((annuallyMonth) => {
		const monthIndex = months.findIndex((month) => month === annuallyMonth);
		if (monthIndex === -1) return;
		selectedMonths[monthIndex] = true;
	});
	return selectedMonths;
};
