import { Action0Schema } from "@/models/cms/action-0";

export interface UnflatActionStrings {
	id?: string;
	children?: { [key: string]: UnflatActionStrings };
}

export const unflatActionStrings = (
	actions: Action0Schema[] | undefined
): UnflatActionStrings | undefined => {
	if (!actions) return undefined;

	const root: UnflatActionStrings = {};
	actions.forEach((action) => {
		const layers = action.name.split(":");
		let currentLevel = root;
		layers.forEach((layer, index) => {
			if (!currentLevel.children) currentLevel.children = {};
			if (!currentLevel.children[layer])
				currentLevel.children[layer] = {};
			currentLevel = currentLevel.children[layer];

			// if its the last layer, set the id
			if (index === layers.length - 1) currentLevel.id = action.id;
		});
	});
	return root;
};
