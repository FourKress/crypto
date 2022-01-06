const crypto = require('crypto');

const algorithm = 'aes-256-gcm';
const secretKey = 'B478E8358F3444769CB2D43B70197892';
const iv = crypto.randomBytes(16);
let tag = '';

const encrypt = (text) => {

  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  tag = cipher.getAuthTag()
  console.log(tag)
  return {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex')
  };
};

const decrypt = (hash) => {
  console.log(hash)
  const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'));
  console.log(Buffer.from(tag.toString('hex'), 'hex'))
  decipher.setAuthTag(tag)
  const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);

  return decrpyted.toString();
};

// const hash = encrypt('Hello World!');
//
// console.log(hash);
// //
// const text = decrypt(hash);
//
// console.log(text);


const decode = (resource) => {
  // const { ciphertext, associated_data, nonce } = resource;
  // const cipher = Buffer.from(ciphertext, 'base64');
  // // 解密ciphertext，AEAD_AES_256_GCM算法
  // const authTag = cipher.slice(cipher.length - 16); // Tag长度16
  // const data = cipher.slice(0, cipher.length - 16);
  // const decipher = crypto.createDecipheriv('AES-256-GCM', secretKey, nonce);
  // decipher.setAuthTag(authTag);
  // decipher.setAAD(Buffer.from(associated_data));
  // const decoded = decipher.update(data, undefined, 'utf8');
  // decipher.final();
  // // return JSON.parse(decoded);
  // console.log(JSON.parse(decoded))

  const AUTH_KEY_LENGTH = 16;
  // ciphertext = 密文，associated_data = 填充内容， nonce = 位移
  const { ciphertext, associated_data, nonce } = resource;
  // 密钥
  const key_bytes = Buffer.from(secretKey, 'utf8');
  // 位移
  const nonce_bytes = Buffer.from(nonce, 'utf8');
  // 填充内容
  const associated_data_bytes = Buffer.from(associated_data, 'utf8');
  // 密文Buffer
  const ciphertext_bytes = Buffer.from(ciphertext, 'base64');
  // 计算减去16位长度
  const cipherdata_length = ciphertext_bytes.length - AUTH_KEY_LENGTH;
  // upodata
  const cipherdata_bytes = ciphertext_bytes.slice(0, cipherdata_length);
  // tag
  // const auth_tag_bytes = ciphertext_bytes.slice(cipherdata_length, ciphertext_bytes.length);
  const auth_tag_bytes = ciphertext_bytes.subarray(ciphertext_bytes.length - 16);

  console.log(ciphertext_bytes.length , AUTH_KEY_LENGTH)
  console.log(ciphertext_bytes, )
  console.log(key_bytes, )
  console.log(nonce_bytes, )
  console.log(associated_data_bytes, )
  console.log(cipherdata_bytes, )
  console.log(auth_tag_bytes)

  const decipher = crypto.createDecipheriv(
    'aes-256-gcm', key_bytes, nonce_bytes
  );
  decipher.setAuthTag(auth_tag_bytes);
  decipher.setAAD(Buffer.from(associated_data_bytes));

  const output = Buffer.concat([
    decipher.update(ciphertext_bytes.subarray(0, ciphertext_bytes.length - 16).toString(), 'utf8'),
    decipher.final(),
  ]);
  console.log(output)


  // const { ciphertext, associated_data, nonce } = resource;
  //
  // const encrypted = Buffer.from(ciphertext, 'base64')
  //
  // const key = Buffer.from(secretKey, 'utf8');
  //
  // let decipher = crypto.createDecipheriv('AES-256-GCM', key, Buffer.from(nonce, 'utf8'))
  //
  // decipher.setAuthTag(encrypted.slice(-12))
  // decipher.setAAD(Buffer.from(associated_data))
  // console.log(decipher.update(encrypted.slice(0, -12)).toString())
  // decipher.update(encrypted.slice(0, -16)),
    // decipher.final()

  // let output = Buffer.concat([
  //
  // ])
  //
  // console.log(output.toString())

}

decode({
  "original_type": "transaction",
  "algorithm": "AEAD_AES_256_GCM",
  "ciphertext": "ZiKJZCqFOSEq5zKoI1+aMgaXig5uzh9S681DYJrHungPc3kvD+2w25Tm+elItbM09E2fVvdycj4LnGux3nXtrWokqgGf45EfZvcVUO2a6tN8MH0lsgApSxj1Zb0s7bekEHMU3Q7qWntZXjBZOKvBNYeh4c0xzSFGxzb0IZF7XYLfKu81I7HLJNvaOAn1EQPIiqIBezl9UaMiQ8n6AaWiHPLuyT/DJGHcbHJGvwyDJW3BGXlVH8++zfYkVeHE/IlCPE69HlRnMisMtZ8yp1Hhatv6JiZHOao6jbcmHv614d2ne3lCNpu8uxAclZU39A/s6Zesa71uUthsqdxH3qZSuDVZ+0WF+hMutGr6e/Qc1rXULeZmw6lR+BE+dA9PMjjjPCvBz/ijn/7RGvni/VdatdZfxr38H/AvEp6AsiCEhVPvmhJDDr5XRbeLLjB27UDkykuDyi8oFmKk27T8VjeMXZIdbpRTrIajbQd/IxeG3XUtjrMie7hc04WaK/0Uh631nLP+tdgTXLZHn9tHu4eyffLEVbePtdgo8ifyKtkyrI2g+lEvRGk2fcik1ZeeqF/+1mUzcw==",
  "associated_data": "transaction",
  "nonce": "tHeq4wJkYTgy"
})
