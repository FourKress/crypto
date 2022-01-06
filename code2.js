let crypto = require('crypto');

//偏移量 16位
const iv = "tHeq4wJkYTgy";
//密钥
const key = "B478E8358F3444769CB2D43B70197892";


//加密
function encodeAes(word) {

  if (!word) {

    return ''
  }
  if (typeof word != 'string') {

    word = JSON.stringify(word)
  }

  const md5 = crypto.createHash('md5');
  const result = md5.update(key).digest();
  const cipher = crypto.createCipheriv('aes-128-gcm', result, iv);
  const encrypted = cipher.update(word, 'utf8');
  const finalstr = cipher.final();
  const tag = cipher.getAuthTag();
  const res = Buffer.concat([encrypted, finalstr, tag]);
  return res.toString('base64');
}

//解密
function decodeAes(word) {

  if (!word) {

    return ''
  }
  const md5 = crypto.createHash('md5');
  const result = md5.update(key).digest();
  const decipher = crypto.createDecipheriv('aes-128-gcm', result, iv);
  const b = Buffer.from(word, 'base64')
  decipher.setAuthTag(b.subarray(b.length - 16));
  const str = decipher.update(Buffer.from(b.subarray(0, b.length - 16), 'hex'));
  const fin = decipher.final();
  const decryptedStr = new TextDecoder('utf8').decode(Buffer.concat([str, fin]))
  try {

    return JSON.parse(decryptedStr);
  } catch (e) {

    return decryptedStr
  }
}


let encodeStr = encodeAes('hello word');
console.log('加密后：' + encodeStr);
let decodeStr = decodeAes('ZiKJZCqFOSEq5zKoI1+aMgaXig5uzh9S681DYJrHungPc3kvD+2w25Tm+elItbM09E2fVvdycj4LnGux3nXtrWokqgGf45EfZvcVUO2a6tN8MH0lsgApSxj1Zb0s7bekEHMU3Q7qWntZXjBZOKvBNYeh4c0xzSFGxzb0IZF7XYLfKu81I7HLJNvaOAn1EQPIiqIBezl9UaMiQ8n6AaWiHPLuyT/DJGHcbHJGvwyDJW3BGXlVH8++zfYkVeHE/IlCPE69HlRnMisMtZ8yp1Hhatv6JiZHOao6jbcmHv614d2ne3lCNpu8uxAclZU39A/s6Zesa71uUthsqdxH3qZSuDVZ+0WF+hMutGr6e/Qc1rXULeZmw6lR+BE+dA9PMjjjPCvBz/ijn/7RGvni/VdatdZfxr38H/AvEp6AsiCEhVPvmhJDDr5XRbeLLjB27UDkykuDyi8oFmKk27T8VjeMXZIdbpRTrIajbQd/IxeG3XUtjrMie7hc04WaK/0Uh631nLP+tdgTXLZHn9tHu4eyffLEVbePtdgo8ifyKtkyrI2g+lEvRGk2fcik1ZeeqF/+1mUzcw==');
console.log('解密后：' + decodeStr);
