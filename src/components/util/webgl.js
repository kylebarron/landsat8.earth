import { loadImageArray } from '@loaders.gl/images';
import { Texture2D } from '@luma.gl/core';
import GL from '@luma.gl/constants';

const DEFAULT_TEXTURE_PARAMETERS = {
  [GL.TEXTURE_MIN_FILTER]: GL.LINEAR_MIPMAP_LINEAR,
  [GL.TEXTURE_MAG_FILTER]: GL.LINEAR,
  [GL.TEXTURE_WRAP_S]: GL.CLAMP_TO_EDGE,
  [GL.TEXTURE_WRAP_T]: GL.CLAMP_TO_EDGE,
};

export async function bytesToTextures(gl, urls, ArrayType = Uint8Array) {
  const arrays = await Promise.all(
    urls.map(url => fetch(url).then(res => res.arrayBuffer()))
  );
  return (textures = arrays.map(array => {
    return new Texture2D(gl, {
      data: new ArrayType(array),
      width: 512,
      height: 512,
      parameters: DEFAULT_TEXTURE_PARAMETERS,
      format: GL.LUMINANCE,
      mipmaps: true,
    });
  }));
}

export async function imageUrlsToTextures(gl, urls) {
  const imageOptions = { image: { type: 'imagebitmap' } };
  const images = await loadImageArray(
    urls.length,
    ({ index }) => urls[index],
    imageOptions
  );

  return (textures = images.map(image => {
    return new Texture2D(gl, {
      data: image,
      parameters: DEFAULT_TEXTURE_PARAMETERS,
      format: GL.LUMINANCE,
    });
  }));
}
