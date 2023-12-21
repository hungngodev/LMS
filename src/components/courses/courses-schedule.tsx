import { useAuth } from "@/hooks/use-auth";
import { Session1Schema } from "@/models/cms/session-1";
import { User2Schema } from "@/models/cms/user-2";
import { Course } from "@/types";
import { Where } from "payload/types";
import qs from "qs";
import { FC, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { z } from "zod";
import { CalendarEvent, CalendarWithEvents } from "../calendar-with-event";
import { Header2 } from "../typography/h2";

const useCoursesQuery = (user: User2Schema | null) => {
	const [coursesQuery, setCoursesQuery] = useState<Where | null>(null);
	useEffect(() => {
		if (!user) {
			setCoursesQuery(null);
			return;
		}
		setCoursesQuery({
			members: {
				contains: user.id
			}
		});
	}, [user]);
	return coursesQuery;
};

const useSessionQuery = (courses: Course[] | undefined) => {
	const [sessionQuery, setSessionQuery] = useState<Where | undefined>();
	useEffect(() => {
		if (!courses) {
			setSessionQuery(undefined);
			return;
		}
		setSessionQuery({
			course: {
				in: courses.map((course) => course.id)
			}
		});
	}, [courses]);
	return sessionQuery;
};

export const CoursesSchedule: FC = (props) => {
	const { user } = useAuth();

	const coursesQuery = useCoursesQuery(user);

	const { data: courses } = useQuery(
		`/api/courses${qs.stringify(
			{ where: coursesQuery, depth: 0 },
			{ addQueryPrefix: true }
		)}`,
		async () => {
			if (user === null || coursesQuery === undefined) return undefined;

			const resp = await fetch(
				`/api/courses${qs.stringify(
					{ where: coursesQuery, depth: 0 },
					{ addQueryPrefix: true }
				)}`
			);
			const body = await resp.json();
			return body.docs as Course[];
		},
		{ enabled: !!user }
	);

	const sessionQuery = useSessionQuery(courses);

	const { data: sessions } = useQuery(
		`/api/sessions${qs.stringify(
			{ where: sessionQuery, depth: 1 },
			{ addQueryPrefix: true }
		)}`,
		async () => {
			if (courses === undefined || sessionQuery === undefined)
				return undefined;

			const resp = await fetch(
				`/api/sessions${qs.stringify(
					{ where: sessionQuery, depth: 1 },
					{ addQueryPrefix: true }
				)}`
			);
			const body = await resp.json();
			const sessions = z.array(Session1Schema).parse(body.docs);
			return sessions;
		},
		{ enabled: !!courses }
	);

	const [events, setEvents] = useState<CalendarEvent[]>([]);
	useEffect(() => {
		const events: CalendarEvent[] =
			sessions?.map((session) => ({
				id: session.id,
				name: session.course.title,
				href: `/courses/${session.course.id}`,
				date: session.date,
				startTime: session.startTime,
				endTime: session.endTime,
				recurrenceId: session.recurrenceId?.id
			})) ?? [];
		setEvents(events);
	}, [sessions]);

	return (
		<div className="lg:flex lg:h-full lg:flex-col">
			<header className="px-6 py-4">
				<Header2>Course Schedule</Header2>
			</header>
			<CalendarWithEvents events={events} />
		</div>
	);
};
