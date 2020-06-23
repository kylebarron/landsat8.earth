import { ImageLoader } from '@loaders.gl/images';
import { parse } from '@loaders.gl/core';
import { Texture2D } from '@luma.gl/core';
import GL from '@luma.gl/constants';

const DEFAULT_TEXTURE_PARAMETERS = {
  [GL.TEXTURE_MIN_FILTER]: GL.LINEAR_MIPMAP_LINEAR,
  [GL.TEXTURE_MAG_FILTER]: GL.LINEAR,
  [GL.TEXTURE_WRAP_S]: GL.CLAMP_TO_EDGE,
  [GL.TEXTURE_WRAP_T]: GL.CLAMP_TO_EDGE,
};

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

export async function imageUrlsToTextures(gl, urls) {
  // Single image, not array
  if (!Array.isArray(urls)) {
    const { image } = await loadImageUrl(urls);
    return new Texture2D(gl, {
      data: image,
      parameters: DEFAULT_TEXTURE_PARAMETERS,
      format: GL.LUMINANCE,
    });
  }

  const outputs = await Promise.all(urls.map(url => loadImageUrl(url)));
  const assets = new Set(...outputs.map(({ header }) => header));
  const textures = outputs.map(({ image }) => {
    return new Texture2D(gl, {
      data: image,
      parameters: DEFAULT_TEXTURE_PARAMETERS,
      format: GL.LUMINANCE,
    });
  });
  return textures;
}

async function loadImageUrl(url) {
  const res = await fetch(url);
  const header = JSON.parse(res.headers.get('x-assets') || '[]');
  return {
    header,
    image: await parse(res.arrayBuffer(), ImageLoader),
  };
}
