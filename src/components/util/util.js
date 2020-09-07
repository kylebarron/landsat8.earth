/* General utilities */

// Keep only the `key`, `text`, and `value` keys of an array of objects
export function arrayToProps(array) {
  // https://stackoverflow.com/a/39333479
  return array.map(({key, text, value, image}) => ({
    key,
    text,
    value,
    image,
  }));
}

// From https://levelup.gitconnected.com/debounce-in-javascript-improve-your-applications-performance-5b01855e086
// Originally inspired by  David Walsh (https://davidwalsh.name/javascript-debounce-function)

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// `wait` milliseconds.
export const debounce = (func, wait) => {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
