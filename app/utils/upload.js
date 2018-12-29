const inspect = require('util').inspect;
const path = require('path');
const os = require('os');
const fs = require('fs');
const Busboy = require('busboy');
const UtilType = require('./type');
const UtilDatetime = require('./datetime');


function mkdirsSync(dirname) {
  // console.log(dirname)
  if (fs.existsSync(dirname)) {
    return true;
  }
  if (mkdirsSync(path.dirname(dirname))) {
    fs.mkdirSync(dirname);
    return true;
  }

}

function getSuffixName(fileName) {
  const nameList = fileName.split('.');
  return nameList[nameList.length - 1];
}

function uploadPicture(ctx, options) {
  const req = ctx.req;
  const res = ctx.res;
  const busboy = new Busboy({ headers: req.headers });

  let pictureType = 'common';
  if (UtilType.isJSON(options) && UtilType.isString(options.pictureType)) {
    pictureType = options.pictureType;
  }

  const picturePath = path.join(
    __dirname,
    '/../../static/output/upload/',
    pictureType,
    UtilDatetime.parseStampToFormat(null, 'YYYY/MM/DD'));

  console.log(path.sep, picturePath);
  const mkdirResult = mkdirsSync(picturePath);


  return new Promise((resolve, reject) => {
    const result = {
      success: false,
      code: '',
      message: '',
      data: null,
    };

    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      console.log('File-file [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);


      const pictureName = Math.random().toString(16).substr(2) + '.' + getSuffixName(filename);
      const _uploadFilePath = path.join(picturePath, pictureName);
      console.log(_uploadFilePath);

      const saveTo = path.join(_uploadFilePath);
      file.pipe(fs.createWriteStream(saveTo));

      // file.on('data', function(data) {
      //   console.log('File-data [' + fieldname + '] got ' + data.length + ' bytes')
      // })

      file.on('end', function() {
        console.log('File-end [' + fieldname + '] Finished');
        result.success = true;
        resolve(result);
      });
    });

    // busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
    //   console.log('Field-field [' + fieldname + ']: value: ' + inspect(val))
    // })
    // busboy.on('finish', function() {
    //   console.log('Done parsing form!')
    // })

    busboy.on('error', function(err) {
      console.log('File-error');
      reject(result);
    });

    req.pipe(busboy);
  });

}


module.exports = {
  uploadPicture,
};

