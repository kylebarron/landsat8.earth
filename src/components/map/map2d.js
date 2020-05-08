import React from 'react';
import DeckGL from '@deck.gl/react';
import { MapboxLayer } from '@deck.gl/mapbox';
import { PostProcessEffect } from '@deck.gl/core';
import { StaticMap } from 'react-map-gl';
import { NAIPLayer, MODISLayer } from '../mapbox-layers';
import { LandsatTileLayer } from '../deck-layers';
import { vibrance } from '@luma.gl/shadertools';
import { getNaipUrl } from '../util';
import '../../css/mapbox-gl.css';

const mapStyle = require('./style.json');

const vibranceEffect = new PostProcessEffect(vibrance, {
  amount: 1,
});

export default class Map extends React.Component {
  state = {
    gl: null,
  };

  // DeckGL and mapbox will both draw into this WebGL context
  _onWebGLInitialized = gl => {
    this.setState({ gl });
  };

  _onMapLoad = () => {
    const map = this._map;
    const deck = this._deck;

    // This id has to match the id of the Deck layer
    map.addLayer(
      new MapboxLayer({ id: 'landsat-tile-layer', deck }),
      'aeroway_fill'
    );
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

    const layers = [
      new LandsatTileLayer({
        id: 'landsat-tile-layer',
        gl,
        mosaicUrl: landsatMosaicUrl,
        rgbBands: landsatBands,
        visible: viewState.zoom >= 7 && (viewState.zoom <= 12 || !useNaip),
      }),
    ];

    return (
      <DeckGL
        ref={ref => {
          this._deck = ref && ref.deck;
        }}
        layers={layers}
        viewState={viewState}
        onViewStateChange={onViewStateChange}
        controller
        onWebGLInitialized={this._onWebGLInitialized}
        glOptions={{ stencil: true }}
      >
        {gl && (
          <StaticMap
            ref={ref => {
              this._map = ref && ref.getMap();
            }}
            gl={gl}
            onLoad={this._onMapLoad}
            mapStyle={mapStyle}
            mapOptions={{ hash: true }}
          >
            <MODISLayer
              dateStr="2018-06-01"
              visible={true}
              beforeId="aeroway_fill"
            />
            <NAIPLayer
              tileUrl={getNaipUrl({ mosaicUrl: naipMosaicUrl })}
              visible={useNaip}
              beforeId="aeroway_fill"
            />
          </StaticMap>
        )}
      </DeckGL>
    );
  }
}
