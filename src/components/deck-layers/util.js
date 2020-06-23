import { Matrix4 } from 'math.gl';

export const TERRAIN_IMAGE = `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png`;

export function getTerrainUrl(opts) {
  const { x, y, z, mosaicUrl = 'terrarium', meshMultiplier } = opts;
  const meshMaxError =
    opts.meshMaxError || getMeshMaxError(z, meshMultiplier).toFixed(2);
  const params = {
    url: mosaicUrl,
    mesh_max_error: meshMaxError,
  };
  const searchParams = new URLSearchParams(params);
  let baseUrl = `https://us-east-1-lambda.kylebarron.dev/dem/mesh/${z}/${x}/${y}.terrain?`;
  return baseUrl + searchParams.toString();
}

// From https://github.com/uber/deck.gl/blob/b1901b11cbdcb82b317e1579ff236d1ca1d03ea7/modules/geo-layers/src/mvt-tile-layer/mvt-tile-layer.js#L41-L52
export function getMercatorModelMatrix(tile) {
  const WORLD_SIZE = 512;
  const worldScale = Math.pow(2, tile.z);

  const xScale = WORLD_SIZE / worldScale;
  const yScale = -xScale;

  const xOffset = (WORLD_SIZE * tile.x) / worldScale;
  const yOffset = WORLD_SIZE * (1 - tile.y / worldScale);

  return new Matrix4()
    .translate([xOffset, yOffset, 0])
    .scale([xScale, yScale, 1]);
}

/**
 * get mesh max error for z value
 * @param {int} z mercator tile z coord
 * @param {float} multiplier multipler applied to default error
 *
 * Uses suggestion from here
 * https://www.linkedin.com/pulse/fast-cesium-terrain-rendering-new-quantized-mesh-output-alvaro-huarte/
 */
function getMeshMaxError(z, multiplier = 1) {
  return (77067.34 / (1 << z)) * multiplier;
}
