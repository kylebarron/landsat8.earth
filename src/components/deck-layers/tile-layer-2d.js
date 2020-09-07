// Use copied code from deck.gl master until 8.3 release
// import { TileLayer } from '@deck.gl/geo-layers';
import { RasterLayer } from '@kylebarron/deck.gl-raster';
import { loadImages } from '../util/image';

import TileLayer from './tile-layer/tile-layer';

export function TileLayer2d(props) {
  const {
    id = 'tile-layer-2d',
    tileSize = 256,
    maxZoom = props.useNaip ? 17 : 13,
    landsatMosaicId,
    naipMosaicId,
    landsatBands,
    landsatBandCombination,
    landsatColormapName,
  } = props || {};

  return new TileLayer({
    id,
    minZoom: 0,
    maxZoom,
    tileSize,
    getTileData: args => getTileData(Object.assign(args, props)),
    renderSubLayers,
    maxRequests: 10,
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
  return loadImages(options);
}

function renderSubLayers(props) {
  const {
    bbox: { west, south, east, north },
  } = props.tile;
  const { data } = props;

  if (!data) {
    return null;
  }

  const { modules, images, ...moduleProps } = data;

  return new RasterLayer(props, {
    modules,
    images,
    moduleProps,
    bounds: [west, south, east, north],
  });
}
