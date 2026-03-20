//explain details in explain6.md

// KEY => 32 Bytes BASE64 -> convert into Buffer -> env -> BASE64 -> BUFFER
// IV => 16 Bytes Base64 -> convert into Buffer -> dynamic -> BUFFER

import crypto from "crypto";
import { config } from "dotenv";

config();

const algorithm = "aes-256-cbc";

const getCryptoMaterial = () => {
    const encryptionKey = process.env.ENCRYPTION_KEY;
    const encryptionIv = process.env.ENCRYPTION_IV;

    if (!encryptionKey) {
        throw new Error("Missing ENCRYPTION_KEY environment variable");
    }

    if (!encryptionIv) {
        throw new Error("Missing ENCRYPTION_IV environment variable");
    }

    const key = Buffer.from(encryptionKey, "base64");
    if (key.length !== 32) {
        throw new Error("Invalid ENCRYPTION_KEY. Expected 32-byte key encoded in base64");
    }

    if (encryptionIv.length !== 16) {
        throw new Error("Invalid ENCRYPTION_IV. Expected exactly 16 characters");
    }

    const iv = Buffer.from(encryptionIv, "utf-8");

    return { key, iv };
};

export const encryptData = (data: string) => {
    const { key, iv } = getCryptoMaterial();

    // convert plaintext to ciphertext
    const cipher = crypto.createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update(data, 'utf-8', 'hex');
    encrypted += cipher.final('hex');

    return encrypted;
}

export const decryptData = (encrypted: string) => {
    const { key, iv } = getCryptoMaterial();

    // convert ciphertext to plaintext
    const decipher = crypto.createDecipheriv(algorithm, key, iv);

    let decrypted = decipher.update(encrypted, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');

    return decrypted;
}