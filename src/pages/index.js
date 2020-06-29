/** @jsx jsx */
import React from 'react';
import { Link } from 'gatsby';
import { Styled, jsx } from 'theme-ui';
import {
  Container,
  Accordion,
  Checkbox,
  Card,
  Grid,
  List,
  Icon,
  Header,
} from 'semantic-ui-react';

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
  getHashFromViewState,
} from '../components/util/view-state';
import '../css/semantic-ui.css';

import LANDSAT_MOSAICS from '../components/landsat_mosaics.json';
import NAIP_MOSAICS from '../components/naip_mosaics.json';

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
    // URL to Landsat Mosaic (not tile endpoint)
    landsatMosaic: DEFAULT_LANDSAT_MOSAIC_ID,
    landsatMosaicUrl: LANDSAT_MOSAICS[DEFAULT_LANDSAT_MOSAIC_ID].url,
    landsatMosaicBounds: LANDSAT_MOSAICS[DEFAULT_LANDSAT_MOSAIC_ID].bounds,
    landsatBands: [4, 3, 2],
    landsatColormapName: 'cfastie',
    landsatBandCombination: 'rgb',

    // NAIP options
    // Show NAIP imagery at zoom >= 12
    useNaip: true,
    // URL to NAIP Mosaic (not tile endpoint)
    naipMosaic: DEFAULT_NAIP_MOSAIC_ID,
    naipMosaicUrl: NAIP_MOSAICS[DEFAULT_NAIP_MOSAIC_ID].url,
  };

  onLandsatMosaicChange = landsatMosaic => {
    // TODO: just pass landsatMosaic down to the map
    const landsatMosaicUrl = LANDSAT_MOSAICS[landsatMosaic].url;
    const landsatMosaicBounds = LANDSAT_MOSAICS[landsatMosaic].bounds;
    this.setState({ landsatMosaic, landsatMosaicUrl, landsatMosaicBounds });
  };

  onNaipMosaicChange = naipMosaic => {
    // TODO: just pass naipMosaic down to the map
    const naipMosaicUrl = NAIP_MOSAICS[naipMosaic].url;
    this.setState({ naipMosaic, naipMosaicUrl });
  };

  onViewStateChange = ({ viewState }) => {
    // Set page hash based on view state
    // eslint-disable-next-line no-restricted-globals
    if (typeof history !== undefined) {
      const hash = getHashFromViewState(viewState);
      // eslint-disable-next-line no-restricted-globals
      history.replaceState(null, null, hash);
    }

    this.setState({ viewState });
  };

  render() {
    const {
      landsatBandCombination,
      landsatBands,
      landsatColormapName,
      landsatMosaic,
      landsatMosaicUrl,
      map3d,
      naipMosaic,
      naipMosaicUrl,
      useNaip,
      viewState,
    } = this.state;

    return (
      <div>
        {map3d ? (
          <Map3d
            viewState={viewState}
            onViewStateChange={this.onViewStateChange}
            useNaip={useNaip}
            naipMosaicUrl={naipMosaicUrl}
            landsatMosaicUrl={landsatMosaicUrl}
            landsatBands={landsatBands}
            landsatColormapName={landsatColormapName}
            landsatBandCombination={landsatBandCombination}
          />
        ) : (
          <Map2d
            viewState={viewState}
            onViewStateChange={this.onViewStateChange}
            useNaip={useNaip}
            naipMosaicUrl={naipMosaicUrl}
            landsatMosaicUrl={landsatMosaicUrl}
            landsatBands={landsatBands}
            landsatColormapName={landsatColormapName}
            landsatBandCombination={landsatBandCombination}
          />
        )}

        <Options
          landsatMosaic={landsatMosaic}
          naipMosaic={naipMosaic}
          onLandsatMosaicChange={this.onLandsatMosaicChange}
          onNaipMosaicChange={this.onNaipMosaicChange}
          useNaip={useNaip}
        />
      </div>
    );
  }
}

export default IndexPage;
