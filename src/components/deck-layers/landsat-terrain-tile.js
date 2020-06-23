import { registerLoaders } from '@loaders.gl/core';
import { ImageLoader } from '@loaders.gl/images';
import { COORDINATE_SYSTEM } from '@deck.gl/core';
import { TileLayer } from '@deck.gl/geo-layers';
import {
  ELEVATION_DECODER,
  getTerrainUrl,
  getMeshMaxError,
  getMercatorModelMatrix,
  loadTerrain,
} from './util';
import { BandsSimpleMeshLayer } from '@kylebarron/deck.gl-extended-layers';
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
  const terrainImage = getTerrainUrl({ x, y, z });
  const bounds = [0, 1, 1, 0];
  const terrain = loadTerrain({
    terrainImage,
    bounds,
    elevationDecoder: ELEVATION_DECODER,
    meshMaxError: getMeshMaxError(z, meshMultiplier),
  });

  // Load landsat urls
  const urls = [
    getLandsatUrl({ x, y, z, bands: rgbBands[0], mosaicUrl, color_ops }),
    getLandsatUrl({ x, y, z, bands: rgbBands[1], mosaicUrl, color_ops }),
    getLandsatUrl({ x, y, z, bands: rgbBands[2], mosaicUrl, color_ops }),
  ];
  if (pan) {
    urls.push(getLandsatUrl({ x, y, z, bands: 8, mosaicUrl, color_ops }));
  }

  // const { textures, assets } = await imageUrlsToTextures(gl, urls);
  // const [awaited_textures, awaited_terrain] = Promise.all([
  //   textures,
  //   terrain,
  // ]);
  // return { assets, textures: awaited_textures, terrain: awaited_terrain };

  const textures = imageUrlsToTextures(gl, urls);
  return Promise.all([textures, terrain]);
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
  let image_r;
  let image_g;
  let image_b;
  let image_pan;
  let mesh;
  let textures;
  if (Array.isArray(data)) {
    textures = data[0];
    mesh = data[1];

    image_r = textures[0];
    image_g = textures[1];
    image_b = textures[2];
    if (pan && textures.length === 4) {
      image_pan = textures[3];
    }
  } else if (data) {
    textures = data.then(result => result && result[0]);
    mesh = data.then(result => result && result[1]);

    image_r = textures.then(result => result && result[0]);
    image_g = textures.then(result => result && result[1]);
    image_b = textures.then(result => result && result[2]);
    if (pan) {
      image_pan = textures.then(result => result && result[3]);
    }
  }

  return [
    new BandsSimpleMeshLayer(props, {
      // NOTE: currently you need to set each sublayer id so they don't conflict
      // NOTE: is there an id on props?
      id: `${props.id}-${tile.x}-${tile.y}-${tile.z}`,
      data: DUMMY_DATA,
      mesh,
      image_r,
      image_g,
      image_b,
      image_pan,
      getPolygonOffset: null,
      coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
      modelMatrix: getMercatorModelMatrix(tile),
      getPosition: d => [0, 0, 0],
      // Color to use if surfaceImage is unavailable
      getColor: [255, 255, 255],
    }),
  ];
}
