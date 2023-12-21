export const initSelectedMonths = () => {
	const _ = new Array(12).fill(false);
	_[new Date().getMonth()] = true;
	return _;
};
