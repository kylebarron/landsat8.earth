import React from 'react';
import {Accordion, Message} from 'semantic-ui-react';
import BandSelection from './band-selection';
import MosaicSelection from './mosaic-selection';
import DimensionSelection from './dimension-selection';

const Warnings = (props) => {
  const {modisWarning, map3dWarning} = props;
  if (!modisWarning && !map3dWarning) {
    return null;
  }

  return (
    <Message size="small" warning compact>
      {modisWarning && <p>Static MODIS imagery is used at low zooms</p>}
      {map3dWarning && <p>3D terrain rendering is experimental</p>}
    </Message>
  );
};

export default function Options(props) {
  const {onChange, map3d, viewState} = props;
  const {zoom} = viewState;

  const panels = [
    {
      key: 'top-level-panel',
      title: {
        content: <b style={{fontSize: '20px'}}>Landsat8.earth</b>,
      },
      content: {
        content: (
          <div>
            <DimensionSelection
              map3d={map3d}
              onChange={onChange}
              viewState={viewState}
            />
            <Warnings modisWarning={zoom < 6.5} map3dWarning={map3d} />
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
        // Needs to be visible so that dropdown is visible outside div
        overflow: 'visible',
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
