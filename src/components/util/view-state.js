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
  hashArray = hashArray.map(val => (Number.isFinite(val) && val) || null);

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
    key => viewState[key] == null && delete viewState[key]
  );

  return viewState;
}

function getHashFromViewState(viewState) {
  const { zoom, latitude, longitude, bearing, pitch } = viewState;
  const parts = [zoom.toFixed(2), latitude.toFixed(4), longitude.toFixed(4)];

  if (bearing) {
    parts.push(bearing.toFixed(4));
  }

  if (pitch) {
    parts.push(pitch.toFixed(4));
  }

  return `#${parts.join('/')}`;
}

export function setHashFromViewState(viewState) {
  const hash = getHashFromViewState(viewState);
  // eslint-disable-next-line no-restricted-globals
  if (typeof history !== undefined) history.replaceState(null, null, hash);
}
