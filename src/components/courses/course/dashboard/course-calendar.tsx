import {
	CalendarEvent,
	CalendarWithEvents
} from "@/components/calendar-with-event";
import { Header2 } from "@/components/typography/h2";
import { Assignment0Schema } from "@/models/cms/assignment-0";
import { Session0Schema } from "@/models/cms/session-0";
import { Where } from "payload/types";
import qs from "qs";
import { FC, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { z } from "zod";

const useSessions = (courseId: string) => {
	const sessionsQuery: Where = {
		course: { equals: courseId }
	};
	const { data: sessions } = useQuery(
		`/api/sessions${qs.stringify(
			{ where: sessionsQuery, depth: 0 },
			{ addQueryPrefix: true }
		)}`,
		async () => {
			const resp = await fetch(
				`/api/sessions${qs.stringify(
					{
						where: sessionsQuery,
						depth: 0
					},
					{ addQueryPrefix: true }
				)}`
			);
			const sessions = z
				.array(Session0Schema)
				.optional()
				.parse(resp.body);
			return sessions;
		}
	);
	return sessions ?? [];
};

const useAssignments = (courseId: string) => {
	const assignmentsQuery: Where = {
		course: { equals: courseId }
	};
	const { data: assignments } = useQuery(
		`/api/assignments${qs.stringify(
			{
				where: assignmentsQuery,
				depth: 0
			},
			{ addQueryPrefix: true }
		)}`,
		async () => {
			const resp = await fetch(
				`/api/assignments${qs.stringify(
					{
						where: assignmentsQuery,
						depth: 0
					},
					{ addQueryPrefix: true }
				)}`
			);
			const assignments = z
				.array(Assignment0Schema)
				.optional()
				.parse(resp.body);
			return assignments;
		}
	);
	return assignments ?? [];
};

interface CourseCalendarProps {
	courseId: string;
}

export const CourseCalendar: FC<CourseCalendarProps> = (props) => {
	const sessions = useSessions(props.courseId);

	const assignments = useAssignments(props.courseId);

	const [events, setEvents] = useState<CalendarEvent[]>([]);
	useEffect(() => {
		const events: CalendarEvent[] = [];
		sessions.forEach((session) =>
			events.push({
				id: session.id,
				name: session.title,
				startTime: session.startTime,
				endTime: session.endTime,
				date: session.startTime,
				href: "",
				recurrenceId: session.recurrenceId
			})
		);
		assignments.forEach((assignment) =>
			events.push({
				id: assignment.id,
				name: assignment.title,
				startTime: assignment.dueAt,
				endTime: assignment.dueAt,
				date: assignment.dueAt,
				href: `/assignments/${assignment.id}`
			})
		);
		setEvents(events);
	}, [sessions, assignments]);

	return (
		<div className="lg:flex lg:h-full lg:flex-col">
			<header className="px-6 py-4">
				<Header2>Course Calendar</Header2>
			</header>
			<CalendarWithEvents events={events} />
		</div>
	);
};
