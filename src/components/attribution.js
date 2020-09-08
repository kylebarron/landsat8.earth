import React from 'react';

export default function AttributionDiv(props) {
  const {showLandsat = true, showNaip = true, showModis = false} = props;

  return (
    <div
      className="mapboxgl-ctrl-attrib mapboxgl-ctrl"
      style={{
        position: 'absolute',
        right: 0,
        bottom: 0,
        zIndex: 1,
        font: '12px/20px Helvetica Neue,Arial,Helvetica,sans-serif',
      }}
    >
      {showNaip && (
        <a
          href="https://www.fsa.usda.gov/programs-and-services/aerial-photography/imagery-programs/naip-imagery/"
          target="_blank"
          rel="noreferrer"
        >
          © USDA{' '}
        </a>
      )}
      {showLandsat && (
        <a
          href="https://www.usgs.gov/land-resources/nli/landsat"
          target="_blank"
          rel="noreferrer"
        >
          © USGS/NASA{' '}
        </a>
      )}
      {showModis && (
        <a
          href="https://lpdaac.usgs.gov/data/get-started-data/collection-overview/missions/modis-overview/"
          target="_blank"
          rel="noreferrer"
        >
          © USGS/NASA MODIS{' '}
        </a>
      )}
      <a href="http://www.openmaptiles.org/" target="_blank" rel="noreferrer">
        © OpenMapTiles
      </a>{' '}
      <a
        href="http://www.openstreetmap.org/about/"
        target="_blank"
        rel="noreferrer"
      >
        © OpenStreetMap contributors
      </a>
    </div>
  );
}
