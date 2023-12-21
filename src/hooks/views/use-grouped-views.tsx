import { View0Schema } from "@/models/cms/view-0";
import { unflatViewStrings } from "@/utils/unflat-view-strings";

export const useGroupedViews = (views: View0Schema[] | undefined) => {
	const groupedViews = unflatViewStrings(views);
	return { groupedViews };
};
