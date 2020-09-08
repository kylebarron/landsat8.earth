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
      <br/>
      <br/>
      <p>
        The <i>mosaic selection</i> defines how the server should join multiple Landsat images into seamless imagery for display.
      </p>
      <p>
        This project focuses on prebuilt, low-cloud mosaics. Each seasonal mosaic is created by first selecting all images in the given region in the season, then using those with the least cloud percentage.
      </p>
      <p>
        The "Latest Available" mosaic uses the most recent images available, regardless of cloud cover, while its cloudless counterpart uses the most recent images with less than 5% cloud cover.
      </p>

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
