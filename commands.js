// @flow
const path = require('path');
const fs = require('fs');
const async = require('async');
const { loadFile } = require('./');
const { findMatches, getSearchers, extractContentBlock } = require('./matcher');

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

async function split(filename /*: string */, opts /*: {} */) {
  const { buffer, config } = await loadFile(filename, opts);
  const searchers = getSearchers();
  
  const imageDataBuffer = extractContentBlock({ buffer, searchers }, 0);
}

module.exports = {
  showMetadata,
  split
};
