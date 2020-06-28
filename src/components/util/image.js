/* Utility functions to create objects to pass to deck.gl-raster */
import {
  combineBands,
  pansharpenBrovey,
  rgbaImage,
} from '@kylebarron/deck.gl-raster';
import { getModisUrls, getNaipUrl, getLandsatUrl } from './url';
import { isTrueColor } from './landsat';
import { loadRgbImage, loadSingleBandImage } from './webgl';

/**
 *
 * @param {x} options
 * @param {y} options
 * @param {z} options
 * @param {x} options
 * @param {x} options
 * @param {x} options
 * @param {x} options
 */
export function loadImages(options) {
  const { z, useNaip = false } = options || {};

  if (z < 7) {
    return loadModisImages(options);
  }

  // Up to zoom 13 since I'm using @1x tiles
  if (z <= 13 || !useNaip) {
    return loadLandsatImages(options);
  }

  return loadNaipImages(options);
}

async function loadModisImages(options) {
  const { gl } = options;
  const modules = [rgbaImage];
  const url = getModisUrls(options)[0];
  const { texture } = await loadRgbImage(gl, url);
  return { imageRgba: texture, modules };
}

async function loadLandsatImages(options) {
  const { gl, z, landsatBands } = options;
  const modules = [combineBands];
  const usePan = z >= 13 && isTrueColor(landsatBands);

  // Load pansharpen
  let imagePan;
  if (usePan) {
    const panUrl = getLandsatUrl(
      Object.assign(options, {
        landsatBands: 8,
      })
    );
    imagePan = loadSingleBandImage(gl, panUrl);
    modules.push(pansharpenBrovey);
  }

  const bandsUrls = landsatBands.map(band =>
    getLandsatUrl(
      Object.assign(options, {
        landsatBands: band,
      })
    )
  );

  // Note: imageBands is an Array of objects, not textures
  const imageBands = bandsUrls.map(url => loadSingleBandImage(gl, url));

  // Await all images together
  await Promise.all([imagePan, imageBands]);

  // The `Promise.all(imageBands)` converts an array of Promises to an array of
  // objects
  return {
    imageBands: await Promise.all(imageBands),
    imagePan: await imagePan,
    modules,
  };
}

async function loadNaipImages(options) {
  const { gl } = options;
  const modules = [rgbaImage];
  const url = getNaipUrl(options);
  const { texture, assets } = await loadRgbImage(gl, url);
  return { imageRgba: texture, modules, assets };
}
