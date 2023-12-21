import { AssignmentMedia0Schema } from "@/models/cms/assignment-media-0";
import { Where } from "payload/types";
import qs from "qs";
import { useQuery } from "react-query";
import { z } from "zod";

const fetchDocuments = async (endpoint: string) => {
	if (endpoint === "") return undefined;
	const resp = await fetch(endpoint);
	const body = await resp.json();
	const documents = z.array(AssignmentMedia0Schema).parse(body.docs);
	return documents;
};

export const useSubmissionDocuments = (documentsId: string[] | undefined) => {
	const query: Where = {
		id: { in: documentsId?.join(",") }
	};
	const endpoint = `/api/submissionsMedia${qs.stringify(
		{ where: query, depth: 0, limit: 1000, sort: "-updatedAt" },
		{ addQueryPrefix: true }
	)}`;
	const { data: documents } = useQuery(
		endpoint,
		async () => await fetchDocuments(endpoint),
		{ enabled: !!documentsId }
	);
	return { documents };
};
