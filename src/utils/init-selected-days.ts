export const initSelectedDays = () => {
	const _ = new Array(7).fill(false);
	_[new Date().getDay()] = true;
	return _;
};
