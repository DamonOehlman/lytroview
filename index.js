// @flow
const path = require('path');
const async = require('async');
const debug = require('debug')('lytroview');
const fs = require('fs');

/*::
type LytroViewConfig = {
  outputPath: string
}

export type FileData = {
  buffer: Buffer,
  config: LytroViewConfig
};

*/

const { findMatches, getSearchers, extractContentBlock } = require('./matcher');

function loadFile(filename /*: string */, opts /*: {} */) /*: Promise<FileData> */ {
  const sourceFile = path.resolve(filename);
  const config = deserializeConfig(sourceFile, opts);
  const baseName = path.basename(sourceFile, path.extname(sourceFile));

  return new Promise((resolve, reject) => {
    fs.readFile(sourceFile, (err, buffer) => {
      if (err) {
        return reject(err);
      }

      resolve({ buffer, config });
    })
  });
}

/**
 * Deserialize the command line configuration providide into an application a typed
 * configuration object.
 */
function deserializeConfig(sourceFile /*: string */, opts /*: {} */) /*: LytroViewConfig */ {
  let outputPath = path.dirname(sourceFile);
  if (opts.output_dir && typeof opts.output_dir == 'string') {
    outputPath = opts.output_dir;
  }

  return {
    outputPath
  };
}

module.exports = {
  loadFile
};
