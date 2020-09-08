import React from 'react';

import {Map2d, Map3d} from '../components/map/index';
import SEO from '../components/seo';
import Options from '../components/options';
import AttributionDiv from '../components/attribution';
import {
  DEFAULT_NAIP_MOSAIC_ID,
  DEFAULT_LANDSAT_MOSAIC_ID,
} from '../components/util/url';
import {
  getViewStateFromHash,
  setHashFromViewState,
  setQueryParams,
  getQueryParams,
} from '../components/util/view-state';
import '../css/semantic-ui.css';

const initialViewState = {
  longitude: -112.1861,
  latitude: 36.1284,
  zoom: 11.5,
  pitch: 0,
  bearing: 0,
  maxPitch: 85,
};

class IndexPage extends React.Component {
  state = {
    map3d: false,
    viewState: {
      ...initialViewState,
      ...getViewStateFromHash(
        typeof window !== 'undefined' ? window.location.hash : ''
      ),
    },

    // Landsat 8 options
    landsatMosaicId: DEFAULT_LANDSAT_MOSAIC_ID,
    landsatBandPreset: 'True Color',
    landsatBands: [4, 3, 2],
    landsatColormapName: 'cfastie',
    landsatBandCombination: 'rgb',

    // NAIP options
    // Show NAIP imagery at zoom >= 12
    useNaip: false,
    naipMosaicId: DEFAULT_NAIP_MOSAIC_ID,

    // Overwrite state values with querystring parameters if they exist
    ...getQueryParams(),
  };

  onViewStateChange = ({viewState}) => {
    setHashFromViewState(viewState);
    this.setState({viewState});
  };

  render() {
    const {
      landsatBandCombination,
      landsatBandPreset,
      landsatBands,
      landsatColormapName,
      landsatMosaicId,
      map3d,
      naipMosaicId,
      useNaip,
      viewState,
    } = this.state;
    const {zoom} = viewState;

    return (
      <div>
        <SEO title="Landsat8.earth" />

        {map3d ? (
          <Map3d
            landsatBandCombination={landsatBandCombination}
            landsatBands={landsatBands}
            landsatColormapName={landsatColormapName}
            landsatMosaicId={landsatMosaicId}
            naipMosaicId={naipMosaicId}
            onViewStateChange={this.onViewStateChange}
            useNaip={useNaip}
            viewState={viewState}
          />
        ) : (
          <Map2d
            landsatBandCombination={landsatBandCombination}
            landsatBands={landsatBands}
            landsatColormapName={landsatColormapName}
            landsatMosaicId={landsatMosaicId}
            naipMosaicId={naipMosaicId}
            onViewStateChange={this.onViewStateChange}
            useNaip={useNaip}
            viewState={viewState}
          />
        )}

        <Options
          landsatBandCombination={landsatBandCombination}
          landsatBandPreset={landsatBandPreset}
          landsatBands={landsatBands}
          landsatColormapName={landsatColormapName}
          landsatMosaicId={landsatMosaicId}
          map3d={map3d}
          naipMosaicId={naipMosaicId}
          onChange={(value) => {
            this.setState(value);
            setQueryParams(value);
          }}
          useNaip={useNaip}
          viewState={viewState}
        />
        <AttributionDiv
          showLandsat={zoom >= 6.5}
          showNaip={useNaip && zoom >= 12}
          showModis={zoom < 6.5}
        />
      </div>
    );
  }
}

export default IndexPage;
