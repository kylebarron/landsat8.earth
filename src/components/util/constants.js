function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num;
}

const devicePixelRatio =
  (typeof window !== 'undefined' && window.devicePixelRatio) || 1;

// Derived from map-tile example
// https://github.com/visgl/deck.gl/blob/master/examples/website/map-tile/app.js
export const defaultTileSize = 512 / clamp(devicePixelRatio, 1, 2);
