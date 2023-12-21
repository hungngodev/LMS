import { CollectionConfig } from "payload/types";

export const fields: CollectionConfig["fields"] = [
	{
		name: "title",
		type: "text",
		required: true
	},
	{
		name: "date",
		type: "date",
		required: true
	},
	{
		name: "startTime",
		type: "date",
		required: true
	},
	{
		name: "endTime",
		type: "date",
		required: true
	},
	{
		name: "isDaily",
		type: "checkbox",
		required: true
	},
	{
		name: "dailyFrequency",
		type: "number",
		min: 1
	},
	{
		name: "isWeekly",
		type: "checkbox",
		required: true
	},
	{
		name: "weeklyFrequency",
		type: "number",
		min: 1
	},
	{
		name: "weeklyDays",
		type: "array",
		fields: [
			{
				name: "day",
				type: "radio",
				options: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
				required: true
			}
		]
	},
	{
		name: "isMonthly",
		type: "checkbox",
		required: true
	},
	{
		name: "monthlyFrequency",
		type: "number",
		min: 1
	},
	{
		name: "monthlyOnDate",
		type: "number",
		min: 1,
		max: 31
	},
	{
		name: "isAnnually",
		type: "checkbox",
		required: true
	},
	{
		name: "annuallyFrequency",
		type: "number",
		min: 1
	},
	{
		name: "annuallyMonths",
		type: "array",
		fields: [
			{
				name: "month",
				type: "radio",
				options: [
					"Jan",
					"Feb",
					"Mar",
					"Apr",
					"May",
					"Jun",
					"Jul",
					"Aug",
					"Sep",
					"Oct",
					"Nov",
					"Dec"
				]
			}
		]
	},
	{
		name: "annuallyMonthsDate",
		type: "number",
		min: 1
	},
	{
		name: "endsAfterNumberOfOccurences",
		type: "checkbox"
	},
	{
		name: "numberOfOccurences",
		type: "number",
		min: 1
	},
	{
		name: "endsAfterDate",
		type: "date"
	},
	{
		name: "course",
		type: "relationship",
		relationTo: "courses",
		hasMany: false,
		required: true
	}
];
