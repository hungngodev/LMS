export const sameArray = (a1: any[] | undefined, a2: any[] | undefined) => {
	if (a1 === undefined && a2 === undefined) return true;
	if (!Array.isArray(a1) || !Array.isArray(a2)) return false;
	if (a1.length !== a2.length) return false;
	for (let i = 0; i < a1.length; i++) {
		if (a1[i] !== a2[i]) return false;
	}
	return true;
};
