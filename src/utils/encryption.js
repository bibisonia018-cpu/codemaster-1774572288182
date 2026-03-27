import CryptoJS from 'crypto-js';

// دالة تشفير الرسالة
export const encryptMessage = (message, secretKey) => {
  return CryptoJS.AES.encrypt(message, secretKey).toString();
};

// دالة فك تشفير الرسالة
export const decryptMessage = (ciphertext, secretKey) => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    
    // إذا كان المفتاح خاطئاً، ستكون النتيجة فارغة
    if (!originalText) throw new Error("مفتاح خاطئ");
    return originalText;
  } catch (error) {
    return "🔒 [رسالة مشفرة - المفتاح السري غير متطابق]";
  }
};