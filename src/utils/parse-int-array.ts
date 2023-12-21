export const parseIntArray = (...args: string[] | number[]) => {
	return args.map((arg) => {
		if (typeof arg === "string") return parseInt(arg);
		if (typeof arg === "number") return parseInt(arg.toString());
		else throw "Invalid input type";
	});
};
