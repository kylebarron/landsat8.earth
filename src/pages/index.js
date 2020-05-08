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
import {
  getViewStateFromHash,
  DEFAULT_NAIP_MOSAIC_ID,
  DEFAULT_LANDSAT_MOSAIC_ID,
} from '../components/util';

const NAIP_MOSAICS = require('../components/naip_mosaics.json');
const LANDSAT_MOSAICS = require('../components/landsat_mosaics.json');

const initialViewState = {
  longitude: -112.1861,
  latitude: 36.1284,
  zoom: 11.5,
  pitch: 0,
  bearing: 0,
};

class IndexPage extends React.Component {
  state = {
    map2d: true,
    viewState: {
      ...initialViewState,
      ...getViewStateFromHash(window.location.hash),
    },

    // Landsat 8 options
    // URL to Landsat Mosaic (not tile endpoint)
    landsatMosaicUrl: LANDSAT_MOSAICS[DEFAULT_LANDSAT_MOSAIC_ID].url,
    landsatMosaicBounds: LANDSAT_MOSAICS[DEFAULT_LANDSAT_MOSAIC_ID].bounds,
    landsatBands: [4, 3, 2],

    // NAIP options
    // Show NAIP imagery at zoom >= 12
    useNaip: true,
    // URL to NAIP Mosaic (not tile endpoint)
    naipMosaicUrl: NAIP_MOSAICS[DEFAULT_NAIP_MOSAIC_ID].url,
  };

  onViewStateChange = ({ viewState }) => {
    this.setState({ viewState });
  };

  render() {
    const {
      landsatBands,
      landsatMosaicUrl,
      map2d,
      naipMosaicUrl,
      useNaip,
      viewState,
    } = this.state;
    return (
      <div>
        {map2d ? (
          <Map2d
            viewState={viewState}
            onViewStateChange={this.onViewStateChange}
            useNaip={useNaip}
            naipMosaicUrl={naipMosaicUrl}
            landsatMosaicUrl={landsatMosaicUrl}
            landsatBands={landsatBands}
          />
        ) : (
          <Map3d
            viewState={viewState}
            onViewStateChange={this.onViewStateChange}
            useNaip={useNaip}
            naipMosaicUrl={naipMosaicUrl}
            landsatMosaicUrl={landsatMosaicUrl}
            landsatBands={landsatBands}
          />
        )}
      </div>
    );
  }
}

export default IndexPage;
