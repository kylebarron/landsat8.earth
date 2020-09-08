import React from 'react';
import {
  Divider,
  Message,
  Select,
  Grid,
  Header,
  Icon,
  Popup,
} from 'semantic-ui-react';

import bandChoices from '../constants/band_choices.json';
import rgbBandPresets from '../constants/rgb_band_presets.json';
import spectralBandPresets from '../constants/spectral_index_band_presets.json';
import bandCombinations from '../constants/band_combinations.json';
import ColormapSelection from './colormap';
import {arrayToProps} from '../util/util';

const BandInterpretationPopup = () => (
  <Popup
    content="The manner in which individual bands are combined."
    trigger={<Icon name="question circle" />}
  />
);

function SingleBandSelector(props) {
  const {i, landsatBands, onChange} = props;
  return (
    <Select
      value={landsatBands[i] || 1}
      options={bandChoices}
      onChange={(event, object) => {
        // Take copy of landsatBands array so that I don't modify the master
        // bandPresets
        const newLandsatBands = landsatBands.slice();
        newLandsatBands[i] = object.value;
        onChange({landsatBands: newLandsatBands, landsatBandPreset: null});
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

      {/* Only show ColormapSelection when creating index of some kind */}
      {landsatBandCombination !== 'rgb' && (
        <div>
          <br />
          <b>Colormap</b>
          <ColormapSelection
            landsatColormapName={landsatColormapName}
            onChange={onChange}
          />
        </div>
      )}

      <Divider />
      <Message size="tiny" warning compact>
        <Message.Header>Advanced</Message.Header>
        <p>
          Settings can be further customized below, but for most cases use the
          above presets.
        </p>
      </Message>

      <b>Band Choice</b>
      <BandChoice
        nBands={bandCombinations[landsatBandCombination].nBands}
        landsatBands={landsatBands}
        onChange={onChange}
      />

      <br />
      <b>Band Interpretation</b>
      {/* <BandInterpretationPopup /> */}

      <BandCombinationSelection
        landsatBandCombination={landsatBandCombination}
        onChange={onChange}
      />
    </div>
  );
}

function BandPresetSelection(props) {
  const {landsatBandPreset, onChange} = props;
  // Either true: is an RGB false-color composite or
  // false: is a spectral index
  const isRgbComposite = landsatBandPreset in rgbBandPresets;
  const presetData = isRgbComposite
    ? rgbBandPresets[landsatBandPreset]
    : spectralBandPresets[landsatBandPreset];
  const desc = presetData && presetData.desc;

  return (
    <div>
      <Select
        placeholder="RGB Composites"
        value={isRgbComposite ? landsatBandPreset : null}
        options={arrayToProps(Object.values(rgbBandPresets))}
        fluid
        onChange={(event, object) => {
          const newLandsatBandPreset = object.value;
          const presetData = rgbBandPresets[newLandsatBandPreset];
          const {landsatBands, bandCombination} = presetData;
          onChange({
            landsatBandPreset: newLandsatBandPreset,
            landsatBands,
            landsatBandCombination: bandCombination,
          });
        }}
      />
      <Select
        placeholder="Spectral Indices"
        value={!isRgbComposite ? landsatBandPreset : null}
        options={arrayToProps(Object.values(spectralBandPresets))}
        fluid
        onChange={(event, object) => {
          const newLandsatBandPreset = object.value;
          const presetData = spectralBandPresets[newLandsatBandPreset];
          const {landsatBands, bandCombination} = presetData;
          onChange({
            landsatBandPreset: newLandsatBandPreset,
            landsatBands,
            landsatBandCombination: bandCombination,
          });
        }}
      />
      {desc && (
        <div>
          <br />
          <p>{desc}</p>
        </div>
      )}
    </div>
  );
}

function BandChoice(props) {
  const {nBands, landsatBands, onChange} = props;

  return (
    <Grid>
      <Grid.Column>
        {[...Array(nBands).keys()].map((i) => (
          <Grid.Row key={i}>
            <SingleBandSelector
              landsatBands={landsatBands}
              onChange={onChange}
              i={i}
            />
          </Grid.Row>
        ))}
      </Grid.Column>
    </Grid>
  );
}

function BandCombinationSelection(props) {
  const {landsatBandCombination, onChange} = props;

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
