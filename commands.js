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
    console.log(JSON.parse(imageMetadataBuffer.toString('utf-8')));
  }

  // if (deviceMetadataBuffer) {
  //   console.log('\nDEVICE DATA:')
  //   console.log(JSON.parse(deviceMetadataBuffer.toString('utf-8')));
  // }

  // console.log(imageDataBuffer.length);  
  // lytroview(sourceFile, (err, fileData) => load
  //   if (err) {
  //     return console.error(err);
  //   }
    
  //   // save each of the images to the file system
  //   console.log(`found ${fileData.images.length} layers`);
  //   async.eachOf(fileData.images, saveJpeg, (err) => {
  //     if (err) {
  //       return console.error(err);
  //     }

  //     console.log('done');
  //   });
  // });

  // function saveJpeg(image, fileIndex, callback) {
  //   const targetFile = path.resolve(outputDir, `${baseName}-${fileIndex}.jpg`);
    
  //   console.log(`writing: ${targetFile}`);
  //   fs.writeFile(targetFile, image.data, callback);
  // }
}

function split(filename, opts) {
}

module.exports = {
  showMetadata,
  split
};
