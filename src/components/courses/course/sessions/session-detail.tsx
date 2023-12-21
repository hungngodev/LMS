import { Button } from "@/components/button";
import { Session } from "@/types";
import Link from "next/link";
import { FC } from "react";

export interface SessionDetailProps {
	courseId: string;
	session: Session;
	header: string;
}

export const SessionDetail: FC<SessionDetailProps> = (props) => {
	return (
		<div>
			<div className="px-4 sm:px-0 flex justify-between">
				<h3 className="text-base font-semibold leading-7 text-gray-900">
					{props.header}
				</h3>
				<Link
					href={`/courses/${props.courseId}/sessions/${props.session.id}/edit`}
				>
					<Button>Edit</Button>
				</Link>
			</div>
			<div className="mt-6 border-t border-gray-100">
				<dl className="divide-y divide-gray-100">
					{Object.entries(props.session)
						.filter(([key, value]) => key !== "course")
						.map(([key, value]) => (
							<div
								className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
								key={key}
							>
								<dt className="text-sm font-medium leading-6 text-gray-900">
									{key}
								</dt>
								<dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
									{value}
								</dd>
							</div>
						))}
				</dl>
			</div>
		</div>
	);
};
