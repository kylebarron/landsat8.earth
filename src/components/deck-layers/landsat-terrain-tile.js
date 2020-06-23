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

  // TODO: don't load unnecessary tiles
  // NOTE: if I return false, that gets cached, so that when you zoom out you
  // see nothing.
  // if (!visible) {
  //   return false
  // }

  // Load terrain
  const terrainUrl = getTerrainUrl({ x, y, z });
  const terrain = load(terrainUrl, QuantizedMeshLoader);

  const modules = [combineBands];
  let imagePan;
  if (z >= 12) {
    const panUrl = getLandsatUrl({ x, y, z, bands: 8, mosaicUrl, color_ops });
    // TODO: need to await all images together
    imagePan = await imageUrlsToTextures(gl, panUrl);
    modules.push(pansharpenBrovey);
  }

  // Load landsat urls
  const urls = [
    getLandsatUrl({ x, y, z, bands: rgbBands[0], mosaicUrl, color_ops }),
    getLandsatUrl({ x, y, z, bands: rgbBands[1], mosaicUrl, color_ops }),
    getLandsatUrl({ x, y, z, bands: rgbBands[2], mosaicUrl, color_ops }),
  ];

  const imageBands = await imageUrlsToTextures(gl, urls);
  return Promise.all([{ imageBands, imagePan, modules }, terrain]);
}

function renderSubLayers(props) {
  const { data, tile } = props;

  if (!data) {
    return;
  }

  const [textures, mesh] = data;
  const { modules, ...moduleProps } = textures;

  return new RasterMeshLayer(props, {
    data: DUMMY_DATA,
    mesh,
    modules,
    moduleProps,
    getPolygonOffset: null,
    coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
    modelMatrix: getMercatorModelMatrix(tile),
    getPosition: d => [0, 0, 0],
    // Color to use if surfaceImage is unavailable
    getColor: [255, 255, 255],
  });
}
