import { TileLayer } from '@deck.gl/geo-layers';
import { RasterLayer } from '@kylebarron/deck.gl-raster';
import { loadImages } from '../util/image';

export default function TileLayer2d(props) {
  const { id = 'tile-layer-2d', tileSize = 256 } = props || {};

  return new TileLayer({
    id,
    minZoom: 0,
    maxZoom: 17,
    tileSize,
    getTileData: args => getTileData(Object.assign(args, props)),
    renderSubLayers,
    maxRequests: 15,
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

  const { modules, ...moduleProps } = data;

  return new RasterLayer(props, {
    modules,
    moduleProps,
    bounds: [west, south, east, north],
  });
}
