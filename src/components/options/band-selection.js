import React from 'react';
import { Select, Grid, Dropdown } from 'semantic-ui-react';
import { getColormapUrl } from '../util/url';
import bandPresets from '../constants/rgb_band_presets.json';
import colormapOptions from '../constants/colormaps.json';

const bandOptions = [...Array(8).keys()].map(k => {
  const key = k + 1;
  return {
    key,
    text: key,
    value: key,
  };
});

function SingleBandSelector(props) {
  const { i, landsatBands, onLandsatBandsChange } = props;
  return (
    <Select
      value={landsatBands[i] || 1}
      options={bandOptions}
      onChange={(event, object) => {
        landsatBands[i] = object.value;
        onLandsatBandsChange(landsatBands);
      }}
    />
  );
}

export default function BandSelection(props) {
  const {
    landsatBands,
    onLandsatBandsChange,
    landsatBandPreset,
    onLandsatBandPresetChange,
    landsatColormapName,
    onLandsatColormapNameChange,
  } = props;

  return (
    <div>
      <p>Spectral Bands Selection</p>
      <Grid>
        <Grid.Column key={0}>
          <SingleBandSelector
            landsatBands={landsatBands}
            onLandsatBandsChange={onLandsatBandsChange}
            i={0}
          />
        </Grid.Column>
        <Grid.Column key={1}>
          <SingleBandSelector
            landsatBands={landsatBands}
            onLandsatBandsChange={onLandsatBandsChange}
            i={1}
          />
        </Grid.Column>
        <Grid.Column key={2}>
          <SingleBandSelector
            landsatBands={landsatBands}
            onLandsatBandsChange={onLandsatBandsChange}
            i={2}
          />
        </Grid.Column>
      </Grid>
      <ColormapSelection
        landsatColormapName={landsatColormapName}
        onLandsatColormapNameChange={onLandsatColormapNameChange}
      />
    </div>
  );
}

function ColormapSelection(props) {
  const { landsatColormapName, onLandsatColormapNameChange } = props;
  const colormapUrl = getColormapUrl(landsatColormapName);
  if (!colormapUrl) {
    return null;
  }

  return (
    <div>
      <Dropdown
        value={landsatColormapName}
        placeholder="Select Colormap"
        fluid
        selection
        options={colormapOptions}
        onChange={(event, object) => {
          onLandsatColormapNameChange(object.value);
        }}
      />

      <p>Selected colormap: from minimum to maximum:</p>
      <img src={colormapUrl} />
    </div>
  );
}

function BandPresetSelection(props) {
  const { landsatBandPreset, onLandsatBandPresetChange } = props;

  // console.log(landsatBandPreset);
  return (
    <div>
      <Select
        placeholder="custom"
        value={landsatBandPreset}
        options={Object.values(bandPresets)}
        onChange={(event, object) => {
          onLandsatBandPresetChange(object.value);
        }}
      />
      <p>Hello world {landsatBandPreset} </p>
    </div>
  );
}
