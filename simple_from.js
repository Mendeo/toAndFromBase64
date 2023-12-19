'use strict';
const fs = require('fs');
const data = fs.readFileSync(process.argv[2]).toString().split('\n')[0].replace(/\r/g, '');
fs.writeFileSync('data', Buffer.from(data, 'base64'));