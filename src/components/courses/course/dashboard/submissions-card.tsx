import { Button } from "@/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle
} from "@/components/sheet";
import { Skeleton } from "@/components/skeleton";
import { Header4 } from "@/components/typography/h4";
import { useAllCourseSubmissionsCount } from "@/hooks/submissions/use-all-course-submissions-count";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { User2Schema } from "@/models/cms/user-2";
import { ViewEnum } from "@/payload/models/view-enum";
import { getUserAllowedViews } from "@/payload/utils/get-user-allowed-views";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClipboardListIcon } from "lucide-react";
import Link from "next/link";
import { FC, useEffect, useRef, useState } from "react";
import { Form, useForm } from "react-hook-form";
import { z } from "zod";

const useViews = (user: User2Schema | null) => {
	const [showCount, setShowCount] = useState<boolean>(false);
	const [showCreate, setShowCreate] = useState<boolean>(false);
	useEffect(() => {
		if (!user) return;
		const views = getUserAllowedViews(user);
		setShowCount(
			views.has(ViewEnum["courses:dashboard:submissions:count"])
		);
		setShowCreate(
			views.has(ViewEnum["courses:dashboard:submissions:create"])
		);
	}, [user]);
	return { showCount, showCreate };
};

interface Props {
	courseId: string;
}

export const SubmissionsCard: FC<Props> = (props) => {
	const { user } = useAuth();
	const { showCount, showCreate } = useViews(user);
	const SubmissionsCount: FC = () => {
		const { count } = useAllCourseSubmissionsCount(props.courseId);
		if (count !== undefined) return <Header4>{count}</Header4>;
		else return <Skeleton className="h-12 w-32 rounded-lg" />;
	};
	const SubmissionsView: FC = () => {
		return (
			<Link href={`/courses/${props.courseId}/submissions`}>
				<Button className="w-full">View</Button>
			</Link>
		);
	};
	const SubmissionsCreate: FC = () => {
		const FormSchema = z.object({});
		type FormSchema = z.infer<typeof FormSchema>;
		const { toast } = useToast();
		const form = useForm<FormSchema>({
			resolver: zodResolver(FormSchema)
		});
		const formRef = useRef<HTMLFormElement>(null);
		const [open, setOpen] = useState<boolean>(false);
		const onSubmit = async (values: FormSchema) => {};
		const CreateSheetForm: FC = () => {
			return (
				<Sheet open={open}>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(
								async (onValid) => await onSubmit(onValid)
							)}
							ref={formRef}
						>
							<SheetContent
								position="right"
								size="xl"
								onClickOutside={() => setOpen(false)}
								onClickClose={() => setOpen(false)}
							>
								<SheetHeader>
									<SheetTitle>Create Submissions</SheetTitle>
								</SheetHeader>
								<div className="space-y-8 max-w-xs">
									<div className="flex space-x-4">
										<Button
											variant={"outline"}
											onClick={() => setOpen(false)}
										>
											Cancel
										</Button>
										<Button
											onClick={() =>
												formRef.current?.requestSubmit()
											}
										>
											Create
										</Button>
									</div>
								</div>
							</SheetContent>
						</form>
					</Form>
				</Sheet>
			);
		};
		return (
			<>
				<Button className="w-full" onClick={() => setOpen(true)}>
					Create
				</Button>
				{open && <CreateSheetForm />}
			</>
		);
	};

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-md font-medium">
					Submissions
				</CardTitle>
				<ClipboardListIcon className="h-6 w-6 text-muted-foreground" />
			</CardHeader>
			<CardContent className="flex flex-col space-y-4 w-full">
				{showCount && <SubmissionsCount />}
				{showCount && <SubmissionsView />}
				{showCreate && <SubmissionsCreate />}
			</CardContent>
		</Card>
	);
};
