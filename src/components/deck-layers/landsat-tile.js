import { TileLayer } from '@deck.gl/geo-layers';
import {
  RasterLayer,
  combineBands,
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
    maxZoom = 13,
    id = 'landsat-tile-layer',
    mosaicUrl,
    color_ops,
    rgbBands,
    visible = true,
    tileSize = 256,
  } = props || {};

  return new TileLayer({
    id,
    minZoom,
    maxZoom,
    tileSize,
    getTileData: args =>
      getTileData(
        Object.assign(args, {
          gl,
          mosaicUrl,
          color_ops,
          rgbBands,
          tileSize,
        })
      ),
    renderSubLayers,
    visible,
  });
}

async function getTileData(options) {
  const { gl, x, y, z, mosaicUrl, color_ops, rgbBands = [4, 3, 2], tileSize } =
    options || {};

  const modules = [combineBands];
  let imagePan;
  if (z >= 12) {
    const panUrl = getLandsatUrl({
      x,
      y,
      z,
      bands: 8,
      mosaicUrl,
      color_ops,
      tileSize,
    });
    // TODO: need to await all images together
    imagePan = await imageUrlsToTextures(gl, panUrl);
    modules.push(pansharpenBrovey);
  }

  // Load landsat urls
  const urls = [
    getLandsatUrl({
      x,
      y,
      z,
      bands: rgbBands[0],
      mosaicUrl,
      color_ops,
      tileSize,
    }),
    getLandsatUrl({
      x,
      y,
      z,
      bands: rgbBands[1],
      mosaicUrl,
      color_ops,
      tileSize,
    }),
    getLandsatUrl({
      x,
      y,
      z,
      bands: rgbBands[2],
      mosaicUrl,
      color_ops,
      tileSize,
    }),
  ];

  const imageBands = await imageUrlsToTextures(gl, urls);
  return { imageBands, imagePan, modules };
}

function renderSubLayers(props) {
  const {
    bbox: { west, south, east, north },
  } = props.tile;
  const { modules, ...moduleProps } = props.data;

  return new RasterLayer(props, {
    modules,
    moduleProps,
    bounds: [west, south, east, north],
  });
}
