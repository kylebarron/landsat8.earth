var dayjs = require('dayjs');

/**
 * Parse Landsat-8 scene id
 * Ported from rio-tiler
 * Original author @perrygeo - http://www.perrygeo.com
 *
 * @param  {string} sceneid Landsat sceneid
 * @return {object}         Object with metadata constructed from the sceneid.
 */
export function landsatParser(sceneid) {
  // double escaped, since no raw string
  var precollection_pattern = new RegExp(
    '^L' +
      // <sensor>
      '(\\w{1})' +
      // <satellite>
      '(\\w{1})' +
      // <path>
      '([0-9]{3})' +
      // <row>
      '([0-9]{3})' +
      // <acquisitionYear>
      '([0-9]{4})' +
      // <acquisitionJulianDay>
      '([0-9]{3})' +
      // <groundStationIdentifier>
      '(\\w{3})' +
      // <archiveVersion>
      '([0-9]{2})$'
  );

  // double escaped, since no raw string
  var collection_pattern = new RegExp(
    '^L' +
      // <sensor>
      '(\\w{1})' +
      // <satellite>
      '(\\w{2})' +
      '_' +
      // <processingCorrectionLevel>
      '(\\w{4})' +
      '_' +
      // <path>
      '([0-9]{3})' +
      // <row>
      '([0-9]{3})' +
      '_' +
      // <acquisitionYear>
      '([0-9]{4})' +
      // <acquisitionMonth>
      '([0-9]{2})' +
      // <acquisitionDay>
      '([0-9]{2})' +
      '_' +
      // <processingYear>
      '([0-9]{4})' +
      // <processingMonth>
      '([0-9]{2})' +
      // <processingDay>
      '([0-9]{2})' +
      '_' +
      // <collectionNumber>
      '(\\w{2})' +
      '_' +
      // <collectionCategory>
      '(\\w{2})$'
  );

  // Collection match first, as it's more common
  var collection_match = collection_pattern.exec(sceneid);
  // Extract groups and return
  if (collection_match) {
    var [
      scene,
      sensor,
      satellite,
      processingCorrectionLevel,
      path,
      row,
      acquisitionYear,
      acquisitionMonth,
      acquisitionDay,
      processingYear,
      processingMonth,
      processingDay,
      collectionNumber,
      collectionCategory,
    ] = collection_match;

    var acquisitionDate = dayjs(
      new Date(acquisitionYear, acquisitionMonth - 1, acquisitionDay)
    );
    var processingDate = dayjs(
      new Date(processingYear, processingMonth - 1, processingDay)
    );

    return {
      scene,
      sensor,
      satellite,
      processingCorrectionLevel,
      path,
      row,
      acquisitionYear,
      acquisitionMonth,
      acquisitionDay,
      processingYear,
      processingMonth,
      processingDay,
      collectionNumber,
      collectionCategory,
      acquisitionDate,
      processingDate,
    };
  }

  var precollection_match = precollection_pattern.exec(sceneid);
  if (precollection_match) {
    var [
      scene,
      sensor,
      satellite,
      path,
      row,
      acquisitionYear,
      acquisitionJulianDay,
      groundStationIdentifier,
      archiveVersion,
    ] = precollection_match;

    // Note, this might be in local timezone
    var acquisitionDate = dayjs(new Date(acquisitionYear, 0, 1)).add(
      Number(acquisitionJulianDay) - 1,
      'day'
    );

    return {
      scene,
      sensor,
      satellite,
      path,
      row,
      acquisitionYear,
      acquisitionJulianDay,
      groundStationIdentifier,
      archiveVersion,
      acquisitionDate,
    };
  }
}
