process.env.NODE_ENV = 'development';
require('dotenv').config();
const app = require('./src/app');
const http = require('http');

const server = app.listen(5001, () => {
  const options = {
    hostname: 'localhost',
    port: 5001,
    path: '/api/v1/auth/dev-login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  };
  
  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      console.log('Status:', res.statusCode);
      console.log('Response:', data);
      server.close();
    });
  });
  
  req.on('error', (e) => {
    console.error('Error:', e.message);
    server.close();
  });
  
  req.write(JSON.stringify({ role: 'admin' }));
  req.end();
});
