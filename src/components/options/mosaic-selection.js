import React from 'react';
import LANDSAT_MOSAICS from '../landsat_mosaics.json';
import { Select } from 'semantic-ui-react';

export default function MosaicSelection(props) {
  const { landsatMosaic, onLandsatMosaicChange } = props;

  return (
    <div>
      <Select
        value={landsatMosaic}
        options={Object.values(LANDSAT_MOSAICS)}
        onChange={(event, object) => onLandsatMosaicChange(object.value)}
      />
    </div>
  );
}
