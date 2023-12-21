"use client";

import { MembersTable } from "@/components/courses/course/members/members-table";
import { Header2 } from "@/components/typography/h2";
import { RoleEnum } from "@/payload/models/role-enum";
import qs from "qs";
import { FC } from "react";
import { z } from "zod";

const CourseMembers: FC<{
	params: { courseId: string };
	searchParams: Record<string, string>;
}> = (props) => {
	const params = z
		.object({ roles: z.array(z.nativeEnum(RoleEnum)).optional() })
		.parse(qs.parse(props.searchParams));
	return (
		<div className="lg:flex lg:h-full lg:flex-col">
			<header className="px-6 py-4">
				<Header2>Course Members</Header2>
			</header>
			<div className="px-6">
				<MembersTable
					courseId={props.params.courseId}
					roles={params.roles}
				/>
			</div>
		</div>
	);
};

export default CourseMembers;
