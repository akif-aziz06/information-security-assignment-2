# 🔐 CryptVault — Web-Based Text Encryption Tool

A premium single-page web application for encrypting, decrypting, and hashing text using multiple cryptographic algorithms. Built for the **Information Security (8th Semester)** course at Bahria University Lahore Campus.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![CryptoJS](https://img.shields.io/badge/CryptoJS-4.2.0-blue)

---

## ✨ Features

### Core Features
- **Text Encryption** — Enter plaintext, select an algorithm, and get ciphertext instantly
- **Text Decryption** — Reverse the process with the correct key
- **Hashing** — Generate one-way cryptographic hash digests (SHA-256, SHA-512, SHA-1, MD5)
- **Copy to Clipboard** — One-click copy for all output results
- **Input Validation** — Prevents empty inputs and ensures algorithm selection

### Supported Algorithms

| Algorithm | Type | Key Required | Security Level |
|-----------|------|:------------:|---------------|
| Caesar Cipher | Symmetric | No (shift=3) | 🔴 Low |
| AES-256 | Symmetric | Yes | 🟢 High |
| DES | Symmetric | Yes | 🟡 Medium |
| RSA (1024-bit) | Asymmetric | Auto-generated | 🟢 High |
| Base64 | Encoding | No | ⚪ None |
| SHA-256 | Hash | No | 🟢 High |
| SHA-512 | Hash | No | 🟢 High |
| SHA-1 | Hash | No | 🟡 Deprecated |
| MD5 | Hash | No | 🔴 Insecure |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Structure | HTML5 |
| Styling | Vanilla CSS (custom design system) |
| Logic | Vanilla JavaScript (ES6+) |
| Symmetric Encryption | [CryptoJS 4.2.0](https://github.com/brix/crypto-js) |
| Asymmetric Encryption | [JSEncrypt 3.3.2](https://github.com/nicktomlin/jsencrypt) |

---

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Edge, Safari)
- No server, build tools, or installation required

### Run Locally
1. Clone this repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/information-security-assignment-2.git
   ```
2. Open `index.html` in your browser — that's it!

Alternatively, use a local development server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .
```

---

## 📖 Encryption Techniques Explained

### 1. Caesar Cipher (Substitution Cipher)
The Caesar cipher shifts each letter in the plaintext by a fixed number of positions down the alphabet. In this implementation, a **shift of 3** is used (the historical default used by Julius Caesar). Non-alphabetic characters are preserved as-is.

- **Type:** Symmetric substitution cipher
- **Key Space:** 25 possible shifts
- **Security:** Trivially breakable via brute force or frequency analysis
- **Use Case:** Educational purposes only

### 2. AES-256 (Advanced Encryption Standard)
AES is a symmetric block cipher adopted as the U.S. federal encryption standard (FIPS 197). It operates on 128-bit blocks using key sizes of 128, 192, or 256 bits. This implementation uses **AES-256** via CryptoJS, which applies **PBKDF2** key derivation from the user's passphrase and **CBC mode** with **PKCS7 padding**.

- **Type:** Symmetric block cipher
- **Block Size:** 128 bits
- **Key Size:** 256 bits (derived from passphrase)
- **Security:** Considered unbreakable by brute force; approved for classified government data
- **Use Case:** Secure communication, file encryption, data-at-rest protection

### 3. DES (Data Encryption Standard)
DES is a legacy symmetric block cipher that encrypts data in 64-bit blocks using a 56-bit key. While historically significant (adopted as FIPS 46 in 1977), it is now considered **insecure** due to its short key length.

- **Type:** Symmetric block cipher
- **Block Size:** 64 bits
- **Key Size:** 56 bits (derived from passphrase via CryptoJS)
- **Security:** Vulnerable to brute-force attacks; superseded by AES
- **Use Case:** Legacy systems; educational demonstration

### 4. RSA (Rivest–Shamir–Adleman)
RSA is an asymmetric cryptosystem based on the computational difficulty of factoring large integers. A **1024-bit key pair** is auto-generated in the browser on page load. The public key encrypts and the private key decrypts.

- **Type:** Asymmetric (public-key) cipher
- **Key Size:** 1024-bit (demo); 2048+ recommended for production
- **Security:** High for appropriate key sizes
- **Limitation:** Can only encrypt data smaller than the key size (~117 bytes for 1024-bit)
- **Use Case:** Key exchange, digital signatures, secure email

### 5. Base64 Encoding
Base64 converts binary data to an ASCII text representation using 64 printable characters (A-Z, a-z, 0-9, +, /). It is **not encryption** — it provides no confidentiality.

- **Type:** Encoding scheme (not encryption)
- **Security:** None — trivially reversible
- **Use Case:** Data transport (email attachments, embedding data in URLs/JSON)

### 6. SHA-256 / SHA-512 (Secure Hash Algorithm)
Part of the SHA-2 family designed by the NSA. These are **one-way** cryptographic hash functions that produce a fixed-length digest from arbitrary input. Even a single bit change produces a completely different hash (avalanche effect).

- **SHA-256:** 256-bit (32-byte) output, used in Bitcoin and TLS
- **SHA-512:** 512-bit (64-byte) output, stronger variant
- **Properties:** Pre-image resistance, collision resistance, deterministic
- **Use Case:** Data integrity verification, digital signatures, password hashing

---

## 📁 Project Structure

```
information-security-assignment-2/
├── index.html      # Main HTML structure (UI)
├── styles.css      # Design system & responsive styles
├── app.js          # Encryption/decryption/hashing logic
└── README.md       # Project documentation
```

---

## 👤 Author

**Muhammad Akif Aziz**  
Bahria University Lahore Campus — 8th Semester  
Information Security Course — Assignment 2

---

## 📝 License

This project is created for academic purposes as part of the Information Security course curriculum.