// React Components for choosing Colormaps
import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { getColormapUrl } from '../util/url';
import colormapOptions from '../constants/colormaps.json';
import { arrayToProps } from '../util/util';

export default function ColormapSelection(props) {
  const { landsatColormapName, onChange } = props;
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
        options={arrayToProps(colormapOptions)}
        onChange={(event, object) => {
          onChange({ landsatColormapName: object.value });
        }}
      />

      <p>
        minimum to maximum:
        <img src={colormapUrl} />
      </p>
    </div>
  );
}
