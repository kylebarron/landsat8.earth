import { TileLayer } from '@deck.gl/geo-layers';
import {
  BandsBitmapLayer,
  PanBandsBitmapLayer,
} from '@kylebarron/deck.gl-extended-layers';
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
    getLandsatUrl({ x, y, z, bands: rgbBands[0], mosaicUrl, color_ops }),
    getLandsatUrl({ x, y, z, bands: rgbBands[1], mosaicUrl, color_ops }),
    getLandsatUrl({ x, y, z, bands: rgbBands[2], mosaicUrl, color_ops }),
  ];
  if (pan) {
    urls.push(getLandsatUrl({ x, y, z, bands: 8, mosaicUrl, color_ops }));
  }

  return imageUrlsToTextures(gl, urls);
}

function renderSubLayers(props) {
  const {
    bbox: { west, south, east, north },
    z,
  } = props.tile;
  const { data } = props;
  const pan = z >= 12;

  let image_r, image_g, image_b, image_pan;
  if (Array.isArray(data)) {
    image_r = data[0];
    image_g = data[1];
    image_b = data[2];
    if (pan) {
      image_pan = data[3];
    }
  } else if (data) {
    image_r = data.then(result => result && result[0]);
    image_g = data.then(result => result && result[1]);
    image_b = data.then(result => result && result[2]);
    if (pan) {
      image_pan = data.then(result => result && result[3]);
    }
  }

  if (pan) {
    return new PanBandsBitmapLayer(props, {
      data: null,
      image_r,
      image_g,
      image_b,
      image_pan,
      bounds: [west, south, east, north],
    });
  }

  return new BandsBitmapLayer(props, {
    data: null,
    image_r,
    image_g,
    image_b,
    bounds: [west, south, east, north],
  });
}
