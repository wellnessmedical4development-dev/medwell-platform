process.env.NODE_ENV = 'development';
require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const app = require('./src/app');
const http = require('http');
const jwt = require('jsonwebtoken');

const token = jwt.sign(
  { id: 'dev-user-id', role: 'admin', phone: '+212600000001' },
  process.env.JWT_SECRET || 'medwell_dev_jwt_secret_key_change_in_production',
  { expiresIn: '1h' }
);

const server = app.listen(5003, () => {
  const postData = JSON.stringify({ amount: 500, currency: 'MAD', payment_method: 'card' });
  const options = {
    hostname: 'localhost',
    port: 5003,
    path: '/api/v1/payments/initiate',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token, 'Content-Length': Buffer.byteLength(postData) }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      console.log('Status:', res.statusCode);
      console.log('Response:', JSON.parse(data));
      server.close();
    });
  });

  req.on('error', (e) => { console.error('Error:', e.message); server.close(); });
  req.write(postData);
  req.end();
});
