// React Components for choosing Colormaps
import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { getColormapUrl } from '../util/url';
import colormapOptions from '../constants/colormaps.json';

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
        options={colormapOptions}
        onChange={(event, object) => {
          onChange({landsatColormapName: object.value});
        }}
      />

      <p>Selected colormap: from minimum to maximum:</p>
      <img src={colormapUrl} />
    </div>
  );
}
