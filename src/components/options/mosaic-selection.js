import React from 'react';
import { Select } from 'semantic-ui-react';

import LANDSAT_MOSAICS from '../constants/landsat_mosaics.json';
import NAIP_MOSAICS from '../constants/naip_mosaics.json';

export default function MosaicSelection(props) {
  const { landsatMosaic, naipMosaic, useNaip, onChange } = props;

  return (
    <div>
      <p>Landsat Mosaic Selection</p>
      <Select
        value={landsatMosaic}
        options={Object.values(LANDSAT_MOSAICS)}
        onChange={(event, object) =>
          onChange({ landsatMosaicId: object.value })
        }
      />

      {/* Todo: don't show unless also at a zoom where NAIP is visible */}
      {useNaip && (
        <div>
          <p>NAIP Mosaic Selection</p>
          <Select
            value={naipMosaic}
            options={Object.values(NAIP_MOSAICS)}
            onChange={(event, object) =>
              onChange({ naipMosaicId: object.value })
            }
          />
        </div>
      )}
    </div>
  );
}
