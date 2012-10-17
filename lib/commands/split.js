var async = require('async'),
    debug = require('debug')('lytroview'),
    path = require('path'),
    fs = require('fs'),
    lytroview = require('../../');

// action description
exports.desc = 'Split a target image file into individual frames';

exports.args = {
    'path': path
};

// export runner
exports.run = function(opts, callback) {
    var scaffolder = this,
        sourceFile = path.resolve(opts.argv.remain[0]),
        baseName = path.basename(sourceFile, path.extname(sourceFile)),
        baseDir = path.dirname(sourceFile),
        fileIndex = 0;
        
    // open the file and get the filedata
    lytroview(path.resolve(opts.argv.remain[0]), function(err, fileData) {
        if (err) return scaffolder.error(err);
        
        // save each of the images to the file system
        async.forEach(
            fileData.images, 
            function(image, itemCallback) {
                var chunkName = baseName + '-' + (fileIndex++) + '.jpg',
                    targetFile = path.resolve(baseDir, chunkName);
                
                scaffolder.out('writing: !{underline}' + targetFile);
                fs.writeFile(targetFile, image.data, itemCallback);
            },
            function(err) {
                if (err) return scaffolder.error(err);
                
                scaffolder.out('!{check} done');
            }
        );
    });
};