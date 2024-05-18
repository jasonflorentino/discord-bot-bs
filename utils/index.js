/**
 * Throws `msg` if `condition` is false
 */
export function assert(condition, msg) {
  if (condition) {
    return true;
  } else {
    throw new Error(msg);
  }
}
