// @flow
const debug = require('debug')('lytroview:matcher');
const Bop = require('bop');

/*::
type PatternId =
  'file_start'
  | 'id_start'
  | 'json_end'
  | 'section_start'
  | 'jpeg_start'
  | 'jpeg_end'
  | 'sha_start';

type SearchInput = {
  buffer: Buffer,
  searchers: Map<PatternId, Bop>
};
*/

const SECTION_TERMINATOR_LENGTH = 12;
const SECTION_START_LENGTH = 16;
const SHA_BYTE_LENGTH = 80;

const SECTION_TERMINATOR = new Bop(Buffer.alloc(SECTION_TERMINATOR_LENGTH));

const bytePatterns /*: Map<PatternId,string> */ = new Map([
  ['file_start', '89 4C 46 50 0D 0A 1A 0A 00 00 00 01 00 00 00 00'],
  ['id_start', '89 4C 46 4D 0D 0A 1A 0A'],
  ['json_end', '89 4C 46 43 0D 0A 1A 0A 00 00 00 00 00 00 09 C4'],

  // AFAICT there are three data sections:
  // 1. image data
  // 2. metadata about the picture taken
  // 3. metadata about the device
  // each section is terminated with 12 empty bytes
  ['section_start', '89 4C 46 43 0D 0A 1A 0A'],

  ['jpeg_start', 'FF D8'],
  ['jpeg_end', 'FF D9'],
  ['sha_start', '73 68 61 31']
]);

function findMatches(inputBuffer /*: Buffer */) {
  const patternSearchers = createSearchers(bytePatterns);

  for (let [key, searcher] of patternSearchers) {
    debug(`${key}:`, searcher.parse(inputBuffer));
  }
}

function getSearchers() /*: Map<PatternId, Bop> */ {
  return createSearchers(bytePatterns);
}

function createSearchers(input /*: Map<PatternId,string> */) /*: Map<PatternId, Bop> */ {
  const bufferMap /*: Map<PatternId, Bop> */ = new Map();
  for (let [patternId, value] of input) {
    bufferMap.set(patternId, new Bop(Buffer.from(value.replace(/\s+/g, ''), 'hex')));
  }
  
  return bufferMap;
}

function extractContentBlock({ buffer, searchers } /*: SearchInput */, index /*: number */) /*: ?Buffer */{
  const searcher = searchers.get('section_start');
  if (!searcher) {
    return null;
  }

  const blockIndexes = searcher.parse(buffer);
  if (blockIndexes.length > index) {
    const startIndex = blockIndexes[index];
    const jsonStartIndex = startIndex + SECTION_START_LENGTH + SHA_BYTE_LENGTH;
    const endIndex = SECTION_TERMINATOR.parse(buffer, jsonStartIndex, 1)[0];
    debug(`start index ${startIndex}, jsonStartIndex ${jsonStartIndex}, endIndex ${endIndex}`);

    if (endIndex) {
      return buffer.slice(jsonStartIndex, endIndex);
    }
  }
}

module.exports = {
  getSearchers,
  findMatches,
  extractContentBlock
};
