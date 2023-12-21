import { Payload } from "payload";

export const seedMockLocations = async (payload: Payload) => {
	const res = await payload.find({
		collection: "locations",
		where: { name: { equals: "Mock Location" } },
		limit: 1
	});
	if (res.docs.length === 0) {
		await payload.create({
			collection: "locations",
			data: { name: "Mock Location" }
		});
	}
};
