import React from 'react';
import DeckGL from '@deck.gl/react';
import { MapboxLayer } from '@deck.gl/mapbox';
import { PostProcessEffect } from '@deck.gl/core';
import { StaticMap } from 'react-map-gl';
import { NAIPLayer, MODISLayer } from '../mapbox-layers';
import { LandsatTileLayer } from '../deck-layers';
import { vibrance } from '@luma.gl/shadertools';
import {
  getNaipUrl,
  getViewStateFromHash,
  DEFAULT_LANDSAT_MOSAIC_ID,
  DEFAULT_NAIP_MOSAIC_ID,
} from '../util';
import '../../css/mapbox-gl.css';

const mapStyle = require('./style.json');
const prebuiltLandsatMosaics = require('../landsat_mosaics.json');
const NAIPMosaics = require('../naip_mosaics.json');

const initialViewState = {
  longitude: -112.1861,
  latitude: 36.1284,
  zoom: 11.5,
  pitch: 0,
  bearing: 0,
};

const vibranceEffect = new PostProcessEffect(vibrance, {
  amount: 1,
});

export default class Map extends React.Component {
  state = {
    gl: null,
    viewState: {
      ...initialViewState,
      ...getViewStateFromHash(window.location.hash),
    },
    // URL to Landsat Mosaic (not tile endpoint)
    landsatMosaicUrl: prebuiltLandsatMosaics[DEFAULT_LANDSAT_MOSAIC_ID].url,
    landsatMosaicBounds:
      prebuiltLandsatMosaics[DEFAULT_LANDSAT_MOSAIC_ID].bounds,

    // URL to NAIP Mosaic (not tile endpoint)
    naipMosaicUrl: NAIPMosaics[DEFAULT_NAIP_MOSAIC_ID].url,

    // Show NAIP imagery at zoom >= 12
    useNaip: true,
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

  onViewStateChange = ({ viewState }) => {
    this.setState({ viewState });
  };

  render() {
    const {
      gl,
      naipMosaicUrl,
      viewState,
      useNaip,
      landsatMosaicUrl,
    } = this.state;

    const layers = [
      new LandsatTileLayer({
        id: 'landsat-tile-layer',
        gl,
        mosaicUrl: landsatMosaicUrl,
        rgbBands: [4, 3, 2],
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
        onViewStateChange={this.onViewStateChange}
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
