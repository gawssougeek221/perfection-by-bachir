import http from 'http';
import fs from 'fs';
import path from 'path';

const OUT = '/home/z/my-project/out';
const M = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.webp':'image/webp','.jpg':'image/jpeg','.ico':'image/x-icon','.woff2':'font/woff2','.svg':'image/svg+xml'};

const s = http.createServer((q, r) => {
  let u = q.url.split('?')[0];
  if (u === '/') u = '/index.html';
  const f = path.join(OUT, path.normalize(u).replace(/\.\./g, ''));
  
  fs.readFile(f, (e, d) => {
    if (e) { r.writeHead(404); r.end(); return; }
    const ext = path.extname(f);
    r.writeHead(200, {
      'Content-Type': M[ext] || 'application/octet-stream',
      'Content-Length': d.length,
      'Connection': 'close',
      'Cache-Control': ext === '.html' ? 'no-cache' : 'max-age=31536000',
    });
    r.end(d);
  });
});

s.maxConnections = 5;
s.listen(3000, '0.0.0.0', () => console.log('micro:3000'));
