const http = require('http');
const fs = require('fs');
const path = require('path');
const file = path.resolve(__dirname, '../outputs/performance-mvp.html');
http.createServer((request, response) => {
  response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store'});
  fs.createReadStream(file).pipe(response);
}).listen(4180, '127.0.0.1', () => console.log('PMSDotNet preview: http://127.0.0.1:4180/performance-mvp.html'));
