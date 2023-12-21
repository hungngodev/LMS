import { CoursesTable } from "@/components/courses/courses-table";
import { Header2 } from "@/components/typography/h2";
import { FC } from "react";

export const ModeratorCourse: FC = (props) => {
	return (
		<div className="px-6 py-4">
			<header>
				<Header2>Courses</Header2>
			</header>
			<div className="pt-8">
				<CoursesTable />
			</div>
		</div>
	);
};
