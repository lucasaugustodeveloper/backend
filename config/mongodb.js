const mongoose = require('mongoose');

mongoose.connect('mongodb://root:example@localhost:27017').catch(() => {
  const msg = 'Instance of mongo not found!';
  console.error('\x1b[41m%s\x1b[37m', msg, '\x1b[0m');
});
