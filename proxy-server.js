const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Proxy API calls to backend
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:4000',
  changeOrigin: true,
}));

// Proxy everything else to frontend
app.use('/', createProxyMiddleware({
  target: 'http://localhost:3000',
  changeOrigin: true,
  ws: true, // Enable websockets for hot reload
}));

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
  console.log(`Frontend: http://localhost:3000 -> http://localhost:${PORT}`);
  console.log(`Backend: http://localhost:4000 -> http://localhost:${PORT}/api`);
});
