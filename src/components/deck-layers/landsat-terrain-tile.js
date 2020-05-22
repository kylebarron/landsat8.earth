import { COORDINATE_SYSTEM } from '@deck.gl/core';
import { load } from '@loaders.gl/core';
import { TerrainLoader } from '@loaders.gl/terrain';
import { TileLayer } from '@deck.gl/geo-layers';
import { ELEVATION_DECODER, getTerrainUrl, getMeshMaxError } from './util';
import { Matrix4 } from 'math.gl';
import { BandsSimpleMeshLayer } from '@kylebarron/deck.gl-extended-layers';
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
  let image_r, image_g, image_b, image_pan, mesh, textures = null;
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
      modelMatrix: getModelMatrix(tile),
      getPosition: d => [0, 0, 0],
      // Color to use if surfaceImage is unavailable
      getColor: [255, 255, 255],
    }),
  ];
}

// From https://github.com/uber/deck.gl/blob/b1901b11cbdcb82b317e1579ff236d1ca1d03ea7/modules/geo-layers/src/mvt-tile-layer/mvt-tile-layer.js#L41-L52
function getModelMatrix(tile) {
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

function loadTerrain({
  terrainImage,
  bounds,
  elevationDecoder,
  meshMaxError,
  workerUrl,
}) {
  if (!terrainImage) {
    return null;
  }
  const options = {
    terrain: {
      bounds,
      meshMaxError,
      elevationDecoder,
    },
  };
  if (workerUrl) {
    options.terrain.workerUrl = workerUrl;
  }
  return load(terrainImage, TerrainLoader, options);
}
