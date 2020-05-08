export const DEFAULT_LANDSAT_MOSAIC_ID = 'winter2020';
export const DEFAULT_NAIP_MOSAIC_ID = '2016-2018';

/**
 * Get color operations string for landsat bands
 * @param {Number} nBands Number of bands
 */
function landsatColorOps(nBands) {
  const colorBands = 'RGB'.slice(0, nBands);
  let colorStr = `gamma ${colorBands} 3.5, sigmoidal ${colorBands} 15 0.35`;

  if (nBands === 3) {
    colorStr += ', saturation 1.7';
  }
  return colorStr;
}

/**
 * Get URL including query string to fetch Landsat tile
 * @param {object} options:
 * bands: array of band numbers
 * mosaicUrl: url to mosaicJSON, parsed by backend
 * x: mercator tile x
 * y: mercator tile y
 * z: mercator tile z
 * color_ops: Custom color_ops rio-color string
 */
export function getLandsatUrl(options) {
  const { bands, mosaicUrl, x, y, z, color_ops } = options || {};
  const bandsArray = Array.isArray(bands) ? bands : [bands];
  const params = new URLSearchParams({
    bands: bandsArray.join(','),
    color_ops: color_ops || landsatColorOps(bandsArray.length),
    url: mosaicUrl,
  });
  let baseUrl = `https://us-west-2-lambda.kylebarron.dev/landsat/tiles/${z}/${x}/${y}@2x.jpg?`;
  return baseUrl + params.toString();
}

/**
 * Get URL including query string to fetch NAIP tile
 * @param {object} options:
 * mosaicUrl: url to mosaicJSON, parsed by backend
 * x: mercator tile x
 * y: mercator tile y
 * z: mercator tile z
 * color_ops: Custom color_ops rio-color string
 */
export function getNaipUrl(options) {
  const {
    mosaicUrl,
    x = null,
    y = null,
    z = null,
    color_ops = 'sigmoidal RGB 4 0.5, saturation 1.25',
  } = options || {};
  const params = new URLSearchParams({
    color_ops,
    url: mosaicUrl,
  });
  // Don't replace string by default, so that it can be passed as a Mapbox tile
  // url
  let baseUrl = `https://us-west-2-lambda.kylebarron.dev/naip/{z}/{x}/{y}@2x.jpg?`;

  // If x, y, z are passsed fill them into url template
  if (x && y && z) {
    baseUrl = baseUrl
      .replace('{x}', x)
      .replace('{y}', y)
      .replace('{z}', z);
  }
  return baseUrl + params.toString();
}

/**
 * Get MODIS Tile urls for date
 * @param {object} options {dateStr: str}
 */
export function getModisUrls(options) {
  const { dateStr = '2018-06-01' } = options || {};

  // From https://github.com/nasa-gibs/gibs-web-examples/blob/8cd157424abd98d0b3463b457579eb0e62e1cdd2/examples/mapbox-gl/webmercator-epsg3857.js#L22-L24
  const tilePath =
    'wmts/epsg3857/best/' +
    'MODIS_Terra_CorrectedReflectance_TrueColor/default/' +
    `${dateStr}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`;

  return [
    'https://gibs-a.earthdata.nasa.gov/' + tilePath,
    'https://gibs-b.earthdata.nasa.gov/' + tilePath,
    'https://gibs-c.earthdata.nasa.gov/' + tilePath,
  ];
}

/**
 * Get ViewState from page URL hash
 * Note: does not necessarily return all viewState fields
 * @param {string} hash Page URL hash
 */
export function getViewStateFromHash(hash) {
  if (!hash || hash.charAt(0) !== '#') {
    return;
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
