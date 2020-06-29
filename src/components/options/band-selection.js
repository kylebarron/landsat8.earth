import React from 'react';
import { Select, Grid } from 'semantic-ui-react';

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
  const { landsatBands, onLandsatBandsChange } = props;

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
    </div>
  );
}
