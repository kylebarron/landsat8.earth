import { ImageLoader } from '@loaders.gl/images';
import { parse } from '@loaders.gl/core';
import { Texture2D } from '@luma.gl/core';
import GL from '@luma.gl/constants';

// WIP: Intended to work with 16 bit textures, but doesn't currently work
// See https://github.com/kylebarron/deck.gl-raster/issues/16
export async function bytesToTextures(
  gl,
  urls,
  { ArrayType = Uint8Array, scale = 1 }
) {
  const tileSize = scale * 256;
  const arrays = await Promise.all(
    urls.map(url => fetch(url).then(res => res.arrayBuffer()))
  );
  const textures = arrays.map(array => {
    const data = new ArrayType(array);
    return new Texture2D(gl, {
      data,
      width: tileSize,
      height: tileSize,
      // Need to change these params to work with uints
      // parameters: DEFAULT_TEXTURE_PARAMETERS,
      format: GL.RED_INTEGER,
      dataFormat: GL.R16UI,
      type: GL.UNSIGNED_SHORT,
      mipmaps: true,
    });
  });
  return textures;
}

export async function loadRgbImage(url) {
  const { image, assets } = await loadImageUrl(url);
  const imageData = {
    data: image,
    format: GL.RGB,
  };
  return { imageData, assets };
}

export async function loadSingleBandImage(url) {
  const { image, assets } = await loadImageUrl(url);
  const imageData = {
    data: image,
    // Colormaps are 10 pixels high
    // Load colormaps as RGB; all others as LUMINANCE
    format: image && image.height === 10 ? GL.RGB : GL.LUMINANCE,
  };
  return { imageData, assets };
}

async function loadImageUrl(url) {
  const res = await fetch(url);
  const assets = JSON.parse(res.headers.get('x-assets')) || [];
  return {
    assets,
    image: await parse(res.arrayBuffer(), ImageLoader),
  };
}
