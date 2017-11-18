// @flow
const path = require('path');
const async = require('async');
const debug = require('debug')('lytroview');
const fs = require('fs');
const _ = require('underscore');

/*::
export type FileData = {
  buffer: Buffer,
  basePath: string
};

type LytroViewConfig = {
  outputPath: string
}
*/

const { findMatches, getSearchers, extractContentBlock } = require('./matcher');

const JPEG_START = [0xFF, 0xD8];
const JPEG_END = [0xFF, 0xD9];
const reLFPFile = /^(.*?)\.lfp/i;

const buffersTemplate = [{
  tag: '89 4C 46 50 0D 0A 1A 0A 00 00 00 01 00 00 00 00',
  label: 'File Start'
}, {
  tag: '89 4C 46 4D 0D 0A 1A 0A',
  label: 'ID Start',
  mode: _createExtractor(88)
}, {
  tag: '89 4C 46 43 0D 0A 1A 0A 00 00 00 00 00 00 09 C4',
  label: 'JSON End',
  parser: _readFileData
}, {
  tag: '89 4C 46 43 0D 0A 1A 0A',
  label: 'Image Start',
  mode: _jpegFind,
  keep: true
}];

buffersTemplate.forEach(function(buffer) {
  var tagData = buffer.tag.split(' '),
    out = [];
    
  for (var ii = tagData.length; ii--; ) {
    out[ii] = parseInt(tagData[ii], 16);
  }

  buffer.tag = out;
});

function _createExtractor(length, processor, nextMode) {
  var extractor = function(testBuffer, buffers, fileData) {
    if (testBuffer.length === length) {
      debug('got data');
      // if a processor was specified, then call it
      if (processor) {
        processor(testBuffer, buffers, fileData);
      }
      
      // reset the test buffer
      testBuffer.splice(0);
      
      return nextMode || _search;
    }
    
    return extractor;
  };
  
  return extractor;
} // _createExtractor

function _jpegFind(testBuffer, buffers, fileData) {
  var endBytes = testBuffer.slice(-2);
  if (_.isEqual(endBytes, JPEG_START)) {
    // reset the test buffer
    testBuffer.splice(0, testBuffer.length - 2);
    
    // read the jpeg
    return _jpegRead;
  } // if
  
  return _jpegFind;
} // _jpegFind

function _jpegRead(testBuffer, buffers, fileData) {
  var endBytes = testBuffer.slice(-2);
  if (_.isEqual(endBytes, JPEG_END)) {
    // extract the image
    fileData.images.push({
      data: new Buffer(testBuffer.splice(0))
    });
    
    return _search;
  } // if
  
  return _jpegRead;
} // _readJPEG

function _readFileData(data, buffers, fileData) {
  var buffer = _.first(data, data.length - this.tag.length),
    jsonData;
  
  while (buffer[buffer.length - 1] === 0) {
    buffer.splice(buffer.length - 1, 1);
  }
  
  // convert to a string
  jsonData = new Buffer(buffer).toString('utf8');
  
  try {
    fileData.metadata = JSON.parse(jsonData);
  }
  catch (e) {
    debug('Could not parse file metadata: ', e.stack);
  }
} // _readFileData

function _search(testBuffer, buffers, fileData) {
  // iterate through the buffers and see if we have a tag match
  for (var bufferIdx = buffers.length; bufferIdx--; ) {
    var buffer = buffers[bufferIdx],
      testTail = testBuffer.slice(-buffer.tag.length);
      
    /*
    if (testTail.length <= buffer.tag.length) {
      debug(testTail, buffer.tag);
    }
    */
      
    if (testTail.length === buffer.tag.length && _.isEqual(testTail, buffer.tag)) {
      debug('found: ' + buffer.label);
      
      // if we have a parser with the buffer, then parse a copy of the buffer
      if (buffer.parser) {
        buffer.parser.call(buffer, [].concat(testBuffer), buffers, fileData);
      }

      // reset the test buffer
      testBuffer.splice(0);
      
      // unless we need to keep the buffer, remove it from the array
      if (! buffer.keep) {
        buffers.splice(bufferIdx, 1);
      }
      
      // break from the loop
      return buffer.mode || _search;
    } // if
  } // for
  
  return _search;
} // _search

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

function oldExport(filepath, callback) {
  // create a copy of the buffers for parsing
  var buffers = _.clone(buffersTemplate),
    mode = _search,
    fileData = {
      images: []
    },
    testBuffer = [];
    
  fs.readFile(filepath, function(err, buffer) {
    if (err) {
      return callback(err);
    }

    const searchers = getSearchers();

    // get the image metadata
    const imageDataBuffer = extractContentBlock({ buffer, searchers }, 0);
    const imageMetadataBuffer = extractContentBlock({ buffer, searchers }, 1);
    const deviceMetadataBuffer = extractContentBlock({ buffer, searchers }, 2);

    if (imageMetadataBuffer) {
      console.log('\nIMAGE DATA:')
      console.log(JSON.parse(imageMetadataBuffer.toString('utf-8')));
    }

    if (deviceMetadataBuffer) {
      console.log('\nDEVICE DATA:')
      console.log(JSON.parse(deviceMetadataBuffer.toString('utf-8')));
    }

    console.log(imageDataBuffer.length);
    // findMatches(data);

    // // iterate through the buffer
    // for (var ii = 0, bufferLen = data.length; ii < bufferLen; ii++) {
    //   testBuffer.push(data[ii]);
      
    //   if (mode) {
    //     mode = mode.call(null, testBuffer, buffers, fileData);
    //   }
    // }
    
    // callback(null, fileData);
  });
};
