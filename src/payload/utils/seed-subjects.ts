import { Payload } from "payload";

export const seedMockSubjects = async (payload: Payload) => {
	const res = await payload.find({
		collection: "subjects",
		where: { name: { equals: "Mock Subject" } },
		limit: 1
	});
	if (res.docs.length === 0) {
		await payload.create({
			collection: "subjects",
			data: { name: "Mock Subject" }
		});
	}
};
