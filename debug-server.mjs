import http from 'http';
import fs from 'fs';
import path from 'path';

const OUT_DIR = '/home/z/my-project/out';

const server = http.createServer((req, res) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} HTTP/${req.httpVersion}`);
  console.log(`  Headers: ${JSON.stringify(req.headers).substring(0, 200)}`);
  
  let urlPath = req.url.split('?')[0];
  if (urlPath === '/') urlPath = '/index.html';
  
  const safePath = path.normalize(urlPath).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(OUT_DIR, safePath);
  
  if (!fs.existsSync(filePath)) {
    console.log(`  404: ${filePath}`);
    res.writeHead(404);
    res.end('Not Found');
    return;
  }
  
  const stat = fs.statSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const types = {'.html':'text/html','.css':'text/css','.js':'application/javascript','.webp':'image/webp','.jpg':'image/jpeg','.ico':'image/x-icon','.woff2':'font/woff2'};
  
  res.writeHead(200, {
    'Content-Type': types[ext] || 'application/octet-stream',
    'Content-Length': stat.size,
    'Connection': 'keep-alive',
  });
  
  fs.createReadStream(filePath).pipe(res);
  console.log(`  200: ${filePath} (${stat.size} bytes)`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

server.on('close', () => {
  console.log('Server closing!');
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received');
  server.close();
});

process.on('exit', (code) => {
  console.log(`Process exiting with code ${code}`);
});

server.listen(3000, '0.0.0.0', () => {
  console.log('Debug server on port 3000');
});
