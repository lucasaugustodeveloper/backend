require('dotenv').config();
const mongoose = require('mongoose');

mongoose
  .connect(
    `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`
  )
  .catch(() => {
    const msg = 'Instance of mongo not found!';
    console.error('\x1b[41m%s\x1b[37m', msg, '\x1b[0m');
  });
