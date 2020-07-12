import React from 'react';
import { Button } from 'semantic-ui-react';

export default function DimensionSelection(props) {
  const { map3d, onChange } = props;
  return (
    <Button.Group>
      <Button active={!map3d} onClick={() => onChange({ map3d: false })}>
        2D
      </Button>
      <Button active={map3d} onClick={() => onChange({ map3d: true })}>
        3D
      </Button>
    </Button.Group>
  );
}
