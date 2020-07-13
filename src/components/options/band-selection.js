import React from 'react';
import { Select, Grid, Header } from 'semantic-ui-react';
import bandPresets from '../constants/rgb_band_presets.json';
import bandCombinations from '../constants/band_combinations.json';
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
    landsatBandCombination,
    landsatColormapName,
    onChange,
  } = props;

  return (
    <div>
      <Header as="h4">Presets</Header>
      <BandPresetSelection
        landsatBandPreset={landsatBandPreset}
        onChange={onChange}
      />
      <Header as="h4">Custom</Header>
      <Header as="h5">Band Choice</Header>
      <BandChoice landsatBands={landsatBands} onChange={onChange} />
      {/* TODO: is this better named "Band Interpretation"? */}
      <Header as="h5">Band Combination</Header>
      <BandCombinationSelection
        landsatBandCombination={landsatBandCombination}
        onChange={onChange}
      />
      <Header as="h5">Colormap</Header>
      <ColormapSelection
        landsatColormapName={landsatColormapName}
        onChange={onChange}
      />
    </div>
  );
}

function BandPresetSelection(props) {
  const { landsatBandPreset, onChange } = props;

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
    </div>
  );
}

function BandChoice(props) {
  const { landsatBands, onChange } = props;

  return (
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
  );
}

function BandCombinationSelection(props) {
  const {landsatBandCombination, onChange} = props;

  return (
    <Select
      placeholder="custom"
      value={landsatBandCombination}
      options={bandCombinations}
      onChange={(event, object) => {
        onChange({ landsatBandCombination: object.value });
      }}
    />
  );
}
