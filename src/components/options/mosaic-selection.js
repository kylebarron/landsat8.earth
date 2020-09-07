import React from 'react';
import {Select} from 'semantic-ui-react';

import LANDSAT_MOSAICS from '../constants/landsat_mosaics.json';
import NAIP_MOSAICS from '../constants/naip_mosaics.json';

export default function MosaicSelection(props) {
  const {landsatMosaicId, naipMosaicId, useNaip, onChange} = props;

  return (
    <div>
      <p>
        <b>Landsat Mosaic Selection</b>
      </p>
      <Select
        value={landsatMosaicId}
        options={Object.values(LANDSAT_MOSAICS)}
        onChange={(event, object) => onChange({landsatMosaicId: object.value})}
      />

      {/* Todo: don't show unless also at a zoom where NAIP is visible */}
      {useNaip && (
        <div>
          <p>NAIP Mosaic Selection</p>
          <Select
            value={naipMosaicId}
            options={Object.values(NAIP_MOSAICS)}
            onChange={(event, object) => onChange({naipMosaicId: object.value})}
          />
        </div>
      )}
    </div>
  );
}
