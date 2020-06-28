/* Utilities for creating request urls */

export const DEFAULT_LANDSAT_MOSAIC_ID = 'summer2019';
export const DEFAULT_NAIP_MOSAIC_ID = '2016-2018';

export function getImageUrl(options) {
  const { z, useNaip = false } = options || {};

  if (z < 7) {
    return getModisUrls(options);
  }

  // Up to zoom 13 since I'm using @1x tiles
  if (z <= 13 || !useNaip) {
    return getLandsatUrl(options);
  }

  return getNaipUrl(options);
}

const getScale = tileSize => (tileSize === 512 ? '@2x' : '');

/**
 * Get color operations string for landsat bands
 * @param {Number} nBands Number of bands
 */
function defaultLandsatColorOps(nBands) {
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
 * landsatBands: array of band numbers
 * landsatMosaicUrl: url to mosaicJSON, parsed by backend
 * x: mercator tile x
 * y: mercator tile y
 * z: mercator tile z
 * landsatColorOps: Custom color_ops rio-color string
 */
export function getLandsatUrl(options) {
  const {
    landsatBands,
    landsatMosaicUrl,
    x,
    y,
    z,
    landsatColorOps,
    tileSize = 256,
  } = options || {};
  const scale = getScale(tileSize);
  const bandsArray = Array.isArray(landsatBands)
    ? landsatBands
    : [landsatBands];
  const params = new URLSearchParams({
    bands: bandsArray.join(','),
    color_ops: landsatColorOps || defaultLandsatColorOps(bandsArray.length),
    url: landsatMosaicUrl,
  });
  let baseUrl = `https://us-west-2-lambda.kylebarron.dev/landsat/tiles/${z}/${x}/${y}${scale}.jpg?`;
  return baseUrl + params.toString();
}

/**
 * Get URL including query string to fetch NAIP tile
 * @param {object} options:
 * naipMosaicUrl: url to mosaicJSON, parsed by backend
 * x: mercator tile x
 * y: mercator tile y
 * z: mercator tile z
 * naipColorOps: Custom color_ops rio-color string
 */
export function getNaipUrl(options) {
  const {
    naipMosaicUrl,
    x = null,
    y = null,
    z = null,
    naipColorOps = 'sigmoidal RGB 4 0.5, saturation 1.25',
    tileSize = 256,
  } = options || {};

  const scale = getScale(tileSize);
  const params = new URLSearchParams({
    color_ops: naipColorOps,
    url: naipMosaicUrl,
  });
  // Don't replace string by default, so that it can be passed as a Mapbox tile
  // url
  let baseUrl = `https://us-west-2-lambda.kylebarron.dev/naip/{z}/{x}/{y}${scale}.jpg?`;

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
 * @param {object} options {modisDateStr: str}
 */
export function getModisUrls(options) {
  const { x = null, y = null, z = null, modisDateStr = '2018-06-01' } =
    options || {};

  // From https://github.com/nasa-gibs/gibs-web-examples/blob/8cd157424abd98d0b3463b457579eb0e62e1cdd2/examples/mapbox-gl/webmercator-epsg3857.js#L22-L24
  let tilePath =
    'wmts/epsg3857/best/' +
    'MODIS_Terra_CorrectedReflectance_TrueColor/default/' +
    `${modisDateStr}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`;

  // If x, y, z are passsed fill them into url template
  if (x && y && z) {
    tilePath = tilePath
      .replace('{x}', x)
      .replace('{y}', y)
      .replace('{z}', z);
  }

  return [
    'https://gibs-a.earthdata.nasa.gov/' + tilePath,
    'https://gibs-b.earthdata.nasa.gov/' + tilePath,
    'https://gibs-c.earthdata.nasa.gov/' + tilePath,
  ];
}

// Choose random url for request
function chooseRandom(urls, z) {}
