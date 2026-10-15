
import 'dotenv/config';
import cloudinary from './config/cloudinary.js';
import dns from 'node:dns';
import https from 'node:https';

console.log('Cloud name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('DNS servers:', dns.getServers());

const request = https.get(
  'https://api.cloudinary.com',
  (response) => {
    console.log('HTTPS status:', response.statusCode);
    response.resume();
  }
);

request.setTimeout(10000, () => {
  console.error('HTTPS request timed out');
  request.destroy();
});

request.on('error', (error) => {
  console.error('HTTPS network error:', error);
  console.error('Cause:', error.cause);
});

try {
  const result = await cloudinary.api.ping();
  console.log('Cloudinary ping successful:', result);
} catch (error) {
  console.error('Cloudinary error:', error);
  console.error('Error cause:', error.cause);
  console.error('Aggregate errors:', error.errors);
}
