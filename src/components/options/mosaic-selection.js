import React from 'react';
import { Select } from 'semantic-ui-react';

import LANDSAT_MOSAICS from '../constants/landsat_mosaics.json';
import NAIP_MOSAICS from '../constants/naip_mosaics.json';

export default function MosaicSelection(props) {
  const {
    landsatMosaic,
    onLandsatMosaicChange,
    onNaipMosaicChange,
    naipMosaic,
    useNaip,
  } = props;

  return (
    <div>
      <p>Landsat Mosaic Selection</p>
      <Select
        value={landsatMosaic}
        options={Object.values(LANDSAT_MOSAICS)}
        onChange={(event, object) => onLandsatMosaicChange(object.value)}
      />

      {/* Todo: don't show unless also at a zoom where NAIP is visible */}
      {useNaip && (
        <div>
          <p>NAIP Mosaic Selection</p>
          <Select
            value={naipMosaic}
            options={Object.values(NAIP_MOSAICS)}
            onChange={(event, object) => onNaipMosaicChange(object.value)}
          />
        </div>
      )}
    </div>
  );
}
