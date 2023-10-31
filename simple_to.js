'use strict';
const fs = require('fs');
const data = fs.readFileSync(process.argv[2]);
console.log(data.toString('base64'));