import queryString from 'query-string';
import {debounce} from './util';

/**
 * Get ViewState from page URL hash
 * Note: does not necessarily return all viewState fields
 * @param {string} hash Page URL hash
 */
export function getViewStateFromHash(hash) {
  if (!hash || hash.charAt(0) !== '#') {
    return {};
  }

  // Split the hash into an array of numbers
  let hashArray = hash
    // Remove # symbol
    .substring(1)
    .split('/')
    .map(Number);

  // Remove non-numeric values
  hashArray = hashArray.map((val) => (Number.isFinite(val) && val) || null);

  // Order of arguments:
  // https://docs.mapbox.com/mapbox-gl-js/api/
  const [zoom, latitude, longitude, bearing, pitch] = hashArray;
  const viewState = {
    bearing,
    latitude,
    longitude,
    pitch,
    zoom,
  };

  // Delete null keys
  // https://stackoverflow.com/a/38340730
  Object.keys(viewState).forEach(
    (key) => viewState[key] == null && delete viewState[key]
  );

  return viewState;
}

function getHashFromViewState(viewState) {
  const {zoom, latitude, longitude, bearing, pitch} = viewState;
  const parts = [zoom.toFixed(2), latitude.toFixed(4), longitude.toFixed(4)];

  if (bearing) {
    parts.push(bearing.toFixed(4));
  }

  if (pitch) {
    parts.push(pitch.toFixed(4));
  }

  return `#${parts.join('/')}`;
}

function _setHashFromViewState(viewState) {
  const hash = getHashFromViewState(viewState);
  // eslint-disable-next-line no-restricted-globals
  if (typeof history !== undefined) history.replaceState(null, null, hash);
}

// Setting hash is known to be expensive (I'm guessing it's the
// `history.replaceState`). Therefore the function is wrapped in a debounce call
// to reduce the call frequency
export const setHashFromViewState = debounce(
  (viewState) => _setHashFromViewState(viewState),
  500
);

/* eslint-disable no-restricted-globals */
export function setQueryParams(newParams = {}) {
  if (typeof window === 'undefined') {
    return;
  }

  const existingParams = getQueryParams();
  const params = {...existingParams, ...newParams};

  // Parameters that shouldn't be serialized to the query string
  const removeParams = ['viewState'];
  for (const removeParam of removeParams) {
    delete params[removeParam];
  }

  const qs = queryString.stringify(params, {
    arrayFormat: 'comma',
    skipNull: true,
    skipEmptyString: true,
  });
  const newUrlString = `${location.pathname}?${qs}${location.hash}`;
  window.history.replaceState({}, '', newUrlString);
}

export function getQueryParams() {
  if (typeof window === 'undefined') {
    return;
  }

  const parsed = queryString.parse(location.search, {
    arrayFormat: 'comma',
    parseNumbers: true,
    parseBooleans: true,
  });
  return parsed;
}
/* eslint-enable no-restricted-globals */
