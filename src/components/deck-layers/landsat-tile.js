import { TileLayer } from '@deck.gl/geo-layers';
import {
  RasterLayer,
  combineBands,
  promiseAllObject,
  pansharpenBrovey,
} from '@kylebarron/deck.gl-raster';
import { getLandsatUrl } from '../util';
import { imageUrlsToTextures } from '../util/webgl';

export default function LandsatTileLayer(props) {
  const {
    gl,
    // Bug in TileLayer? with minZoom=7, zoom 7 tiles are loaded when map is at
    // zoom >= 6.
    minZoom = 8,
    maxZoom = 12,
    id = 'landsat-tile-layer',
    mosaicUrl,
    color_ops,
    rgbBands,
    visible = true,
  } = props || {};

  return new TileLayer({
    id,
    minZoom,
    maxZoom,
    getTileData: args =>
      getTileData(
        Object.assign(args, {
          gl,
          mosaicUrl,
          color_ops,
          rgbBands,
        })
      ),
    renderSubLayers,
    visible,
  });
}

async function getTileData(options) {
  const { gl, x, y, z, mosaicUrl, color_ops, rgbBands = [4, 3, 2] } =
    options || {};
  const pan = z >= 12;

  // Load landsat urls
  const urls = [
    pan ? getLandsatUrl({ x, y, z, bands: 8, mosaicUrl, color_ops }) : null,
    getLandsatUrl({ x, y, z, bands: rgbBands[0], mosaicUrl, color_ops }),
    getLandsatUrl({ x, y, z, bands: rgbBands[1], mosaicUrl, color_ops }),
    getLandsatUrl({ x, y, z, bands: rgbBands[2], mosaicUrl, color_ops }),
  ];

  const [imagePan, ...imageBands] = await imageUrlsToTextures(gl, urls);
  return promiseAllObject({
    imageBands,
    imagePan,
  });
}

function renderSubLayers(props) {
  const {
    bbox: { west, south, east, north },
    z,
  } = props.tile;
  const { data } = props;
  const pan = z >= 12;

  const modules = [combineBands];
  if (pan) {
    modules.push(pansharpenBrovey);
  }

  return new RasterLayer(props, {
    modules: modules,
    asyncModuleProps: data,
    bounds: [west, south, east, north],
  });
}
