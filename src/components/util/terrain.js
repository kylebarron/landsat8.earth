export function getTerrainUrl(opts) {
  const {x, y, z, mosaicUrl = 'terrarium', meshMultiplier} = opts;
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
