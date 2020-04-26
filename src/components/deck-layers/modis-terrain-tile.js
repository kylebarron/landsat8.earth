import { TerrainLayer } from '@deck.gl/geo-layers';
import { TERRAIN_IMAGE, ELEVATION_DECODER } from './util';
import { getModisUrls } from '../util';

export default function MODISTerrainTileLayer(props) {
  const { dateStr, minZoom = 0, maxZoom = 7, visible } = props || {};
  const tileUrls = getModisUrls({ dateStr });

  return new TerrainLayer({
    id: 'terrain',
    minZoom,
    maxZoom,
    strategy: 'no-overlap',
    elevationDecoder: ELEVATION_DECODER,
    
    // Take away image/elevation url to stop loading
    elevationData: visible ? TERRAIN_IMAGE : '',
    texture: visible ? tileUrls[0] : '',
    color: [255, 255, 255],
    visible,
  });
}
