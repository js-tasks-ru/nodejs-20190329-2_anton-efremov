const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':

      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end();
      } else {
        const stream = fs.createReadStream(filepath);

        stream.on('open', function () {
          res.setHeader('content-encoding', 'utf-8');
          stream.pipe(res);
        });

        stream.on('error', function(err) {
          res.statusCode = 404;
          console.log(err);
          res.end();
        });
      }
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
