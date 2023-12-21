export function getAddedAndRemovedIds(oldIds: string[], newIds: string[]) {
	// Create Sets for quick look up
	const oldIdSet = new Set(oldIds);
	const newIdSet = new Set(newIds);

	// Determine removed Ids
	const removedIds = oldIds.filter((id) => !newIdSet.has(id));

	// Determine new Ids
	const addedIds = newIds.filter((id) => !oldIdSet.has(id));

	return { removedIds, addedIds };
}
