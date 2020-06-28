import React from 'react';
import DeckGL from '@deck.gl/react';
import { PostProcessEffect } from '@deck.gl/core';
import { TileLayer3d } from '../deck-layers/tile-layer-3d';
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
      landsatBands,
      landsatMosaicUrl,
      naipMosaicUrl,
      onViewStateChange,
      useNaip,
      viewState,
    } = this.props;

    let layers = gl && [
      TileLayer3d({
        gl,
        landsatBands,
        landsatMosaicUrl,
        modisDateStr: '2018-06-01',
        naipMosaicUrl,
        useNaip,
        tileSize: 256,
        visible: true,
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
      />
    );
  }
}
