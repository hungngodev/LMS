import { Action0Schema } from "@/models/cms/action-0";
import { unflatActionStrings } from "@/utils/unflat-action-strings";

export const useGroupedActions = (actions: Action0Schema[] | undefined) => {
	const groupedActions = unflatActionStrings(actions);
	return { groupedActions };
};
