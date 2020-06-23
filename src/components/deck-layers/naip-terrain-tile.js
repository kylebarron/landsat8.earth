import { SimpleMeshLayer } from '@deck.gl/mesh-layers';
import { COORDINATE_SYSTEM } from '@deck.gl/core';
import { load } from '@loaders.gl/core';
import { TileLayer } from '@deck.gl/geo-layers';
import { QuantizedMeshLoader } from '@loaders.gl/terrain';
import { getNaipUrl } from '../util';
import { getTerrainUrl, getMercatorModelMatrix } from './util';

const DUMMY_DATA = [1];

export default function NAIPTerrainTileLayer(props) {
  const {
    // Bug in TileLayer? with minZoom=7, zoom 7 tiles are loaded when map is at
    // zoom >= 6.
    minZoom = 13,
    maxZoom = 16,
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
  const terrain = load(terrainUrl, QuantizedMeshLoader);

  // Load satellite image
  const textureUrl = getNaipUrl({ x, y, z, mosaicUrl, color_ops });
  const texture = textureUrl
    ? // If surface image fails to load, the tile should still be displayed
      load(textureUrl).catch(_ => null)
    : Promise.resolve(null);

  return Promise.all([terrain, texture]);
}

function renderSubLayers(props) {
  const { data, tile } = props;

  if (!data) {
    return;
  }

  // Resolve promise if necessary
  let mesh = null;
  let texture = null;
  if (Array.isArray(data)) {
    mesh = data[0];
    texture = data[1];
  } else if (data) {
    mesh = data.then(result => result && result[0]);
    texture = data.then(result => result && result[1]);
  }

  return [
    new SimpleMeshLayer(props, {
      // NOTE: currently you need to set each sublayer id so they don't conflict
      id: `${props.id}-${tile.x}-${tile.y}-${tile.z}`,
      data: DUMMY_DATA,
      mesh,
      texture,
      getPolygonOffset: null,
      coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
      modelMatrix: getMercatorModelMatrix(tile),
      getPosition: d => [0, 0, 0],
      // Color to use if surfaceImage is unavailable
      getColor: [255, 255, 255],
    }),
  ];
}
