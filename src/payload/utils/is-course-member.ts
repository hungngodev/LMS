import { Course0Schema } from "@/models/cms/course-0";
import { User2Schema } from "@/models/cms/user-2";
import { Payload } from "payload";

export const isCourseMember = async (
	user: User2Schema,
	courseId: string,
	payload: Payload
): Promise<boolean> => {
	const course = Course0Schema.parse(
		await payload.findByID({ collection: "courses", id: courseId })
	);
	return course.members?.includes(user.id) ?? false;
};
