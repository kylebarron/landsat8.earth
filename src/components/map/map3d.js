import React from 'react';
import DeckGL from '@deck.gl/react';
import {PostProcessEffect} from '@deck.gl/core';
import {vibrance} from '@luma.gl/shadertools';

import {TileLayer3d} from '../deck-layers/tile-layer-3d';

const vibranceEffect = new PostProcessEffect(vibrance, {
  amount: 1,
});

export default class Map extends React.Component {
  state = {
    zRange: null,
  };

  // Update zRange of viewport so that correct tiles are requested
  onViewportLoad = (data) => {
    if (!data || data.length === 0 || data.every((x) => !x)) {
      return;
    }

    const {zRange} = this.state;
    const ranges = data.filter(Boolean).map((arr) => {
      const bounds = arr[1].header.boundingBox;
      return bounds.map((bound) => bound[2]);
    });
    const minZ = Math.min(...ranges.map((x) => x[0]));
    const maxZ = Math.max(...ranges.map((x) => x[1]));

    if (!zRange || minZ < zRange[0] || maxZ > zRange[1]) {
      this.setState({zRange: [minZ, maxZ]});
    }
  };

  render() {
    const {zRange} = this.state;
    const {onViewStateChange, viewState} = this.props;

    let layers = TileLayer3d({
      modisDateStr: '2018-06-01',
      tileSize: 256,
      zRange,
      onViewportLoad: this.onViewportLoad,
      ...this.props,
    });

    // TODO: only use effects for landsat
    return (
      <DeckGL
        style={{
          backgroundColor: 'rgb(0, 0, 0)',
        }}
        viewState={viewState}
        onViewStateChange={onViewStateChange}
        controller
        layers={layers}
        effects={[vibranceEffect]}
        // Tell browser to use discrete GPU if available
        glOptions={{powerPreference: 'high-performance'}}
      />
    );
  }
}
