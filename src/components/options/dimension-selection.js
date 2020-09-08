import React from 'react';
import {Button} from 'semantic-ui-react';

export default function DimensionSelection(props) {
  const {map3d, onChange, viewState} = props;
  return (
    <Button.Group>
      <Button
        active={!map3d}
        onClick={() =>
          onChange({
            map3d: false,
            viewState: {...viewState, pitch: 0, bearing: 0},
          })
        }
      >
        2D
      </Button>
      <Button
        active={map3d}
        onClick={() =>
          onChange({map3d: true, viewState: {...viewState, pitch: 50}})
        }
      >
        3D
      </Button>
    </Button.Group>
  );
}
