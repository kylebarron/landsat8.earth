import React from 'react';
import LANDSAT_MOSAICS from '../landsat_mosaics.json';
import NAIP_MOSAICS from '../naip_mosaics.json';
import { Select } from 'semantic-ui-react';

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
