import React from 'react';
import { Link } from 'gatsby';

import { Map2d, Map3d } from '../components/map/index';
import Layout from '../components/layout';
import Image from '../components/image';
import SEO from '../components/seo';
import Options from '../components/options';
import {
  DEFAULT_NAIP_MOSAIC_ID,
  DEFAULT_LANDSAT_MOSAIC_ID,
} from '../components/util/url';
import {
  getViewStateFromHash,
  setHashFromViewState,
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
    landsatBands: [4, 3, 2],
    landsatColormapName: 'cfastie',
    landsatBandCombination: 'rgb',

    // NAIP options
    // Show NAIP imagery at zoom >= 12
    useNaip: true,
    naipMosaicId: DEFAULT_NAIP_MOSAIC_ID,
  };

  // TODO: consolidate into one helper function to set a key's state
  onLandsatBandsChange = landsatBands => {
    this.setState({ landsatBands });
  };

  onLandsatMosaicChange = landsatMosaicId => {
    this.setState({ landsatMosaicId });
  };

  onNaipMosaicChange = naipMosaicId => {
    this.setState({ naipMosaicId });
  };

  onViewStateChange = ({ viewState, interactionState }) => {
    const { isDragging } = interactionState;
    // Set page hash based on view state
    // Only update page hash when dragging finished for performance
    if (!isDragging) {
      setHashFromViewState(viewState);
    }
    this.setState({ viewState });
  };

  onDragEnd = () => {
    const { viewState } = this.state;
    setHashFromViewState(viewState);
  };

  render() {
    const {
      landsatBandCombination,
      landsatBands,
      landsatColormapName,
      landsatMosaicId,
      map3d,
      naipMosaicId,
      useNaip,
      viewState,
    } = this.state;

    return (
      <div>
        {map3d ? (
          <Map3d
            viewState={viewState}
            onViewStateChange={this.onViewStateChange}
            onDragEnd={this.onDragEnd}
            useNaip={useNaip}
            naipMosaicId={naipMosaicId}
            landsatMosaicId={landsatMosaicId}
            landsatBands={landsatBands}
            landsatColormapName={landsatColormapName}
            landsatBandCombination={landsatBandCombination}
          />
        ) : (
          <Map2d
            viewState={viewState}
            onViewStateChange={this.onViewStateChange}
            onDragEnd={this.onDragEnd}
            useNaip={useNaip}
            landsatMosaicId={landsatMosaicId}
            naipMosaicId={naipMosaicId}
            landsatBands={landsatBands}
            landsatColormapName={landsatColormapName}
            landsatBandCombination={landsatBandCombination}
          />
        )}

        <Options
          landsatBands={landsatBands}
          onLandsatBandsChange={this.onLandsatBandsChange}
          landsatMosaicId={landsatMosaicId}
          naipMosaicId={naipMosaicId}
          onLandsatMosaicChange={this.onLandsatMosaicChange}
          onNaipMosaicChange={this.onNaipMosaicChange}
          useNaip={useNaip}
        />
      </div>
    );
  }
}

export default IndexPage;
