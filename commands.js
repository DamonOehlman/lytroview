// @flow
const path = require('path');
const fs = require('fs');
const async = require('async');
const { loadFile } = require('./');
const {
  findMatches,
  getSearchers,
  extractContentBlock,
  extractImages,
  getFileMetadata
} = require('./matcher');

async function showMetadata(filename /*: string */, opts /*: {} */) {
  const { buffer, config } = await loadFile(filename, opts);
  const searchers = getSearchers();
  
  // get the image metadata
  // const imageDataBuffer = extractContentBlock({ buffer, searchers }, 0);
  const imageMetadataBuffer = extractContentBlock({ buffer, searchers }, 1);
  // const deviceMetadataBuffer = extractContentBlock({ buffer, searchers }, 2);

  if (imageMetadataBuffer) {
    console.log(imageMetadataBuffer.toString('utf-8'));
  }
}

async function unpack(filename /*: string */, opts /*: {} */) {
  const { buffer, config } = await loadFile(filename, opts);
  const searchers = getSearchers();

  // get the metadata info
  const metadata = getFileMetadata({ buffer, searchers });
  console.log(metadata);
  
  // const imageDataBuffer = extractContentBlock({ buffer, searchers }, 0);
  // if (!imageDataBuffer) {
  //   throw new Error('Unable to locate image content block');
  // }

  // fs.writeFile('/tmp/imagedata.bin', imageDataBuffer, (err) => {
  //   console.log('wrote file');
  // });

  // const [imageBuffers] = extractImages({ buffer: imageDataBuffer, searchers });
}

module.exports = {
  showMetadata,
  unpack
};
