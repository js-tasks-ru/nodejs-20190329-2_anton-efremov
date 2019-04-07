const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.byteLimit = options.limit;
    this.byteCounter = 0;
  }

  _transform(chunk, encoding, callback) {
    const str = chunk.toString(); // failed to use the encoding param here :~(
    this.byteCounter += chunk.length; // it could be just str.length, but we also considering symbols with double byte encoding

    if (this.byteCounter > this.byteLimit) {
      callback(new LimitExceededError(), null);
    }

    callback(null, str);
  }
}

module.exports = LimitSizeStream;

// my local testing code below
// const limitStream = new LimitSizeStream({limit: 3});
// function onData(line) {
//   console.log(line);
// }

// limitStream.on('data', onData);

// limitStream.write('a');
// limitStream.write('фg');
// limitStream.end();
