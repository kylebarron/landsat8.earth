/* General utilities */

// Keep only the `key`, `text`, and `value` keys of an array of objects
export function arrayToProps(array) {
  // https://stackoverflow.com/a/39333479
  return array.map(({ key, text, value }) => ({ key, text, value }));
}
