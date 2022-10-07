'use strict';
const fs = require('fs');
const filePath = process.argv[2];
const file = fs.readFileSync(filePath).toString().split('\n');
console.log(file[0] + '\n' + file[1]);
const md5_expected = file[2];
const data = Buffer.from(file[3], 'base64');
const md5_fact = Buffer.from(md5(data)).toString('base64');
if (md5_expected !== md5_fact)
{
	console.log('MD5 validation error!');
}
else
{
	fs.writeFileSync(file[1], data);
}

function md5(buffer)
{
	const data = new Uint8Array(buffer);
	const ABCD0 = new Uint32Array(4);
	ABCD0[0] = 0x67452301;
	ABCD0[1] = 0xefcdab89;
	ABCD0[2] = 0x98badcfe;
	ABCD0[3] = 0x10325476;

	const s1 = [7, 12, 17, 22];
	const s2 = [5, 9, 14, 20];
	const s3 = [4, 11, 16, 23];
	const s4 = [6, 10, 15, 21];
	const T = new Uint32Array([0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee, 0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501, 0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be, 0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821, 0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa, 0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8, 0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed, 0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a, 0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c, 0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70, 0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05, 0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665, 0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039, 0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1, 0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1, 0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391]);

	//Считаем размер сообщения
	let originalMessageSize = new BigUint64Array(1);
	originalMessageSize[0] = BigInt(data.length) * 8n;
	originalMessageSize = new Uint8Array(originalMessageSize.buffer);

	//Выравниваем сообщение
	let addToMessageSize = 64 - (data.length + 8) % 64;
	if (addToMessageSize === 0) addToMessageSize = 1;
	const newData = new Uint8Array(data.length + addToMessageSize + 8);
	for (let i = 0; i < data.length; i++)
	{
		newData[i] = data[i];
	}
	newData[data.length] = 128;
	for (let i = data.length + 1; i < newData.length - 8; i++)
	{
		newData[i] = 0;
	}
	for (let i = newData.length - 8; i < newData.length; i++)
	{
		newData[i] = originalMessageSize[i - newData.length + 8];
	}

	//Работем с сообщением
	const chunk = new Uint8Array(64);
	const chunk32 = new Uint32Array(chunk.buffer);
	const ABCDF = new Uint32Array(5);
	for (let i = 0; i < newData.length / 64; i++)
	{
		for (let j = 0; j < 64; j++)
		{
			chunk[j] = newData[i * 64 + j];
		}
		for (let j = 0; j < 4; j++)
		{
			ABCDF[j] = ABCD0[j];
		}
		let g = 0;
		let s;
		for (let j = 0; j < 64; j++)
		{
			if (0 <= j && j <= 15)
			{
				ABCDF[4] = (ABCDF[1] & ABCDF[2]) | ((~ABCDF[1]) & ABCDF[3]);
				g = j;
				s = s1;
			}
			else if (16 <= j && j <= 31)
			{
				ABCDF[4] = (ABCDF[3] & ABCDF[1]) | ((~ABCDF[3]) & ABCDF[2]);
				g = (5 * j + 1) % 16;
				s = s2;
			}
			else if (32 <= j && j <= 47)
			{
				ABCDF[4] = ABCDF[1] ^ ABCDF[2] ^ ABCDF[3];
				g = (3 * j + 5) % 16;
				s = s3;
			}
			else
			{
				ABCDF[4] = ABCDF[2] ^ (ABCDF[1] | (~ABCDF[3]));
				g = (7 * j) % 16;
				s = s4;
			}
			ABCDF[4] += ABCDF[0] + T[j] + chunk32[g];
			ABCDF[0] = ABCDF[3];
			ABCDF[3] = ABCDF[2];
			ABCDF[2] = ABCDF[1];
			ABCDF[1] += cycleLeftShift(ABCDF[4], s[j % 4]);
		}
		for (let j = 0; j < 4; j++)
		{
			ABCD0[j] += ABCDF[j];
		}
	}
	return ABCD0.buffer;

	function cycleLeftShift(data, n)
	{
		return (data << n) | (data >>> 32 - n);
	}
}