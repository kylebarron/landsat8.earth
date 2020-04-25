export const TERRAIN_IMAGE = `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png`;

export function getTerrainUrl({ x, y, z }) {
  return TERRAIN_IMAGE.replace('{x}', x)
    .replace('{y}', y)
    .replace('{z}', z);
}

// Attempt at worldwide mosaic
export const LANDSAT_MOSAIC_URL =
  's3://kylebarron-landsat-test/mosaics/8113f57876010a63aadacef4eac6d010d10c9aafcf36a5ece064ea7f.json.gz';

export const NAIP_MOSAIC_URL =
  'dynamodb://us-west-2/7610d6d77fca346802fb21b89668cb12ef3162a31eb71734a8aaf5de';

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
  const { bands, mosaicUrl = LANDSAT_MOSAIC_URL, x, y, z, color_ops } = options;
  const bandsArray = Array.isArray(bands) ? bands : [bands];
  const params = new URLSearchParams({
    url: mosaicUrl,
    bands: bandsArray.join(','),
    color_ops: color_ops || landsatColorOps(bandsArray.length),
  });
  let baseUrl = `https://landsat-lambda.kylebarron.dev/tiles/${z}/${x}/${y}@2x.jpg?`;
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
  const { mosaicUrl = NAIP_MOSAIC_URL, x, y, z, color_ops } = options;
  const params = new URLSearchParams({
    url: mosaicUrl,
    color_ops: color_ops || 'sigmoidal RGB 4 0.5, saturation 1.25',
  });
  let baseUrl = `https://naip-lambda.kylebarron.dev/${z}/${x}/${y}@2x.jpg?`;
  return baseUrl + params.toString();
}

/**
 * Decoder for AWS Terrain Tiles
 */
export const ELEVATION_DECODER = {
  rScaler: 256,
  gScaler: 1,
  bScaler: 1 / 256,
  offset: -32768,
};

/**
 * get mesh max error for z value
 * @param {int} z mercator tile z coord
 * @param {float} multiplier multipler applied to default error
 *
 * Uses suggestion from here
 * https://www.linkedin.com/pulse/fast-cesium-terrain-rendering-new-quantized-mesh-output-alvaro-huarte/
 */
export function getMeshMaxError(z, multiplier = 0.4) {
  return (77067.34 / (1 << z)) * multiplier;
}
