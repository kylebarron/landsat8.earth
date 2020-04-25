import * as React from 'react';
import { Source, Layer } from 'react-map-gl';

/**
 * Render high-zoom NAIP imagery as a Mapbox layer
 * @param {object} props props
 */
export default function NAIPLayer(props) {
  const { tileUrl, visible = true } = props;

  return (
    <Source
      id="naip"
      type="raster"
      tiles={[tileUrl]}
      tileSize={512}
      minzoom={12}
      minzoom={16}
      attribution="USDA FSA"
    >
      <Layer
        id="naip-raster"
        type="raster"
        layout={{
          visibility: visible ? 'visible' : 'none',
        }}
      />
    </Source>
  );
}
