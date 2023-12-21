import { Submission0Schema } from "@/models/cms/submission-0";
import { User2Schema } from "@/models/cms/user-2";
import { Where } from "payload/types";
import qs from "qs";
import { useCallback, useMemo } from "react";
import { useQuery } from "react-query";
import { z } from "zod";
import { useCourseAssignments } from "./use-course-assignments";

/**
 * fetch submitted assignment of invoker of a given course
 */
export const useSubmittedCourseAssignments = (
	courseId: string,
	user: User2Schema | null
) => {
	const { assignments, refetchAssignments } = useCourseAssignments(courseId);
	const assignmentsId = useMemo(
		() => assignments?.map((assignment) => assignment.id),
		[assignments]
	);
	const query = useMemo<Where | undefined>(() => {
		if (!user) return;
		return {
			and: [
				{ course: { equals: courseId } },
				{ assignment: { in: assignmentsId } },
				{ createdBy: { equals: user.id } } as Where
			]
		};
	}, [assignmentsId, courseId, user]);
	const endpoint = useMemo(() => {
		if (!query) return;
		return `/api/submissions${qs.stringify(
			{ depth: 0, limit: 1000, where: query },
			{ addQueryPrefix: true }
		)}`;
	}, [query]);
	const fetchUpcomingAssignmentsCount = useCallback(async () => {
		if (!endpoint) return;
		const resp = await fetch(endpoint);
		const body = await resp.json();
		return z.array(Submission0Schema).parse(body.docs);
	}, [endpoint]);
	const { data: count, refetch } = useQuery(
		"count" + endpoint,
		fetchUpcomingAssignmentsCount,
		{ enabled: !!endpoint }
	);
	return {
		count,
		refetchCount: async () => {
			await refetchAssignments();
			await refetch();
		}
	};
};
