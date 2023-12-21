import { Badge } from "@/components/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { Skeleton } from "@/components/skeleton";
import { Header3 } from "@/components/typography/h3";
import { useAllAssignments } from "@/hooks/assignments/use-all-assignments";
import { useCourse } from "@/hooks/courses/use-course";
import { Assignment0Schema } from "@/models/cms/assignment-0";
import { Course0Schema } from "@/models/cms/course-0";
import { Location0Schema } from "@/models/cms/location-0";
import { Subject0Schema } from "@/models/cms/subject-0";
import { ArrowRightToLine } from "lucide-react";
import qs from "qs";
import {
	Dispatch,
	FC,
	SetStateAction,
	useCallback,
	useMemo,
	useState
} from "react";
import { useQuery } from "react-query";
import { AssignmentCardDetail } from "./assignment-card-detail";

const useSubject = (course: Course0Schema | undefined) => {
	const endpoint = useMemo(() => {
		if (!course) return "";
		return `/api/subjects/${course.subject}${qs.stringify(
			{ depth: 0 },
			{ addQueryPrefix: true }
		)}`;
	}, [course]);
	const fetchSubject = useCallback(async () => {
		if (endpoint === "") return;
		const resp = await fetch(endpoint);
		return Subject0Schema.parse(await resp.json());
	}, [endpoint]);
	const { data: subject } = useQuery(endpoint, fetchSubject);
	return { subject };
};

const useLocation = (course: Course0Schema | undefined) => {
	const endpoint = useMemo(() => {
		if (!course) return "";
		return `/api/locations/${course.location}${qs.stringify(
			{ depth: 0 },
			{ addQueryPrefix: true }
		)}`;
	}, [course]);
	const fetchSubject = useCallback(async () => {
		if (endpoint === "") return;
		const resp = await fetch(endpoint);
		return Subject0Schema.parse(await resp.json());
	}, [endpoint]);
	const { data: location } = useQuery(endpoint, fetchSubject);
	return { location };
};

const AssignmentCardCourseTitleBadge: FC<{
	course: Course0Schema | undefined;
}> = ({ course }) => {
	return (
		<>
			{course ? (
				<Badge variant={"default"}>{course.title}</Badge>
			) : (
				<Skeleton className="h-10 w-16 rounded-lg" />
			)}
		</>
	);
};

const AssignmentCardSubjectBadge: FC<{
	subject: Subject0Schema | undefined;
}> = ({ subject }) => {
	return (
		<>
			{subject ? (
				<Badge variant="default">{subject.name}</Badge>
			) : (
				<Skeleton className="h-10 w-16 rounded-lg" />
			)}
		</>
	);
};

const AssignmentCardLocationBadge: FC<{
	location: Location0Schema | undefined;
}> = ({ location }) => {
	return (
		<>
			{location ? (
				<Badge variant="secondary">{location.name}</Badge>
			) : (
				<Skeleton className="h-10 w-16 rounded-lg" />
			)}
		</>
	);
};

const AssignmentCard: FC<{
	assignment: Assignment0Schema;
	setShowingAssignmentId: Dispatch<SetStateAction<string | null>>;
}> = ({ assignment, setShowingAssignmentId }) => {
	const { course } = useCourse(assignment.course);
	const { subject } = useSubject(course);
	const { location } = useLocation(course);
	return (
		<button onClick={() => setShowingAssignmentId(assignment.id)}>
			<Card className="rounded-lg flex max-h-80 w-full hover:bg-muted">
				<div className="flex flex-col w-full">
					<CardHeader>
						<div className="flex w-full justify-between items-center">
							<CardTitle>
								<Header3>{assignment.title}</Header3>
							</CardTitle>
							<ArrowRightToLine className="w-7 h-7" />
						</div>
					</CardHeader>
					<CardContent className="flex flex-col justify-between h-full">
						<div className="flex space-x-2">
							<AssignmentCardCourseTitleBadge course={course} />
							<AssignmentCardSubjectBadge subject={subject} />
							<AssignmentCardLocationBadge location={location} />
						</div>
					</CardContent>
				</div>
			</Card>
		</button>
	);
};

export const AssignmentsCard: FC = () => {
	const { assignments, refetchAssignments } = useAllAssignments();
	const [showingAssignmentId, setShowingAssignmentId] = useState<
		string | null
	>(null);
	return (
		<div className="grid gap-4 pt-8">
			{assignments ? (
				assignments.length > 0 ? (
					assignments.map((assignment) => (
						<AssignmentCard
							key={assignment.id}
							assignment={assignment}
							setShowingAssignmentId={setShowingAssignmentId}
						/>
					))
				) : (
					<div className="w-full h-80 border-2 border-dashed flex justify-center items-center text-lg">
						No assignments
					</div>
				)
			) : (
				<Skeleton className="w-full h-80" />
			)}
			{showingAssignmentId && (
				<AssignmentCardDetail
					assignmentId={showingAssignmentId}
					setAssignmentId={setShowingAssignmentId}
					refetchAssignments={refetchAssignments}
				/>
			)}
		</div>
	);
};
