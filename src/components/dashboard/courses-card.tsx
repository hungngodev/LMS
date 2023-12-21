import { Button } from "@/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { Form } from "@/components/form";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle
} from "@/components/sheet";
import { Skeleton } from "@/components/skeleton";
import { Header4 } from "@/components/typography/h4";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { ActionEnum } from "@/payload/models/action-enum";
import { getUserAllowedActions } from "@/payload/utils/get-user-allowed-actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { GraduationCapIcon } from "lucide-react";
import Link from "next/link";
import qs from "qs";
import { FC, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { z } from "zod";

export const CoursesCard: FC = () => {
	const { user } = useAuth();
	const [showCoursesCount, setShowCoursesCount] = useState<boolean>(false);
	const [showCoursesCreate, setShowCoursesCreate] = useState<boolean>(false);
	useEffect(() => {
		if (!user) return;
		const actions = getUserAllowedActions(user);
		setShowCoursesCount(
			actions.has(ActionEnum["courses:read"]) ||
				actions.has(ActionEnum["courses:read:creator_only"]) ||
				actions.has(ActionEnum["courses:read:member_only"])
		);
		setShowCoursesCreate(actions.has(ActionEnum["courses:create"]));
	}, [user]);

	const CoursesCount: FC = () => {
		const endpoint = `/api/courses${qs.stringify(
			{ depth: 0, limit: 1000 },
			{ addQueryPrefix: true }
		)}`;
		const { data: count } = useQuery("count" + endpoint, async () => {
			const resp = await fetch(endpoint);
			const body = await resp.json();
			return z.number().parse(body.totalDocs);
		});
		if (count !== undefined) return <Header4>{count}</Header4>;
		else return <Skeleton className="h-12 w-32 rounded-lg" />;
	};
	const CoursesView: FC = () => {
		return (
			<Link href="/courses">
				<Button className="w-full">View</Button>
			</Link>
		);
	};
	const CoursesCreate: FC = () => {
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
								className="overflow-y-scroll"
							>
								<SheetHeader>
									<SheetTitle>Create Role</SheetTitle>
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
				<CardTitle className="text-md font-medium">Courses</CardTitle>
				<GraduationCapIcon className="h-6 w-6 text-muted-foreground" />
			</CardHeader>
			<CardContent className="flex flex-col space-y-4 w-full">
				{showCoursesCount && <CoursesCount />}
				{showCoursesCount && <CoursesView />}
				{showCoursesCreate && <CoursesCreate />}
			</CardContent>
		</Card>
	);
};
