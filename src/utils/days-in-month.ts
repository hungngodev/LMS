export const generateDatesInMonth = (month: number, year: number): string[] => {
	const dates: string[] = [];
	const date = new Date();
	date.setMonth(month);
	date.setFullYear(year);
	const currentMonth = date.getMonth();

	let i = 1;
	date.setDate(i);
	while (date.getMonth() === currentMonth) {
		const currentDate = new Date(date);
		dates.push(
			`${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${i}`
		);
		i++;
		date.setDate(i);
	}

	// generate padding day to fill calendar to Monday
	const firstDateOfMonth = new Date(dates[0]);
	while (firstDateOfMonth.getDay() !== 1) {
		firstDateOfMonth.setDate(firstDateOfMonth.getDate() - 1);
		dates.unshift(
			`${firstDateOfMonth.getFullYear()}-${
				firstDateOfMonth.getMonth() + 1
			}-${firstDateOfMonth.getDate()}`
		);
	}

	// generate padding day to fille calendar to Sunday
	const lastDateOfMonth = new Date(dates[dates.length - 1]);
	while (lastDateOfMonth.getDay() !== 0) {
		lastDateOfMonth.setDate(lastDateOfMonth.getDate() + 1);
		dates.push(
			`${lastDateOfMonth.getFullYear()}-${
				lastDateOfMonth.getMonth() + 1
			}-${lastDateOfMonth.getDate()}`
		);
	}

	return dates;
};
