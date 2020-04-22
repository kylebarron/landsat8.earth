/** @jsx jsx */
import React from 'react';
import { Link } from 'gatsby';
import { Styled, jsx } from 'theme-ui';
import {
  Container,
  Accordion,
  Checkbox,
  Card,
  Grid,
  List,
  Icon,
  Header,
} from 'semantic-ui-react';

import Map from '../components/map';
import Layout from '../components/layout';
import Image from '../components/image';
import SEO from '../components/seo';

class IndexPage extends React.Component {
  render() {
    return (
      <Layout>
        <Map />

        <Container
          style={{
            position: 'absolute',
            width: 240,
            left: 30,
            top: 160,
            maxHeight: '70%',
            zIndex: 1,
            backgroundColor: '#fff',
            pointerEvents: 'auto',
            overflowY: 'auto',
          }}
        >
          <p>Hello world!</p>
        </Container>
      </Layout>
    );
  }
}

export default IndexPage;
