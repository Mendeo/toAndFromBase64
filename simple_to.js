'use strict';
const fs = require('fs');
const data = process.argv[2];
console.log(Buffer.from(data).toString('base64'));