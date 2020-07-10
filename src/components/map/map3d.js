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
    zRange: null,
  };

  _onWebGLInitialized = gl => {
    this.setState({ gl });
  };

  // Update zRange of viewport
  onViewportLoad = data => {
    if (!data || data.length === 0 || data.every(x => !x)) {
      return;
    }

    const { zRange } = this.state;
    const ranges = data.filter(Boolean).map(arr => {
      const bounds = arr[1].header.boundingBox;
      return bounds.map(bound => bound[2]);
    });
    const minZ = Math.min(...ranges.map(x => x[0]));
    const maxZ = Math.max(...ranges.map(x => x[1]));

    if (!zRange || minZ < zRange[0] || maxZ > zRange[1]) {
      this.setState({ zRange: [minZ, maxZ] });
    }
  };

  render() {
    const { gl, zRange } = this.state;
    const {
      landsatBands,
      landsatMosaicId,
      naipMosaicId,
      onViewStateChange,
      onDragEnd,
      useNaip,
      viewState,
    } = this.props;

    let layers = gl && [
      TileLayer3d({
        gl,
        landsatBands,
        landsatMosaicId,
        modisDateStr: '2018-06-01',
        naipMosaicId,
        useNaip,
        tileSize: 256,
        zRange,
        onViewportLoad: this.onViewportLoad,
      }),
    ];

    // TODO: only use effects for landsat
    return (
      <DeckGL
        onWebGLInitialized={this._onWebGLInitialized}
        viewState={viewState}
        onViewStateChange={onViewStateChange}
        onDragEnd={onDragEnd}
        controller
        layers={layers}
        effects={[vibranceEffect]}
      />
    );
  }
}
