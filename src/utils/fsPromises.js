const { access, createWriteStream, mkdir, unlink, readFile } = require('fs');
const { promisify } = require('util');

const fsAccessPromise = promisify(access);

const fsMakeDirPromise = promisify(mkdir);

const fsReadPromise = promisify(readFile);

const fsUnlinkPromise = promisify(unlink);

const writeStreamToFile = (createStream, filePath) => {
  return new Promise((resolve, reject) => {
    const stream = createStream();

    const file = createWriteStream(filePath);
    stream.pipe(file);
    file.on('finish', () => resolve('Done'));
    file.on('error', () => reject());
  });
};
module.exports = {
  fsAccessPromise,
  fsMakeDirPromise,
  fsReadPromise,
  fsUnlinkPromise,
  writeStreamToFile,
};
