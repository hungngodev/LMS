export const padLeft = (input: string, char: string, resultLength: number) => {
	if (char.length !== 1) {
		throw "Char must be 1 character long";
	}

	if (resultLength < input.length)
		throw "Result length must be longer than input length";

	let pad = "";

	for (let i = 0; i < resultLength - input.length; i++) {
		pad += char;
	}

	return pad + input;
};
