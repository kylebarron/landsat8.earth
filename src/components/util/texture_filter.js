function getUniforms(opts = {}) {
  const {
    filter_min_r,
    filter_min_g,
    filter_min_b,
    filter_min_a,
    filter_max_r,
    filter_max_g,
    filter_max_b,
    filter_max_a,
  } = opts;

  // Occasionally `opts` is called with invalid data?
  // Checking for undefined always required?
  if (!filter_min_r) {
    return;
  }

  // Because `opts` occasionally has invalid data, apply defaults after?
  return {
    filter_min_r: filter_min_r || -1,
    filter_min_g: filter_min_g || -1,
    filter_min_b: filter_min_b || -1,
    filter_min_a: filter_min_a || -1,
    filter_max_r: filter_max_r || 1,
    filter_max_g: filter_max_g || 1,
    filter_max_b: filter_max_b || 1,
    filter_max_a: filter_max_a || 1,
  };
}

const fs = `\
uniform float filter_min_r;
uniform float filter_min_g;
uniform float filter_min_b;
uniform float filter_min_a;

uniform float filter_max_r;
uniform float filter_max_g;
uniform float filter_max_b;
uniform float filter_max_a;

// Discard values outside filter range
vec4 texture_filter(vec4 image) {
  if (image.r < filter_min_r) discard;
  if (image.g < filter_min_g) discard;
  if (image.b < filter_min_b) discard;
  if (image.a < filter_min_a) discard;

  if (image.r > filter_max_r) discard;
  if (image.g > filter_max_g) discard;
  if (image.b > filter_max_b) discard;
  if (image.a > filter_max_a) discard;
  return image;
}
`;

export default {
  name: 'texture_filter',
  fs,
  getUniforms,
  inject: {
    'fs:DECKGL_MUTATE_COLOR': `if (image.r < filter_min_r) discard;
    if (image.g < filter_min_g) discard;
    if (image.b < filter_min_b) discard;
    if (image.a < filter_min_a) discard;

    if (image.r > filter_max_r) discard;
    if (image.g > filter_max_g) discard;
    if (image.b > filter_max_b) discard;
    if (image.a > filter_max_a) discard;`,
  },
};
