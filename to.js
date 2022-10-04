'use strict';
const fs = require('fs');
const path = require('path');
const filePath = process.argv[2];
const file = fs.readFileSync(filePath);
const fileName = path.basename(filePath);
const dateTime = new Date();
console.log(filePath);

const data = dateTime.toString() + '\n' + fileName + '\n' + file.toString('base64');

fs.writeFileSync('out.txt', data);
