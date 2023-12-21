import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { Skeleton } from "@/components/skeleton";
import { Header3 } from "@/components/typography/h3";
import { Subject0Schema } from "@/models/cms/subject-0";
import { ArrowRightToLine } from "lucide-react";
import qs from "qs";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { useQuery } from "react-query";
import { z } from "zod";

interface SubjectCardProps {
    subject: Subject0Schema;
    setViewing: Dispatch<SetStateAction<string | null>>;
}

const useSubjects = () => {
    const endpoint = `/api/subjects${qs.stringify(
        { limit: 10, depth: 0 },
        { addQueryPrefix: true }
    )}`;
    const { data: subjects, refetch } = useQuery(
        endpoint,
        async () => {
            const resp = await fetch(endpoint);
            const body = await resp.json();
            return z.array(Subject0Schema).parse(body.docs);
        },
        { useErrorBoundary: true });
    return {
        subjects, refetchSubjects: async () => {
            await refetch();
        }
    };
};

const SubjectCard: FC<SubjectCardProps> = (props) => {
    return (
        <Card
            className="rounded-lg flex max-h-80 w-full hover:bg-muted"
            onClick={() => props.setViewing(props.subject.id)}
        >
            <CardHeader className="flex flex-col w-full">
                <div className="flex w-full justify-between items-center">
                    <CardTitle>
                        <Header3>{props.subject.name}</Header3>
                    </CardTitle>
                    <ArrowRightToLine className="w-7 h-7" />
                </div>
                <CardContent className="flex flex-col justify-between h-full">
                </CardContent>
            </CardHeader>
        </Card>
    );
};


interface Props { }

export const SubjectsCard: FC<Props> = (props) => {
    const { subjects, refetchSubjects } = useSubjects();
    const [viewing, setViewing] = useState<string | null>(null);
    return (
        <>
            <div className="grid gap-4 pt-8">
                {subjects ? (
                    subjects.length > 0 ? (
                        subjects.map((subject) => (
                            <SubjectCard
                                key={subject.id}
                                subject={subject}
                                setViewing={setViewing}
                            />
                        ))
                    ) : (
                        <div className="w-full h-80 border-2 border-dashed flex justify-center items-center text-lg">
                            No subjects
                        </div>
                    )
                ) : (
                    <Skeleton className="w-full h-80" />
                )}
            </div>
        </>
    );
};
