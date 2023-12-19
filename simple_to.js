'use strict';
const fs = require('fs');
const data = fs.readFileSync(process.argv[2]);
fs.writeFileSync('base64.txt', data.toString('base64'));