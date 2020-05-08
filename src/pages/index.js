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
import { getViewStateFromHash } from '../components/util';

const initialViewState = {
  longitude: -112.1861,
  latitude: 36.1284,
  zoom: 11.5,
  pitch: 0,
  bearing: 0,
};

class IndexPage extends React.Component {
  state = {
    viewState: {
      ...initialViewState,
      ...getViewStateFromHash(window.location.hash),
    },
  };

  onViewStateChange = ({ viewState }) => {
    this.setState({ viewState });
  };

  render() {
    const { viewState } = this.state;
    return (
      <div>
        <Map2d
          viewState={viewState}
          onViewStateChange={this.onViewStateChange}
        />
        {/* <Map3d /> */}
      </div>
    );
  }
}

export default IndexPage;
