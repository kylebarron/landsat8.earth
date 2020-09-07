import {COORDINATE_SYSTEM} from '@deck.gl/core';
// Use copied code from deck.gl master until 8.3 release
// import { TileLayer } from '@deck.gl/geo-layers';
import {QuantizedMeshLoader} from '@loaders.gl/terrain';
import {load} from '@loaders.gl/core';
import {RasterMeshLayer} from '@kylebarron/deck.gl-raster';
import {getMercatorModelMatrix} from './util';
import {loadImages} from '../util/image';
import {getTerrainUrl} from '../util/terrain';

import TileLayer from './tile-layer/tile-layer';

const DUMMY_DATA = [1];

export function TileLayer3d(props) {
  const {
    id = 'tile-layer-3d',
    onViewportLoad = (x) => null,
    tileSize = 256,
    maxZoom = props.useNaip ? 17 : 13,
    zRange,
    landsatMosaicId,
    landsatBands,
    landsatColormapName,
    landsatBandCombination,
    naipMosaicId,
  } = props || {};

  return new TileLayer({
    id,
    minZoom: 0,
    maxZoom,
    getTileData: (args) => getTileData(Object.assign(args, props)),
    renderSubLayers,
    onViewportLoad,
    tileSize,
    maxRequests: 12,
    // refinementStrategy: 'no-overlap',
    zRange,
    updateTriggers: {
      // Need to expand landsatBands array since comparison is shallow
      getTileData: [
        landsatMosaicId,
        naipMosaicId,
        landsatColormapName,
        landsatBandCombination,
        ...landsatBands,
      ],
    },
  });
}

async function getTileData(options) {
  const {x, y, z, meshMultiplier = 1} = options || {};

  // TODO: when below zoom ~5 you can skip loading terrain
  // Load terrain
  const terrainUrl = getTerrainUrl({x, y, z, meshMultiplier});
  const terrain = load(terrainUrl, QuantizedMeshLoader);

  const images = loadImages(options);
  return Promise.all([images, terrain]);
}

function renderSubLayers(props) {
  const {data, tile} = props;

  if (!data) {
    return;
  }

  const [textures, mesh] = data;
  const {modules, images, ...moduleProps} = textures;

  return new RasterMeshLayer(props, {
    data: DUMMY_DATA,
    mesh,
    images,
    modules,
    moduleProps,
    getPolygonOffset: null,
    coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
    modelMatrix: getMercatorModelMatrix(tile),
    getPosition: (d) => [0, 0, 0],
    // Color to use if surfaceImage is unavailable
    getColor: [255, 255, 255],
    // material: false
  });
}
