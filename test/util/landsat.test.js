import { landsatParser } from '../../src/components/util/landsat';
import dayjs from 'dayjs';

// Landsat parsing tests from rio-tiler
describe('test landsat parser', () => {
  test('Returns null on invalid pre-collection.', () => {
    const sceneid = 'L0300342017083LGN00';
    const parsed = landsatParser(sceneid);
    expect(parsed).toBeFalsy();
  });

  test('Returns null on invalid collection1 sceneid.', () => {
    const sceneid = 'LC08_005004_20170410_20170414_01_T1';
    const parsed = landsatParser(sceneid);
    expect(parsed).toBeFalsy();
  });

  test('Parse landsat valid pre-collection sceneid and return metadata', () => {
    const sceneid = 'LC80300342017083LGN00';
    const expected = {
      sensor: 'C',
      satellite: '8',
      path: '030',
      row: '034',
      acquisitionYear: '2017',
      acquisitionJulianDay: '083',
      groundStationIdentifier: 'LGN',
      archiveVersion: '00',
      scene: 'LC80300342017083LGN00',
      // Month is 0-indexed
      acquisitionDate: dayjs(new Date(2017, 2, 24)),
    };
    const parsed = landsatParser(sceneid);
    expect(expected).toEqual(parsed);
  });

  test('Parse landsat valid collection1 sceneid and return metadata', () => {
    const sceneid = 'LC08_L1TP_005004_20170410_20170414_01_T1';
    const expected = {
      sensor: 'C',
      satellite: '08',
      processingCorrectionLevel: 'L1TP',
      path: '005',
      row: '004',
      acquisitionYear: '2017',
      acquisitionMonth: '04',
      acquisitionDay: '10',
      processingYear: '2017',
      processingMonth: '04',
      processingDay: '14',
      collectionNumber: '01',
      collectionCategory: 'T1',
      scene: 'LC08_L1TP_005004_20170410_20170414_01_T1',
      // Month is 0-indexed
      acquisitionDate: dayjs(new Date(2017, 3, 10)),
      processingDate: dayjs(new Date(2017, 3, 14)),
    };
    const parsed = landsatParser(sceneid);
    expect(expected).toEqual(parsed);
  });
});
