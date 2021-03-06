import React from 'react';
import DeckGL from '@deck.gl/react';
import {MapboxLayer} from '@deck.gl/mapbox';
import {StaticMap} from 'react-map-gl';

import {TileLayer2d} from '../deck-layers/tile-layer-2d';

import mapStyle from './style.json';
import '../../css/mapbox-gl.css';

export default class Map extends React.Component {
  state = {
    gl: null,
  };

  // DeckGL and mapbox will both draw into this WebGL context
  _onWebGLInitialized = (gl) => {
    this.setState({gl});
  };

  _onMapLoad = () => {
    const map = this._map;
    const deck = this._deck;

    // This id has to match the id of the Deck layer
    map.addLayer(new MapboxLayer({id: 'tile-layer-2d', deck}), 'aeroway_fill');
  };

  render() {
    const {gl} = this.state;
    const {onViewStateChange, viewState} = this.props;

    const layers = new TileLayer2d({
      id: 'tile-layer-2d',
      modisDateStr: '2018-06-01',
      tileSize: 256,
      ...this.props,
    });

    return (
      <DeckGL
        ref={(ref) => {
          this._deck = ref && ref.deck;
        }}
        layers={layers}
        viewState={viewState}
        onViewStateChange={onViewStateChange}
        controller
        onWebGLInitialized={this._onWebGLInitialized}
        glOptions={{
          // For correct Mapbox rendering of polygons
          stencil: true,
          // Tell browser to use discrete GPU if available
          powerPreference: 'high-performance',
        }}
      >
        {gl && (
          <StaticMap
            ref={(ref) => {
              this._map = ref && ref.getMap();
            }}
            gl={gl}
            onLoad={this._onMapLoad}
            mapStyle={mapStyle}
          />
        )}
      </DeckGL>
    );
  }
}
