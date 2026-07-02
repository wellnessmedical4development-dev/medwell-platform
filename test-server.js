require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const app = require('./src/app');

console.log('NODE_ENV:', process.env.NODE_ENV);

app.listen(5004, () => {
  console.log('Server on 5004');
  const http = require('http');
  const req = http.request({
    hostname: 'localhost', port: 5004,
    path: '/api/v1/auth/dev-login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, (res) => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => {
      console.log('Status:', res.statusCode, 'Body:', data);
      process.exit(0);
    });
  });
  req.on('error', e => { console.error(e); process.exit(1); });
  req.write(JSON.stringify({ role: 'admin' }));
  req.end();
});
