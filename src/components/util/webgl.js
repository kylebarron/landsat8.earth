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

export async function loadRgbImage(url, {signal}) {
  const { image, assets } = await loadImageUrl(url, {signal}) || {};
  if (!image) {
    return null;
  }

  const imageData = {
    data: image,
    format: GL.RGB,
  };
  return { imageData, assets };
}

export async function loadSingleBandImage(url, {signal}) {
  const { image, assets } = await loadImageUrl(url, { signal }) || {};
  if (!image) {
    return null;
  }

  const imageData = {
    data: image,
    // Colormaps are 10 pixels high
    // Load colormaps as RGB; all others as LUMINANCE
    format: image && image.height === 10 ? GL.RGB : GL.LUMINANCE,
  };
  // return { imageData, assets };
  return imageData;
}

async function loadImageUrl(url, {signal}) {
  let res;
  try {
    res = await fetch(url, { signal });
  } catch (error) {
    console.warn(error);
    return null;
  }

  if (!res) {
    console.warn('image not loaded');
    return null;
  }

  const assets = JSON.parse(res.headers.get('x-assets')) || [];
  return {
    assets,
    image: await parse(res.arrayBuffer(), ImageLoader),
  };
}
