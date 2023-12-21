/**
 * split an input array of indetermined length into array containing subarrays containing n elements of input array. Does not mutate input array.
 */
export function splitArray<T>(inputArray: T[], n: number) {
	let result = [];
	for (let i = 0; i < inputArray.length; i += n) {
		result.push(inputArray.slice(i, i + n));
	}
	return result;
}
