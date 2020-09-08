import React from 'react';
import {Accordion, Message} from 'semantic-ui-react';
import BandSelection from './band-selection';
import MosaicSelection from './mosaic-selection';
import DimensionSelection from './dimension-selection';

const Experimental3dWarning = () => (
  <Message size="small" warning compact>
    <Message.Content>
      <p>3D terrain rendering is experimental</p>
    </Message.Content>
  </Message>
);

export default function Options(props) {
  const {onChange, map3d} = props;

  const panels = [
    {
      key: 'top-level-panel',
      title: {
        content: <b style={{fontSize: '20px'}}>Landsat8.earth</b>,
      },
      content: {
        content: (
          <div>
            <DimensionSelection map3d={map3d} onChange={onChange} />
            {map3d && <Experimental3dWarning />}
            <OptionsBody {...props} />
          </div>
        ),
      },
    },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        width: 400,
        maxWidth: '95%',
        left: '1%',
        top: '1%',
        padding: 15,
        maxHeight: '70%',
        zIndex: 1,
        pointerEvents: 'auto',
        overflowY: 'auto',
        // overflow: 'visible',
      }}
    >
      <Accordion
        defaultActiveIndex={0}
        styled
        panels={panels}
        style={{
          backgroundColor: '#e9f2eb',
        }}
      />
    </div>
  );
}

function OptionsBody(props) {
  const {
    landsatMosaicId,
    naipMosaicId,
    useNaip,
    landsatBands,
    landsatColormapName,
    landsatBandCombination,
    landsatBandPreset,
    onChange,
  } = props;

  const optionsBodyPanels = [
    {
      key: 'band-selection',
      title: 'Band Selection',
      content: {
        content: (
          <BandSelection
            landsatBands={landsatBands}
            landsatBandPreset={landsatBandPreset}
            landsatBandCombination={landsatBandCombination}
            landsatColormapName={landsatColormapName}
            onChange={onChange}
          />
        ),
      },
    },
    {
      key: 'mosaic-selection',
      title: 'Mosaic/Imagery Selection',
      content: {
        content: (
          <MosaicSelection
            landsatMosaicId={landsatMosaicId}
            naipMosaicId={naipMosaicId}
            useNaip={useNaip}
            onChange={onChange}
          />
        ),
      },
    },
  ];

  return (
    <Accordion
      defaultActiveIndex={-1}
      styled
      panels={optionsBodyPanels}
      style={{
        backgroundColor: '#e9f2eb',
      }}
    />
  );
}
