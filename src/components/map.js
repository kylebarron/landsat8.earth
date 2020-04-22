import React from 'react';
import DeckGL from '@deck.gl/react';
import { StaticMap } from 'react-map-gl';

const mapStyle = require('./style.json');

const initialViewState = {
  longitude: -112.1861,
  latitude: 36.1284,
  zoom: 12.1,
  pitch: 0,
  bearing: 0,
};

export default class Map extends React.Component {
  render() {
    return (
      <DeckGL initialViewState={initialViewState} controller>
        <StaticMap mapStyle={mapStyle} mapOptions={{ hash: true }} />
      </DeckGL>
    );
  }
}
