import { registerLoaders } from '@loaders.gl/core';
import { ImageLoader } from '@loaders.gl/images';
import { COORDINATE_SYSTEM } from '@deck.gl/core';
import { TileLayer } from '@deck.gl/geo-layers';
import { QuantizedMeshLoader } from '@loaders.gl/terrain';
import { load } from '@loaders.gl/core';
import { getTerrainUrl, getMercatorModelMatrix } from './util';
import {
  RasterMeshLayer,
  combineBands,
  pansharpenBrovey,
} from '@kylebarron/deck.gl-raster';
import { getLandsatUrl } from '../util';
import { imageUrlsToTextures } from '../util/webgl';

const DUMMY_DATA = [1];
registerLoaders(ImageLoader);

// TODO: update to have one terrain tile layer switching image urls at different
// z's instead of separate tile layers?
export default function LandsatTerrainTileLayer(props) {
  const {
    gl,
    minZoom = 7,
    maxZoom = 12,
    id = 'landsat-terrain-tile-layer',
    mosaicUrl,
    meshMultiplier,
    color_ops,
    rgbBands,
    visible,
  } = props || {};

  const _getTileData = args =>
    getTileData(
      Object.assign(args, {
        gl,
        mosaicUrl,
        meshMultiplier,
        color_ops,
        rgbBands,
      })
    );

  return new TileLayer({
    id,
    minZoom,
    maxZoom,
    getTileData: _getTileData,
    renderSubLayers,
    visible,
  });
}

async function getTileData(options) {
  const {
    gl,
    x,
    y,
    z,
    mosaicUrl,
    meshMultiplier = 1,
    color_ops,
    rgbBands = [4, 3, 2],
  } = options || {};
  const pan = z >= 12;

  // TODO: don't load unnecessary tiles
  // NOTE: if I return false, that gets cached, so that when you zoom out you
  // see nothing.
  // if (!visible) {
  //   return false
  // }

  // Load terrain
  const terrainUrl = getTerrainUrl({ x, y, z });
  const terrain = load(terrainUrl, QuantizedMeshLoader);

  // Load landsat urls
  const urls = [
    pan ? getLandsatUrl({ x, y, z, bands: 8, mosaicUrl, color_ops }) : null,
    getLandsatUrl({ x, y, z, bands: rgbBands[0], mosaicUrl, color_ops }),
    getLandsatUrl({ x, y, z, bands: rgbBands[1], mosaicUrl, color_ops }),
    getLandsatUrl({ x, y, z, bands: rgbBands[2], mosaicUrl, color_ops }),
  ];

  // const { textures, assets } = await imageUrlsToTextures(gl, urls);
  // const [awaited_textures, awaited_terrain] = Promise.all([
  //   textures,
  //   terrain,
  // ]);
  // return { assets, textures: awaited_textures, terrain: awaited_terrain };

  const [imagePan, ...imageBands] = await imageUrlsToTextures(gl, urls);
  return Promise.all([{ imageBands, imagePan }, terrain]);
}

function renderSubLayers(props) {
  const { data, tile } = props;
  const { z } = tile;
  const pan = z >= 12;

  if (!data) {
    return;
  }

  // Resolve promise if needed
  // Apparently when overzooming, data is provided not as a promise
  let textures;
  let mesh;
  if (Array.isArray(data)) {
    textures = data[0];
    mesh = data[1];
  } else if (data) {
    textures = data.then(result => result && result[0]);
    mesh = data.then(result => result && result[1]);
  }

  const modules = [combineBands];
  if (pan) {
    modules.push(pansharpenBrovey);
  }

  return new RasterMeshLayer(props, {
    data: DUMMY_DATA,
    mesh,
    modules,
    asyncModuleProps: textures,
    getPolygonOffset: null,
    coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
    modelMatrix: getMercatorModelMatrix(tile),
    getPosition: d => [0, 0, 0],
    // Color to use if surfaceImage is unavailable
    getColor: [255, 255, 255],
  });
}
