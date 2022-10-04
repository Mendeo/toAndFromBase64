'use strict';
const fs = require('fs');
const filePath = process.argv[2];
const file = fs.readFileSync(filePath).toString().split('\n');
console.log(file[0] + '\n' + file[1]);
const data = Buffer.from(file[2], 'base64');
fs.writeFileSync(file[1], data);
