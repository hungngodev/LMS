import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle
} from "@/components/sheet";
import { Skeleton } from "@/components/skeleton";
import { Subject0Schema } from "@/models/cms/subject-0";
import qs from "qs";
import { Dispatch, FC, SetStateAction } from "react";
import { useQuery } from "react-query";

export interface SubjectDetailProps {
	subjectId: string;
	setSubjectId: Dispatch<SetStateAction<string | null>>;
}

const useSubject = (subjectId: string) => {
	const endpoint = `/api/subjects/${subjectId}${qs.stringify(
		{ depth: 0 },
		{ addQueryPrefix: true }
	)}`;
	const { data: subject, refetch } = useQuery(endpoint, async () => {
		const resp = await fetch(endpoint);
		return Subject0Schema.parse(await resp.json());
	});
	return {
		subject,
		refetchSubject: async () => {
			await refetch();
		}
	};
};

export const SubjectDetail: FC<SubjectDetailProps> = (props) => {
	const { subject } = useSubject(props.subjectId);
	return (
		<Sheet open={!!props.subjectId}>
			<SheetContent
				onClickOutside={() => props.setSubjectId(null)}
				onClickClose={() => props.setSubjectId(null)}
				position="right"
				size="xl"
			>
				<SheetHeader className="max-w-xs">
					{subject?.name ? (
						<SheetTitle>{subject.name}</SheetTitle>
					) : (
						<Skeleton className="w-full h-12 rounded-lg" />
					)}
				</SheetHeader>
			</SheetContent>
		</Sheet>
	);
};
