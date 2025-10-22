//explain details in explain6.md

// KEY => 32 Bytes BASE64 -> convert into Buffer -> env -> BASE64 -> BUFFER
// IV => 16 Bytes Base64 -> convert into Buffer -> dynamic -> BUFFER

import crypto from "crypto";
import { config } from "dotenv";

config();

const key = Buffer.from(process.env.ENCRYPTION_KEY!, "base64");
const iv = Buffer.from(process.env.ENCRYPTION_IV || "1234567890123456", "utf-8"); // Fixed IV for consistent encryption/decryption
const algorithm = "aes-256-cbc";

export const encryptData = (data: string) => {
    // convert plaintext to ciphertext
    const cipher = crypto.createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update(data, 'utf-8', 'hex');
    encrypted += cipher.final('hex');

    return encrypted;
}

export const decryptData = (encrypted: string) => {
    // convert ciphertext to plaintext
    const decipher = crypto.createDecipheriv(algorithm, key, iv);

    let decrypted = decipher.update(encrypted, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');

    return decrypted;
}