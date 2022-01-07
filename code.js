const crypto = require("crypto");

function decode(resource) {
  const { ciphertext, associated_data, nonce } = resource;
  const decipherIv = crypto.createDecipheriv('aes-256-gcm', '372FD9C0D34B4397A06FBF7C36855CEB', nonce);
  const ciphertextBuffer = Buffer.from(ciphertext, 'base64');

  const authTag = ciphertextBuffer.slice(ciphertextBuffer.length - 16)
  const data = ciphertextBuffer.slice(0, ciphertextBuffer.length - 16)
  decipherIv.setAuthTag(authTag)
  decipherIv.setAAD(Buffer.from(associated_data))
  const decryptStr = decipherIv.update(data, null, 'utf8')
  decipherIv.final()
  return JSON.parse(decryptStr.toString())
}

console.log(decode({
  "original_type": "transaction",
  "algorithm": "AEAD_AES_256_GCM",
  "ciphertext": "X8wZh2aUzXXLPYNc3oU2fd/bOjMJ0mOJuv5puvPiUbk4DqQxXOGbchWOHYx9DB29bO8q5YuVTEo0fIfT5pKDgfSO2KctM2t17t6Hd7Q3smuW48l/ludUTINv3uCIT8LzQvg+p5tQk1sCDQiwQ2CEHG2k6MmY5UjMDhAot1d+y+u/KyHcUxvM0/CCi+sA+lHR+GfBfTl4cnGSwDDyGG90+MJwBi0lCX0PXFDlnD5HfBJEcrfrbHfqv5d5SVWJTlTf6tRB+h6AwHcg09VKrlXmDQJ17tFMNunPQveW7uEeZdT7YJxXHxMG6/gsLsraNWKXThhH0xWBMv5ewKzgyrwOmOZA9Z4bgnG6qtP1Zg7C7swlakPvREwvCPxsRtsyOtp96kl//w8yUPVPjmiEVNxAZ5rACvOc+CbwXjy2e6JxWzU89QNJu/wUl0tBpAM3CL4lBg++YapZRHDOCnyam1jyKiIOdlNihieL+uoNpU/gpVWnnzNn5vdcBKDh9oIUbgIlXoZwX1UaabiVvQyesR0RSIoEAgPDf0+m4lrpxrpxeh+ugmExD6If5PUNZdXqpmylM4VVNSeRqw==",
  "associated_data": "transaction",
  "nonce": "BGJMODdi3MeO"
}))

