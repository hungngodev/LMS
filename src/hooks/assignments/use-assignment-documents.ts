import { Assignment0Schema } from "@/models/cms/assignment-0";
import { AssignmentMedia0Schema } from "@/models/cms/assignment-media-0";
import { Where } from "payload/types";
import qs from "qs";
import { useMemo, useCallback } from "react";
import { useQuery } from "react-query";
import { z } from "zod";

//fetch documents from assignment
const fetchDocuments = async (endpoint: string) => {
	if (endpoint === "") return undefined;
	const resp = await fetch(endpoint);
	const body = await resp.json();
	const documents = z.array(AssignmentMedia0Schema).parse(body.docs);
	return documents;
};

export const useAssignmentDocuments = (assignment: Assignment0Schema | undefined) => {
	const documentsId = useMemo(() => {
		if (!assignment) return undefined;
		if (!assignment.documents) return [];
		return assignment.documents;
	}, [assignment]);
	const query: Where = useMemo(
		() =>
			documentsId
				? {
						id: { in: documentsId.join(",") }
				  }
				: ({} as Record<never, never>),
		[documentsId]
	);
	const endpoint = useMemo(
		() =>
			JSON.stringify(query) !== "{}"
				? `/api/assignmentsMedia${qs.stringify(
						{
							where: query,
							depth: 0,
							limit: 1000,
							sort: "-updatedAt"
						},
						{ addQueryPrefix: true }
				  )}`
				: "",
		[query]
	);
	const fetchDocumentsCb = useCallback(
		async () => await fetchDocuments(endpoint),
		[endpoint]
	);
	const { data: documents } = useQuery(endpoint, fetchDocumentsCb, {
		enabled: endpoint !== ""
	});
	return { documents };
};