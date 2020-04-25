import * as React from 'react';
import { Source, Layer } from 'react-map-gl';

/**
 * Render high-zoom NAIP imagery as a Mapbox layer
 * @param {object} props props
 */
export function NAIPLayer(props) {
  const { tileUrl } = props;

  return (
    <Source
      id="naip"
      type="raster"
      tiles={[tileUrl]}
      tileSize={512}
      minzoom={12}
      minzoom={16}
    >
      <Layer id="naip-raster" type="raster" />
    </Source>
  );
}
