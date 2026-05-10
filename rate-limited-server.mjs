import http from 'http';
import fs from 'fs';
import path from 'path';

const OUT_DIR = '/home/z/my-project/out';
const PORT = 3000;
const MAX_CONCURRENT = 3;

let activeConnections = 0;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
};

const server = http.createServer((req, res) => {
  // Queue requests if too many concurrent
  if (activeConnections >= MAX_CONCURRENT) {
    res.writeHead(503, { 'Retry-After': '1' });
    res.end('Server busy, retry later');
    return;
  }
  
  activeConnections++;
  
  try {
    let urlPath = req.url.split('?')[0];
    if (urlPath === '/') urlPath = '/index.html';
    
    const safePath = path.normalize(urlPath).replace(/^(\.\.[\/\\])+/, '');
    const filePath = path.join(OUT_DIR, safePath);
    
    if (!fs.existsSync(filePath)) {
      const htmlPath = filePath + '.html';
      if (fs.existsSync(htmlPath)) {
        serveFile(htmlPath, res);
        return;
      }
      res.writeHead(404);
      res.end('Not Found');
      return;
    }
    
    serveFile(filePath, res);
  } catch (err) {
    res.writeHead(500);
    res.end('Error');
  } finally {
    activeConnections--;
  }
});

function serveFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  const stat = fs.statSync(filePath);
  
  // Cache static assets aggressively
  const cacheControl = ext === '.html' 
    ? 'no-cache, must-revalidate' 
    : 'public, max-age=31536000, immutable';
  
  res.writeHead(200, {
    'Content-Type': contentType,
    'Content-Length': stat.size,
    'Cache-Control': cacheControl,
    'Connection': 'close',
  });
  
  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
  stream.on('error', () => {
    res.writeHead(500);
    res.end('Error reading file');
  });
}

server.keepAliveTimeout = 2000;
server.maxConnections = 10;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Rate-limited static server on :${PORT} (max ${MAX_CONCURRENT} concurrent)`);
});
