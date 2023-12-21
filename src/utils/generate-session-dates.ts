import { days } from "@/constants/days";
import { months } from "@/constants/months";
import { SessionRecurrence0Schema } from "@/models/cms/session-recurrence-0";
import { monthHasDate } from "./month-has-date";

export const generateSessionDate = (
	recurrenceSession: SessionRecurrence0Schema
) => {
	const sessionDates: Date[] = [];
	if (recurrenceSession.endsAfterDate) {
		const endsAfterDate = new Date(recurrenceSession.endsAfterDate);
		if (
			recurrenceSession.isDaily &&
			recurrenceSession.dailyFrequency !== undefined
		) {
			let curDate = new Date(recurrenceSession.date);
			while (curDate < endsAfterDate) {
				sessionDates.push(new Date(curDate));
				curDate.setDate(
					curDate.getDate() + 1 * recurrenceSession.dailyFrequency
				);
			}
			return sessionDates;
		}
		if (
			recurrenceSession.isWeekly &&
			recurrenceSession.weeklyDays !== undefined &&
			recurrenceSession.weeklyFrequency !== undefined
		) {
			const weeklyFrequency = recurrenceSession.weeklyFrequency;

			const weeklyDays = new Set(
				recurrenceSession.weeklyDays?.map((day) => day.day) ?? []
			);

			const firstDateOnDays: Date[] = [];

			const curDate = new Date(recurrenceSession.date);
			let curDay = days[curDate.getDay()];

			while (weeklyDays.size > 0) {
				if (weeklyDays.has(curDay)) {
					firstDateOnDays.push(new Date(curDate));
					weeklyDays.delete(curDay);
				} else {
					curDate.setDate(curDate.getDate() + 1);
					curDay = days[curDate.getDay()];
				}
			}
			firstDateOnDays.forEach((date) => {
				const curDate = new Date(date);
				while (curDate < endsAfterDate) {
					sessionDates.push(new Date(curDate));
					curDate.setDate(curDate.getDate() + 7 * weeklyFrequency);
				}
			});
			return sessionDates;
		}
		if (
			recurrenceSession.isMonthly &&
			recurrenceSession.monthlyOnDate !== undefined &&
			recurrenceSession.monthlyFrequency !== undefined
		) {
			let curDate = new Date(recurrenceSession.date);
			while (recurrenceSession.monthlyOnDate !== curDate.getDate()) {
				curDate.setDate(curDate.getDate() + 1);
			}
			while (curDate < endsAfterDate) {
				if (monthHasDate(curDate, recurrenceSession.monthlyOnDate)) {
					curDate.setDate(recurrenceSession.monthlyOnDate);
					if (curDate < endsAfterDate)
						sessionDates.push(new Date(curDate));
				}
				curDate.setDate(1);
				curDate.setMonth(
					curDate.getMonth() + 1 * recurrenceSession.monthlyFrequency
				);
			}
			return sessionDates;
		}
		if (
			recurrenceSession.isAnnually &&
			recurrenceSession.annuallyMonths !== undefined &&
			recurrenceSession.annuallyMonthsDate !== undefined &&
			recurrenceSession.annuallyFrequency !== undefined
		) {
			const annuallyFrequency = recurrenceSession.annuallyFrequency;
			const annuallyMonths = new Set(
				recurrenceSession.annuallyMonths?.map((month) => month.month) ??
					[]
			);

			const firstDateOnMonths: Date[] = [];

			const curDate = new Date(recurrenceSession.date);
			let curMonth = months[curDate.getMonth()];

			while (annuallyMonths.size > 0) {
				if (annuallyMonths.has(curMonth)) {
					if (
						monthHasDate(
							curDate,
							recurrenceSession.annuallyMonthsDate
						)
					) {
						curDate.setDate(recurrenceSession.annuallyMonthsDate);
						firstDateOnMonths.push(new Date(curDate));
						annuallyMonths.delete(curMonth);
					}
				} else {
					curDate.setDate(1);
					curDate.setMonth(curDate.getMonth() + 1);
					curMonth = curMonth = months[curDate.getMonth()];
				}
			}
			firstDateOnMonths.forEach((date) => {
				const curDate = new Date(date);
				while (curDate < endsAfterDate) {
					sessionDates.push(new Date(curDate));
					curDate.setFullYear(
						curDate.getFullYear() + 1 * annuallyFrequency
					);
				}
			});

			return sessionDates;
		}
	}
	return sessionDates;
};
