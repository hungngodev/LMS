import { View0Schema } from "@/models/cms/view-0";

export interface UnflatViewStrings {
	id?: string;
	children?: { [key: string]: UnflatViewStrings };
}

export const unflatViewStrings = (
	views: View0Schema[] | undefined
): UnflatViewStrings | undefined => {
	if (!views) return undefined;

	const root: UnflatViewStrings = {};
	views.forEach((view) => {
		const layers = view.name.split(":");
		let currentLevel = root;
		layers.forEach((layer, index) => {
			if (!currentLevel.children) currentLevel.children = {};
			if (!currentLevel.children[layer])
				currentLevel.children[layer] = {};
			currentLevel = currentLevel.children[layer];

			// if its the last layer, set the id
			if (index === layers.length - 1) currentLevel.id = view.id;
		});
	});
	return root;
};
