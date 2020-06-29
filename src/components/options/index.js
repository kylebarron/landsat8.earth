import React from 'react';
import { Header, Accordion, Icon } from 'semantic-ui-react';
import BandSelection from './band-selection';
import MosaicSelection from './mosaic-selection';

export default class Options extends React.Component {
  state = {
    activeIndex: 0,
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
      landsatMosaic,
      naipMosaic,
      onLandsatMosaicChange,
      onNaipMosaicChange,
      useNaip,
      landsatBands,
      onLandsatBandsChange,
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
        <Header as="h3">Options</Header>
        <Accordion>
          <Accordion.Title
            active={activeIndex === 0}
            index={0}
            onClick={this.handleClick}
          >
            <Icon name="dropdown" />
            Band Selection
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 0}>
            <BandSelection
              landsatBands={landsatBands}
              onLandsatBandsChange={onLandsatBandsChange}
            />
          </Accordion.Content>

          <Accordion.Title
            active={activeIndex === 1}
            index={1}
            onClick={this.handleClick}
          >
            <Icon name="dropdown" />
            Mosaic/Imagery Selection
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 1}>
            <MosaicSelection
              landsatMosaic={landsatMosaic}
              naipMosaic={naipMosaic}
              onLandsatMosaicChange={onLandsatMosaicChange}
              onNaipMosaicChange={onNaipMosaicChange}
              useNaip={useNaip}
            />
          </Accordion.Content>
        </Accordion>
      </div>
    );
  }
}
