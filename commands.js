// @flow
const path = require('path');
const fs = require('fs');
const async = require('async');
const { loadFile } = require('./');

function split(filename, opts) {
  const sourceFile = path.resolve(filename);
  const outputDir = opts.output_dir || path.dirname(sourceFile);
  const baseName = path.basename(sourceFile, path.extname(sourceFile));

  const { buffer, config } = loadfile(filename, opts);
  
  lytroview(sourceFile, (err, fileData) => load
    if (err) {
      return console.error(err);
    }
    
    // save each of the images to the file system
    console.log(`found ${fileData.images.length} layers`);
    async.eachOf(fileData.images, saveJpeg, (err) => {
      if (err) {
        return console.error(err);
      }

      console.log('done');
    });
  });

  function saveJpeg(image, fileIndex, callback) {
    const targetFile = path.resolve(outputDir, `${baseName}-${fileIndex}.jpg`);
    
    console.log(`writing: ${targetFile}`);
    fs.writeFile(targetFile, image.data, callback);
  }
}

module.exports = {
  split
};
