/* eslint-disable max-statements */
import React from 'react';
import DeckGL from '@deck.gl/react';
import { PostProcessEffect } from '@deck.gl/core';
import { StaticMap } from 'react-map-gl';
import {
  LandsatTerrainTileLayer,
  NAIPTerrainTileLayer,
  MODISTerrainTileLayer,
} from '../deck-layers';
import { vibrance } from '@luma.gl/shadertools';
import { getViewStateFromHash } from '../util';
import '../../css/mapbox-gl.css';

const INITIAL_VIEW_STATE = {
  latitude: 46.21,
  longitude: -122.18,
  zoom: 12.5,
  bearing: 140,
  pitch: 60,
};

const vibranceEffect = new PostProcessEffect(vibrance, {
  amount: 1,
});

export default class Map extends React.Component {
  state = {
    gl: null,
    viewState: {
      ...INITIAL_VIEW_STATE,
      ...getViewStateFromHash(window.location.hash)
    },
    useNaip: false,
  };

  _onWebGLInitialized = gl => {
    this.setState({ gl });
  };

  onViewStateChange = ({ viewState }) => {
    this.setState({ viewState });
  };

  render() {
    const { gl, viewState, useNaip } = this.state;

    let layers = gl && [
      MODISTerrainTileLayer({
        visible: viewState.zoom <= 7,
      }),
      LandsatTerrainTileLayer({
        gl,
        visible: viewState.zoom >= 7 && (viewState.zoom <= 12 || !useNaip),
      }),
      NAIPTerrainTileLayer({
        visible: viewState.zoom >= 12 && useNaip,
      }),
    ];

    // TODO: only use effects for landsat
    return (
      <DeckGL
        onWebGLInitialized={this._onWebGLInitialized}
        viewState={viewState}
        onViewStateChange={this.onViewStateChange}
        controller
        layers={layers}
        effects={[vibranceEffect]}
      >
        <StaticMap
          mapStyle="https://raw.githubusercontent.com/kylebarron/fiord-color-gl-style/master/style.json"
          mapOptions={{ hash: true }}
        />
      </DeckGL>
    );
  }
}
