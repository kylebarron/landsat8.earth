import React from 'react';
import { Link } from 'gatsby';

import { Map2d, Map3d } from '../components/map/index';
import Layout from '../components/layout';
import Image from '../components/image';
import SEO from '../components/seo';
import Options from '../components/options';
import {
  DEFAULT_NAIP_MOSAIC_ID,
  DEFAULT_LANDSAT_MOSAIC_ID,
} from '../components/util/url';
import {
  getViewStateFromHash,
  setHashFromViewState,
  setQueryParams,
  getQueryParams,
} from '../components/util/view-state';
import { simpleLandsatParser } from '../components/util/landsat';

import dayjs from 'dayjs';
import minMax from 'dayjs/plugin/minMax';

import '../css/semantic-ui.css';

dayjs.extend(minMax);

const initialViewState = {
  longitude: -112.1861,
  latitude: 36.1284,
  zoom: 11.5,
  pitch: 0,
  bearing: 0,
  maxPitch: 85,
};

class IndexPage extends React.Component {
  state = {
    map3d: false,
    viewState: {
      ...initialViewState,
      ...getViewStateFromHash(
        typeof window !== 'undefined' ? window.location.hash : ''
      ),
    },

    // Landsat 8 options
    landsatMosaicId: DEFAULT_LANDSAT_MOSAIC_ID,
    landsatBandPreset: 'True Color',
    landsatBands: [4, 3, 2],
    landsatColormapName: 'cfastie',
    landsatBandCombination: 'rgb',
    _landsatMinAssetDate: null,
    _landsatMaxAssetDate: null,

    // NAIP options
    // Show NAIP imagery at zoom >= 12
    useNaip: false,
    naipMosaicId: DEFAULT_NAIP_MOSAIC_ID,

    // Overwrite state values with querystring parameters if they exist
    ...getQueryParams(),
  };

  onViewStateChange = ({ viewState, interactionState }) => {
    const { isDragging } = interactionState;
    // Set page hash based on view state
    // Only update page hash when dragging finished for performance
    if (!isDragging) {
      setHashFromViewState(viewState);
    }
    this.setState({ viewState });
  };

  onDragEnd = () => {
    const { viewState } = this.state;
    setHashFromViewState(viewState);
  };

  onTileLoad = tile => {
    if (!tile) {
      return;
    }

    const { landsatAssetIds } = tile.content;

    if (!landsatAssetIds || landsatAssetIds.length === 0) {
      return;
    }

    const uniqueIds = [...new Set(landsatAssetIds.flat())];
    const parsedIds = uniqueIds.map(sceneid => simpleLandsatParser(sceneid));

    // console.log(parsedIds);

    const minDate = dayjs.min(
      ...parsedIds.map(({ acquisitionDate }) => acquisitionDate)
    );
    const maxDate = dayjs.max(
      ...parsedIds.map(({ acquisitionDate }) => acquisitionDate)
    );

    // this.setState({
    //   _landsatMinAssetDate: dayjs.min(minDate, this.state._landsatMinAssetDate),
    //   _landsatMaxAssetDate: dayjs.max(maxDate, this.state._landsatMaxAssetDate),
    // });

    this.setState(prevState => {
      const { _landsatMinAssetDate, _landsatMaxAssetDate } = prevState;
      if (!_landsatMinAssetDate || !_landsatMaxAssetDate) {
        return;
      }
      return {
        _landsatMinAssetDate: dayjs.min(
          minDate,
          prevState._landsatMinAssetDate
        ),
        _landsatMaxAssetDate: dayjs.max(
          maxDate,
          prevState._landsatMaxAssetDate
        ),
      };
    });
  };

  onViewportLoad = tileData => {
    if (!tileData) {
      return;
    }

    const landsatAssetIds = tileData
      .map(({ landsatAssetIds }) => landsatAssetIds)
      .flat(2);
    const uniqueIds = [...new Set(landsatAssetIds)];
    const parsedIds = uniqueIds.map(sceneid => simpleLandsatParser(sceneid));

    const minDate = dayjs.min(
      ...parsedIds.map(({ acquisitionDate }) => acquisitionDate)
    );
    const maxDate = dayjs.max(
      ...parsedIds.map(({ acquisitionDate }) => acquisitionDate)
    );
    this.setState({
      _landsatMinAssetDate: minDate,
      _landsatMaxAssetDate: maxDate,
    });
  };

  render() {
    const {
      _landsatMaxAssetDate,
      _landsatMinAssetDate,
      landsatBandCombination,
      landsatBandPreset,
      landsatBands,
      landsatColormapName,
      landsatMosaicId,
      map3d,
      naipMosaicId,
      useNaip,
      viewState,
    } = this.state;

    return (
      <div>
        {map3d ? (
          <Map3d
            landsatBandCombination={landsatBandCombination}
            landsatBands={landsatBands}
            landsatColormapName={landsatColormapName}
            landsatMosaicId={landsatMosaicId}
            naipMosaicId={naipMosaicId}
            onDragEnd={this.onDragEnd}
            onViewportLoad={this.onViewportLoad}
            onViewStateChange={this.onViewStateChange}
            useNaip={useNaip}
            viewState={viewState}
          />
        ) : (
          <Map2d
            landsatBandCombination={landsatBandCombination}
            landsatBands={landsatBands}
            landsatColormapName={landsatColormapName}
            landsatMosaicId={landsatMosaicId}
            naipMosaicId={naipMosaicId}
            onDragEnd={this.onDragEnd}
            onTileLoad={this.onTileLoad}
            onViewportLoad={this.onViewportLoad}
            onViewStateChange={this.onViewStateChange}
            useNaip={useNaip}
            viewState={viewState}
          />
        )}

        <Options
          _landsatMaxAssetDate={_landsatMaxAssetDate}
          _landsatMinAssetDate={_landsatMinAssetDate}
          landsatBandCombination={landsatBandCombination}
          landsatBandPreset={landsatBandPreset}
          landsatBands={landsatBands}
          landsatColormapName={landsatColormapName}
          landsatMosaicId={landsatMosaicId}
          map3d={map3d}
          naipMosaicId={naipMosaicId}
          useNaip={useNaip}
          onChange={value => {
            this.setState(value);
            setQueryParams(value);
          }}
        />
      </div>
    );
  }
}

export default IndexPage;
