/* Utility functions to create objects to pass to deck.gl-raster */
import {
  colormap,
  combineBands,
  enhancedVegetationIndex,
  modifiedSoilAdjustedVegetationIndex,
  normalizedDifference,
  pansharpenBrovey,
  rgbaImage,
  soilAdjustedVegetationIndex,
} from '@kylebarron/deck.gl-raster';
import { getModisUrls, getNaipUrl, getLandsatUrl, getColormapUrl } from './url';
import { isTrueColor } from './landsat';
import { loadRgbImage, loadSingleBandImage } from './webgl';

export function loadImages(options) {
  const { z, useNaip = false } = options || {};

  if (z < 8) {
    return loadModisImages(options);
  }

  // Up to zoom 13 since I'm using @1x tiles
  if (z <= 13 || !useNaip) {
    return loadLandsatImages(options);
  }

  return loadNaipImages(options);
}

async function loadModisImages(options) {
  const modules = [rgbaImage];
  const url = getModisUrls(options)[0];

  const { imageData } = await loadRgbImage(url);
  const images = { imageRgba: imageData };

  return { images, modules };
}

async function loadLandsatImages(options) {
  const {
    z,
    landsatBands,
    landsatColormapName,
    landsatBandCombination,
  } = options;
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
    imagePan = loadSingleBandImage(panUrl);
    modules.push(pansharpenBrovey);
  }

  // Modules must be added before colormap module
  // Number of bands to load
  let maxBands = 3;
  switch (landsatBandCombination) {
    case 'normalizedDifference':
      modules.push(normalizedDifference);
      maxBands = 2;
      break;
    case 'enhancedVegetationIndex':
      modules.push(enhancedVegetationIndex);
      break;
    case 'soilAdjustedVegetationIndex':
      modules.push(soilAdjustedVegetationIndex);
      maxBands = 2;
      break;
    case 'modifiedSoilAdjustedVegetationIndex':
      modules.push(modifiedSoilAdjustedVegetationIndex);
      maxBands = 2;
      break;
    default:
      break;
  }

  const bandsUrls = landsatBands.slice(0, maxBands).map(band =>
    getLandsatUrl(
      Object.assign(options, {
        landsatBands: band,
      })
    )
  );

  // Note: imageBands (will be) an Array of objects, not direct textures
  let imageBands = bandsUrls.map(url => loadSingleBandImage(url));

  // Load colormap
  // Only load if landsatBandCombination is not RGB
  let imageColormap;
  if (landsatColormapName && landsatBandCombination !== 'rgb') {
    const colormapUrl = getColormapUrl(landsatColormapName);
    imageColormap = loadSingleBandImage(colormapUrl);
    modules.push(colormap);
  }

  // Await all images together
  await Promise.all([imagePan, imageBands, imageColormap]);

  // Split each image object into its `imageData` and `assets` identifiers
  // https://stackoverflow.com/a/27386370/7319250
  ({ imageData: imagePan } = (await imagePan) || {});
  ({ imageData: imageColormap } = (await imageColormap) || {});

  const imageBandsObjects = await Promise.all(imageBands);
  imageBands = imageBandsObjects.map(({ imageData }) => imageData);
  const landsatAssetIds = imageBandsObjects.map(({ assets }) => assets);

  // The `Promise.all(imageBands)` converts an array of Promises to an array of
  // objects
  const images = {
    imageBands,
    imageColormap,
    imagePan,
  };

  return {
    images,
    modules,
    landsatAssetIds,
  };
}

async function loadNaipImages(options) {
  const modules = [rgbaImage];
  const url = getNaipUrl(options);

  const { imageData, assets } = await loadRgbImage(url);
  const images = { imageRgba: imageData };

  return { images, modules, assets };
}
