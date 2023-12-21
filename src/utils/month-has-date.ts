export const monthHasDate = (month: Date, date: number) => {
	const _month = new Date(month);
	const __month = new Date(month);
	__month.setDate(date);
	return _month.getMonth() === __month.getMonth();
};
