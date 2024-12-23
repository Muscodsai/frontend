import crypto from "crypto";

export function SHA256(data: string): string {
    const hash = crypto.createHash('sha256');
    hash.update(data);
    return hash.digest('hex');
}

/*
function deriveKey(pwd: string, salt: string): Buffer {
    return crypto.pbkdf2Sync(pwd, salt, 100000, 32, 'sha256');
}
export function encrypt(rawData) {
    const pwd = SHA256(rawData.password), iv = crypto.randomBytes(16), salt = crypto.randomBytes(16);
    const key = deriveKey(rawData.password, salt);
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    const encrypted = cipher.update(JSON.stringify(rawData), 'utf8', 'hex') + cipher.final('hex');
    return {body: encrypted, pwd: pwd, iv: iv, salt: salt};
}

export function decrypt(encryptedData, pwd) {
    if (SHA256(pwd) !== encryptedData.pwd) {
        throw new Error("Incorrect pwd");
    }
    const iv = Buffer.from(encryptedData.iv.buffer), salt = Buffer.from(encryptedData.salt.buffer);
    const key = deriveKey(pwd, salt);
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
    let decrypted = decipher.update(encryptedData.body, 'hex', 'utf8') + decipher.final('utf8');
    return JSON.parse(decrypted);
}
*/