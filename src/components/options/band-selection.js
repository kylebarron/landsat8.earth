import React from 'react';
import { Select, Grid, Header } from 'semantic-ui-react';
import bandPresets from '../constants/band_presets.json';
import bandCombinations from '../constants/band_combinations.json';
import ColormapSelection from './colormap';
import { arrayToProps } from '../util/util';

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
        onChange({ landsatBands, landsatBandPreset: null });
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
      <BandChoice
        nBands={bandCombinations[landsatBandCombination].nBands}
        landsatBands={landsatBands}
        onChange={onChange}
      />
      {/* TODO: is this better named "Band Interpretation"? */}
      <Header as="h5">Band Combination</Header>
      <BandCombinationSelection
        landsatBandCombination={landsatBandCombination}
        onChange={onChange}
      />

      {/* Only show ColormapSelection when creating index of some kind */}
      {landsatBandCombination !== 'rgb' && (
        <div>
          <Header as="h5">Colormap</Header>
          <ColormapSelection
            landsatColormapName={landsatColormapName}
            onChange={onChange}
          />
        </div>
      )}
    </div>
  );
}

function BandPresetSelection(props) {
  const { landsatBandPreset, onChange } = props;

  return (
    <div>
      <Select
        placeholder="Choose a Preset"
        value={landsatBandPreset}
        options={arrayToProps(Object.values(bandPresets))}
        onChange={(event, object) => {
          const newLandsatBandPreset = object.value;
          const presetData = bandPresets[newLandsatBandPreset];
          const { landsatBands, bandCombination } = presetData;
          onChange({
            landsatBandPreset: newLandsatBandPreset,
            landsatBands,
            bandCombination,
          });
        }}
      />
    </div>
  );
}

function BandChoice(props) {
  const { nBands, landsatBands, onChange } = props;

  return (
    <Grid>
      {[...Array(nBands).keys()].map(i => (
        <Grid.Column key={i}>
          <SingleBandSelector
            landsatBands={landsatBands}
            onChange={onChange}
            i={i}
          />
        </Grid.Column>
      ))}
    </Grid>
  );
}

function BandCombinationSelection(props) {
  const { landsatBandCombination, onChange } = props;

  return (
    <Select
      placeholder="Choose a Band Combination"
      value={landsatBandCombination}
      options={arrayToProps(Object.values(bandCombinations))}
      onChange={(event, object) => {
        onChange({
          landsatBandCombination: object.value,
          landsatBandPreset: null,
        });
      }}
    />
  );
}
