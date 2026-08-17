import JSEncrypt from 'jsencrypt';

// 与 @jhlc/common-core 同源公钥（登录/改密 RSA 加密）
const publicKey = `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCKWOZ7hYPpIhJpXo
V91kA6b68lGbm+/fRhOtIT1u9Hm+onCLXRe/vCSVqSgSspQfHYKj2fY5VyYJPDXyDj5qp
SbrM9YxCWrtkL42X6HOENhAQTuYuDd/q85cj9e2nlm3/qmDY3Xa1hkcisIoF6itRYpNIucpnnqYt4wSCdTT/KLQIDAQAB`;

// 加密
export function encrypt(txt: string): string | null {
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(publicKey); // 设置公钥
  return encryptor.encrypt(txt); // 对数据进行加密
}
