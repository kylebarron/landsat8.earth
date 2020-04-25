import * as React from 'react';
import { Source, Layer } from 'react-map-gl';
import { getModisUrls } from '../util';

/**
 * Render low-zoom MODIS imagery through GIBS
 * @param {object} props props
 */
export default function MODISLayer(props) {
  const { dateStr = '2018-06-01', visible = true, beforeId } = props;
  const tileUrls = getModisUrls({ dateStr });

  return (
    <Source
      id="gibs-modis"
      type="raster"
      tiles={tileUrls}
      tileSize={256}
      minzoom={0}
      minzoom={8}
      attribution="NASA EOSDIS GIBS"
    >
      <Layer
        id="gibs-modis-raster"
        type="raster"
        maxzoom={7}
        layout={{
          visibility: visible ? 'visible' : 'none',
        }}
        beforeId={beforeId}
      />
    </Source>
  );
}
