export function assert(condition, msg) {
	if (condition) {
		return true;
	} else {
		throw new Error(msg)
	}
}
