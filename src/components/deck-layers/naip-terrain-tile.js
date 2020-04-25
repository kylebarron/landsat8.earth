import { SimpleMeshLayer } from '@deck.gl/mesh-layers';
import { COORDINATE_SYSTEM } from '@deck.gl/core';
import { load } from '@loaders.gl/core';
import { TileLayer } from '@deck.gl/geo-layers';
import { getNaipUrl } from '../util';
import { getTerrainUrl, loadTerrain, getMeshMaxError } from './util';

export default function NAIPTerrainTileLayer(props) {
  const {
    minZoom = 12,
    maxZoom = 17,
    id = 'naip-terrain-tile-layer',
    mosaicUrl,
    meshMultiplier,
    color_ops,
  } = props || {};

  return new TileLayer({
    id,
    minZoom,
    maxZoom,
    getTileData: args =>
      getTileData(
        Object.assign(args, {
          mosaicUrl,
          meshMultiplier,
          color_ops,
        })
      ),
    renderSubLayers,
  });
}

function getTileData(options) {
  const { x, y, z, mosaicUrl, meshMultiplier, color_ops } = options || {};

  const terrainUrl = getTerrainUrl({ x, y, z });
  const textureUrl = getNaipUrl({ x, y, z, mosaicUrl, color_ops });

  // minx, miny, maxx, maxy
  // This is used to flip the image so that the origin is at the top left
  const bounds = [0, 1, 1, 0];

  // Load terrain tile
  const terrain = loadTerrain({
    terrainImage: terrainUrl,
    bounds,
    meshMaxError: getMeshMaxError(z, meshMultiplier),
  });
  // Load satellite image
  const texture = textureUrl
    ? // If surface image fails to load, the tile should still be displayed
      load(textureUrl).catch(_ => null)
    : Promise.resolve(null);

  return Promise.all([terrain, texture]);
}

function renderSubLayers(props) {
  const { data, tile } = props;

  // Resolve promises
  const mesh = data.then(result => result && result[0]);
  const texture = data.then(result => result && result[1]);
  return [
    new SimpleMeshLayer(props, {
      // NOTE: currently you need to set each sublayer id so they don't conflict
      id: `${props.id}-${tile.x}-${tile.y}-${tile.z}`,
      data: DUMMY_DATA,
      mesh,
      texture,
      getPolygonOffset: null,
      coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
      modelMatrix: getModelMatrix(tile),
      getPosition: d => [0, 0, 0],
      // Color to use if surfaceImage is unavailable
      getColor: [255, 255, 255],
    }),
  ];
}
