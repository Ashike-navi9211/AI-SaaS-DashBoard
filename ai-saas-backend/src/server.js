require('dotenv').config(); // must be FIRST line before any other require

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('DB connection failed', err);
  process.exit(1);
});
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err.stack);
});
