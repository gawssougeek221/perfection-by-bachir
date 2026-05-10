import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, 'out');
const PORT = 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
};

const server = http.createServer((req, res) => {
  try {
    let urlPath = req.url.split('?')[0];
    
    // Handle SPA routing
    if (urlPath === '/') urlPath = '/index.html';
    
    // Security: prevent directory traversal
    const safePath = path.normalize(urlPath).replace(/^(\.\.[\/\\])+/, '');
    const filePath = path.join(OUT_DIR, safePath);
    
    // Check file exists
    if (!fs.existsSync(filePath)) {
      // Try .html extension for SPA routing
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
    res.end('Internal Server Error');
  }
});

function serveFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  
  const stat = fs.statSync(filePath);
  
  res.writeHead(200, {
    'Content-Type': contentType,
    'Content-Length': stat.size,
    'Cache-Control': 'public, max-age=31536000, immutable',
    'Connection': 'keep-alive',
    'Keep-Alive': 'timeout=5, max=100',
  });
  
  fs.createReadStream(filePath).pipe(res);
}

server.keepAliveTimeout = 5000;
server.headersTimeout = 6000;
server.maxConnections = 200;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Static server running on http://0.0.0.0:${PORT}`);
});
