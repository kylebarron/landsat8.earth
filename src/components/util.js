// Attempt at worldwide mosaic
export const DEFAULT_LANDSAT_MOSAIC_URL =
  's3://kylebarron-landsat-test/mosaics/8113f57876010a63aadacef4eac6d010d10c9aafcf36a5ece064ea7f.json.gz';

export const DEFAULT_NAIP_MOSAIC_URL =
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
  const { bands, mosaicUrl = DEFAULT_LANDSAT_MOSAIC_URL, x, y, z, color_ops } =
    options || {};
  const bandsArray = Array.isArray(bands) ? bands : [bands];
  const params = new URLSearchParams({
    bands: bandsArray.join(','),
    color_ops: color_ops || landsatColorOps(bandsArray.length),
    url: mosaicUrl,
  });
  let baseUrl = `https://lambda.kylebarron.dev/landsat/tiles/${z}/${x}/${y}@2x.jpg?`;
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
    mosaicUrl = DEFAULT_NAIP_MOSAIC_URL,
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
  let baseUrl = `https://lambda.kylebarron.dev/naip/{z}/{x}/{y}@2x.jpg?`;

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
