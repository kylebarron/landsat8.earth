/* eslint-disable max-statements */
import React from 'react';
import DeckGL from '@deck.gl/react';
import { PostProcessEffect } from '@deck.gl/core';
import { StaticMap } from 'react-map-gl';
import {LandsatTerrainTileLayer, NAIPTerrainTileLayer, MODISTerrainTileLayer} from "../deck-layers";
import { vibrance } from '@luma.gl/shadertools';
import '../../css/mapbox-gl.css';

const INITIAL_VIEW_STATE = {
  latitude: 46.21,
  longitude: -122.18,
  zoom: 11.5,
  bearing: 140,
  pitch: 60
};

const vibranceEffect = new PostProcessEffect(vibrance, {
  amount: 1,
});

export default class Map extends React.Component {
  state = {
    gl: null,
  };

  _initializeWebGL = (gl) => {
    this.setState({gl})
  }

  render() {
    const {gl} = this.state;
    let layers = gl && [
      MODISTerrainTileLayer(),
      LandsatTerrainTileLayer({ gl }),
      NAIPTerrainTileLayer(),
    ];

    // TODO: only use effects for landsat
    
    return (
      <DeckGL
        onWebGLInitialized={this._initializeWebGL}
        initialViewState={INITIAL_VIEW_STATE}
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
