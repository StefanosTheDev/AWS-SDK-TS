import app from './app';

const PORT = Number(process.env.PORT) || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const dbUrl =
  process.env.NODE_ENV === 'production'
    ? process.env.DATABASE_URL_PROD
    : process.env.DATABASE_URL;

console.log('=========================================');
console.log(`🚀 Running in ${NODE_ENV.toUpperCase()} mode`);
console.log(`📡 Connected to Database: ${dbUrl}`);
console.log(`🌍 Server is running on http://0.0.0.0:${PORT}`);
console.log('=========================================');

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server is up and running on http://0.0.0.0:${PORT}`);
});
