import React from 'react';
import {Icon} from 'semantic-ui-react';

export default function AboutPanel(props) {
  return (
    <div>
      <p>
        Landsat8.earth is an application to explore{' '}
        <a
          href="https://www.usgs.gov/land-resources/nli/landsat/landsat-8?qt-science_support_page_related_con=0#qt-science_support_page_related_con"
          target="_blank"
          rel="noreferrer"
        >
          Landsat 8{' '}
        </a>
        satellite imagery in the browser using{' '}
        <a
          href="https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API"
          target="_blank"
          rel="noreferrer"
        >
          WebGL{' '}
        </a>
        (via{' '}
        <a href="https://deck.gl" target="_blank" rel="noreferrer">
          deck.gl
        </a>
        ). The backend runs on AWS Lambda and is powered by{' '}
        <a href="https://cogeo.org" target="_blank" rel="noreferrer">
          Cloud-Optimized GeoTIFFs
        </a>
        , a fast cloud-native file format that enables streaming portions of
        raster images. It draws from the huge repository of Landsat 8 data{' '}
        <a
          href="https://registry.opendata.aws/landsat-8/"
          target="_blank"
          rel="noreferrer"
        >
          publicly available on S3
        </a>
        , thanks to the AWS Open Data program.
      </p>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://github.com/kylebarron/landsat8.earth"
      >
        <Icon name="github" />
        Github
      </a>
      <br />
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://twitter.com/kylebarron2"
      >
        <Icon name="twitter" />
        Twitter
      </a>
      <br />
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://kylebarron.dev"
      >
        <Icon name="globe" />
        Blog
      </a>
    </div>
  );
}
