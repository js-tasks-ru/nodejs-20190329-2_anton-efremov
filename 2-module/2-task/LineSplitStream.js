const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.remainder = '';
  }

  _transform(chunk, encoding, callback) {
    const str = this.remainder + chunk.toString();
    const lines = str.split(os.EOL);
    const lastLine = lines.pop();
    this.remainder = '';

    for (const line of lines) {
      this.push(line);
    }

    if (lastLine.endsWith(os.EOL)) {
      this.push(lastLine);
    } else {
      this.remainder = lastLine;
    }

    callback();
  }

  _flush(callback) {
    if (this.remainder) {
      this.push(this.remainder);
    }

    callback();
  }
}

const lines = new LineSplitStream({
  encoding: 'utf-8'
});

function onData(line) {
  console.log(line);
}

lines.on('data', onData);

// lines.write(`первая строка${os.EOL}вторая строка${os.EOL}третья строка`);
// lines.write('a');
// lines.write('b');
// lines.write('c');
// lines.write('d');


lines.write('a');
lines.write(`b${os.EOL}c`);
lines.end();

module.exports = LineSplitStream;