import * as React from 'react';
import { Source, Layer } from 'react-map-gl';

/**
 * Render low-zoom MODIS imagery through GIBS
 * @param {object} props props
 */
export function MODISLayer(props) {
  const { dateStr = '2018-06-01' } = props;

  // From https://github.com/nasa-gibs/gibs-web-examples/blob/8cd157424abd98d0b3463b457579eb0e62e1cdd2/examples/mapbox-gl/webmercator-epsg3857.js#L22-L24
  const tilePath =
    'wmts/epsg3857/best/' +
    'MODIS_Terra_CorrectedReflectance_TrueColor/default/' +
    `${dateStr}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`;

  return (
    <Source
      id="gibs-modis"
      type="raster"
      tiles={[
        'https://gibs-a.earthdata.nasa.gov/' + tilePath,
        'https://gibs-b.earthdata.nasa.gov/' + tilePath,
        'https://gibs-c.earthdata.nasa.gov/' + tilePath,
      ]}
      tileSize={256}
      minzoom={0}
      minzoom={8}
    >
      <Layer id="gibs-modis-raster" type="raster" maxzoom={7} />
    </Source>
  );
}
