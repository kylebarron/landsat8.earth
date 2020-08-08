import React from 'react';
import { Header, Accordion, Icon, Message } from 'semantic-ui-react';
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

export default class Options extends React.Component {
  state = {
    activeIndex: -1,
  };
  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  };

  render() {
    const { activeIndex } = this.state;
    const {
      landsatMosaicId,
      naipMosaicId,
      useNaip,
      landsatBands,
      landsatColormapName,
      landsatBandCombination,
      landsatBandPreset,
      onChange,
      map3d,
    } = this.props;

    return (
      <div
        style={{
          position: 'absolute',
          width: 300,
          maxWidth: 400,
          left: 5,
          top: 5,
          padding: 5,
          height: '100%',
          // maxHeight: '70%',
          zIndex: 1,
          backgroundColor: '#fff',
          pointerEvents: 'auto',
          overflowY: 'auto',
          // overflow: 'visible',
        }}
      >
        <Header as="h2">Landsat8.earth</Header>
        <Header as="h3">Map Options</Header>
        
        <DimensionSelection map3d={map3d} onChange={onChange} />
        {map3d && <Experimental3dWarning />}

        <Accordion>
          <Accordion.Title
            active={activeIndex === 0}
            index={0}
            onClick={this.handleClick}
          >
            <Icon name="dropdown" />
            <b>Band Selection</b>
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 0}>
            <BandSelection
              landsatBands={landsatBands}
              landsatBandPreset={landsatBandPreset}
              landsatBandCombination={landsatBandCombination}
              landsatColormapName={landsatColormapName}
              onChange={onChange}
            />
          </Accordion.Content>

          <Accordion.Title
            active={activeIndex === 1}
            index={1}
            onClick={this.handleClick}
          >
            <Icon name="dropdown" />
            <b>Mosaic/Imagery Selection</b>
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 1}>
            <MosaicSelection
              landsatMosaicId={landsatMosaicId}
              naipMosaicId={naipMosaicId}
              useNaip={useNaip}
              onChange={onChange}
            />
          </Accordion.Content>
        </Accordion>
      </div>
    );
  }
}
