import { z } from "zod";

export const SessionRecurrence0Schema = z.object({
	id: z.string(),
	course: z.string(),
	title: z.string(),
	date: z.string(),
	startTime: z.string(),
	endTime: z.string(),
	isDaily: z.boolean(),
	dailyFrequency: z.number().min(1).optional(),
	isWeekly: z.boolean(),
	weeklyFrequency: z.number().min(1).optional(),
	weeklyDays: z
		.array(
			z.object({
				day: z.union([
					z.literal("Mon"),
					z.literal("Tue"),
					z.literal("Wed"),
					z.literal("Thu"),
					z.literal("Fri"),
					z.literal("Sat"),
					z.literal("Sun")
				])
			})
		)
		.optional(),
	isMonthly: z.boolean(),
	monthlyFrequency: z.number().min(1).optional(),
	monthlyOnDate: z.number().min(1).optional(),
	isAnnually: z.boolean(),
	annuallyFrequency: z.number().min(1).optional(),
	annuallyMonths: z
		.array(
			z.object({
				month: z.union([
					z.literal("Jan"),
					z.literal("Feb"),
					z.literal("Mar"),
					z.literal("Apr"),
					z.literal("May"),
					z.literal("Jun"),
					z.literal("Jul"),
					z.literal("Aug"),
					z.literal("Sep"),
					z.literal("Oct"),
					z.literal("Nov"),
					z.literal("Dec")
				])
			})
		)
		.optional(),
	annuallyMonthsDate: z.number().optional(),
	endsAfterNumberOfOccurences: z.boolean().optional(),
	numberOfOccurences: z.number().optional(),
	endsAfterDate: z.string().optional(),
	createdAt: z.string(),
	updatedAt: z.string()
});

export type SessionRecurrence0Schema = z.infer<typeof SessionRecurrence0Schema>;
