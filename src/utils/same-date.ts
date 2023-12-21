export const sameDate = (d1: Date, d2: Date) =>
	d1.getDate() === d2.getDate() &&
	d1.getMonth() == d2.getMonth() &&
	d1.getFullYear() === d2.getFullYear();
