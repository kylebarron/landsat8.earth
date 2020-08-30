import React from 'react';
import DeckGL from '@deck.gl/react';
import { MapboxLayer } from '@deck.gl/mapbox';
import { StaticMap } from 'react-map-gl';

import { TileLayer2d } from '../deck-layers/tile-layer-2d';
import { TileLayer3d } from '../deck-layers/tile-layer-3d';

import {Map} from 'immutable';
import mapStyle from './style.json';
import mapStyle3d from './style3d.json';
import '../../css/mapbox-gl.css';

export default class MapClass extends React.Component {
  state = {
    gl: null,
    zRange: null,
  };

  // DeckGL and mapbox will both draw into this WebGL context
  _onWebGLInitialized = gl => {
    this.setState({ gl });
  };

  _onMapLoad = () => {
    const map = this._map;
    const deck = this._deck;
    window.map = map

    // Private Mapbox GL JS API; can't set `map.setMaxPitch` because 60 is the
    // public API's maximum
    map.transform.maxPitch = 75;
    map._update();
    
    // This id has to match the id of the Deck layer
    map.addLayer(
      new MapboxLayer({
        id: 'tile-layer-2d',
        deck,
      }),
      'aeroway_fill'
    );
    map.addLayer(
      new MapboxLayer({
        id: 'tile-layer-3d',
        deck,
      }),
      'aeroway_fill'
    );
  };

  // Update zRange of viewport so that correct tiles are requested
  onViewportLoad = data => {
    const { map3d } = this.props;
    if (!map3d || !data || data.length === 0 || data.every(x => !x)) {
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
    const { onViewStateChange, onDragEnd, viewState, map3d } = this.props;

    let layers;
    if (map3d) {
      layers = TileLayer3d({
        id: 'tile-layer-3d',
        modisDateStr: '2018-06-01',
        tileSize: 256,
        zRange,
        onViewportLoad: this.onViewportLoad,
        ...this.props,
      });
    } else {
      layers = TileLayer2d({
        id: 'tile-layer-2d',
        modisDateStr: '2018-06-01',
        tileSize: 256,
        ...this.props,
      });
    }

    return (
      <DeckGL
        ref={ref => {
          this._deck = ref && ref.deck;
        }}
        layers={layers}
        viewState={viewState}
        onViewStateChange={onViewStateChange}
        onDragEnd={onDragEnd}
        controller
        onWebGLInitialized={this._onWebGLInitialized}
        // effects={[vibranceEffect]}
        glOptions={{
          // For correct Mapbox rendering of polygons
          stencil: true,
          // Tell browser to use discrete GPU if available
          powerPreference: 'high-performance',
        }}
      >
        {gl && (
          <StaticMap
            ref={ref => {
              this._map = ref && ref.getMap();
            }}
            gl={gl}
            onLoad={this._onMapLoad}
            mapStyle={map3d ? mapStyle3d : mapStyle}
          />
        )}
      </DeckGL>
    );
  }
}
