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
import '../../css/mapbox-gl.css';

const vibranceEffect = new PostProcessEffect(vibrance, {
  amount: 1,
});

export default class Map extends React.Component {
  state = {
    gl: null,
  };

  _onWebGLInitialized = gl => {
    this.setState({ gl });
  };

  render() {
    const { gl } = this.state;
    const {
      viewState,
      onViewStateChange,
      landsatMosaicUrl,
      landsatBands,
      naipMosaicUrl,
      useNaip,
    } = this.props;

    let layers = gl && [
      MODISTerrainTileLayer({
        visible: viewState.zoom <= 7,
      }),
      LandsatTerrainTileLayer({
        gl,
        mosaicUrl: landsatMosaicUrl,
        rgbBands: landsatBands,
        visible: viewState.zoom >= 7 && (viewState.zoom <= 12 || !useNaip),
      }),
      NAIPTerrainTileLayer({
        mosaicUrl: naipMosaicUrl,
        visible: viewState.zoom >= 12 && useNaip,
        // color_ops: ''
      }),
    ];

    // TODO: only use effects for landsat
    return (
      <DeckGL
        onWebGLInitialized={this._onWebGLInitialized}
        viewState={viewState}
        onViewStateChange={onViewStateChange}
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
