import React from 'react';
import { Select, Grid } from 'semantic-ui-react';
import bandPresets from '../constants/rgb_band_presets.json';
import ColormapSelection from './colormap';

const bandOptions = [...Array(8).keys()].map(k => {
  const key = k + 1;
  return {
    key,
    text: key,
    value: key,
  };
});

function SingleBandSelector(props) {
  const { i, landsatBands, onChange } = props;
  return (
    <Select
      value={landsatBands[i] || 1}
      options={bandOptions}
      fluid
      onChange={(event, object) => {
        landsatBands[i] = object.value;
        onChange({ landsatBands });
      }}
    />
  );
}

export default function BandSelection(props) {
  const {
    landsatBands,
    landsatBandPreset,
    landsatColormapName,
    onChange,
  } = props;

  return (
    <div>
      <p>Spectral Bands Selection</p>
      <BandPresetSelection
        landsatBandPreset={landsatBandPreset}
        onChange={onChange}
      />
      <Grid>
        <Grid.Column key={0}>
          <SingleBandSelector
            landsatBands={landsatBands}
            onChange={onChange}
            i={0}
          />
        </Grid.Column>
        <Grid.Column key={1}>
          <SingleBandSelector
            landsatBands={landsatBands}
            onChange={onChange}
            i={1}
          />
        </Grid.Column>
        <Grid.Column key={2}>
          <SingleBandSelector
            landsatBands={landsatBands}
            onChange={onChange}
            i={2}
          />
        </Grid.Column>
      </Grid>
      <ColormapSelection
        landsatColormapName={landsatColormapName}
        onChange={onChange}
      />
    </div>
  );
}

function BandPresetSelection(props) {
  const { landsatBandPreset, onChange } = props;

  // console.log(landsatBandPreset);
  return (
    <div>
      <Select
        placeholder="custom"
        value={landsatBandPreset}
        options={Object.values(bandPresets)}
        onChange={(event, object) => {
          onChange({ landsatBandPreset: object.value });
        }}
      />
      <p>Hello world {landsatBandPreset} </p>
    </div>
  );
}
