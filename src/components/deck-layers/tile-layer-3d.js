import { COORDINATE_SYSTEM } from '@deck.gl/core';
import { TileLayer } from '@deck.gl/geo-layers';
import { QuantizedMeshLoader } from '@loaders.gl/terrain';
import { load } from '@loaders.gl/core';
import { RasterMeshLayer } from '@kylebarron/deck.gl-raster';
import { getMercatorModelMatrix } from './util';
import { loadImages } from '../util/image';
import { getTerrainUrl } from '../util/terrain';

const DUMMY_DATA = [1];

export function TileLayer3d(props) {
  const { id = 'tile-layer-3d', tileSize = 256 } = props || {};

  return new TileLayer({
    id,
    minZoom: 0,
    maxZoom: 17,
    getTileData: args => getTileData(Object.assign(args, props)),
    // getTileData: _getTileData,
    renderSubLayers,
    tileSize,
    // It doesn't look like this necessarily is working?
    maxRequests: 10,
  });
}

async function getTileData(options) {
  const { x, y, z, meshMultiplier = 1 } = options || {};

  // NOTE: when below zoom ~5 you can skip loading terrain
  // Load terrain
  const terrainUrl = getTerrainUrl({ x, y, z, meshMultiplier });
  const terrain = load(terrainUrl, QuantizedMeshLoader);

  const images = loadImages(options);
  return Promise.all([images, terrain]);
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
    // Note: not sure if this works with tilesize 256 as well as 512?
    modelMatrix: getMercatorModelMatrix(tile),
    getPosition: d => [0, 0, 0],
    // Color to use if surfaceImage is unavailable
    getColor: [255, 255, 255],
  });
}
