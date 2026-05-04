/* ============================================
   CryptVault — Encryption Logic & App Controller
   Uses: CryptoJS (AES, DES, SHA), JSEncrypt (RSA)
   ============================================ */

// ─── Algorithm Metadata ─────────────────────
const ALGO_INFO = {
    caesar: {
        name: 'Caesar Cipher',
        desc: 'A substitution cipher where each letter is shifted by a fixed number (3) in the alphabet. One of the oldest known encryption techniques, used by Julius Caesar.',
        tags: [
            { label: 'Symmetric', cls: 'type-symmetric' },
            { label: 'Low Security', cls: 'security-low' }
        ],
        needsKey: false
    },
    aes: {
        name: 'AES-256',
        desc: 'The Advanced Encryption Standard (AES) is a symmetric block cipher chosen by the U.S. government. AES-256 uses a 256-bit key and is considered unbreakable by brute force.',
        tags: [
            { label: 'Symmetric', cls: 'type-symmetric' },
            { label: 'High Security', cls: 'security-high' }
        ],
        needsKey: true
    },
    des: {
        name: 'DES',
        desc: 'The Data Encryption Standard uses a 56-bit key to encrypt 64-bit blocks. Formerly a U.S. federal standard, now deprecated in favor of AES.',
        tags: [
            { label: 'Symmetric', cls: 'type-symmetric' },
            { label: 'Medium Security', cls: 'security-medium' }
        ],
        needsKey: true
    },
    rsa: {
        name: 'RSA',
        desc: 'RSA is an asymmetric algorithm using a public/private key pair. A key pair is auto-generated in your browser for demonstration purposes.',
        tags: [
            { label: 'Asymmetric', cls: 'type-asymmetric' },
            { label: 'High Security', cls: 'security-high' }
        ],
        needsKey: false
    },
    base64: {
        name: 'Base64',
        desc: 'Base64 is a binary-to-text encoding scheme. It is NOT encryption — it provides no security, but is useful for encoding binary data as ASCII text.',
        tags: [
            { label: 'Encoding', cls: 'type-encoding' },
            { label: 'No Security', cls: 'security-low' }
        ],
        needsKey: false
    }
};

// ─── RSA Key Pair (generated on page load) ──
let rsaPublicKey = '';
let rsaPrivateKey = '';

function generateRSAKeys() {
    const crypt = new JSEncrypt({ default_key_size: 1024 });
    crypt.getKey();
    rsaPublicKey = crypt.getPublicKey();
    rsaPrivateKey = crypt.getPrivateKey();
}

// ─── Background Particles ───────────────────
function initParticles() {
    const container = document.getElementById('bgParticles');
    const colors = ['#8b5cf6', '#06b6d4', '#f43f5e', '#10b981', '#f59e0b'];
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.animationDuration = (Math.random() * 20 + 15) + 's';
        particle.style.animationDelay = (Math.random() * 15) + 's';
        container.appendChild(particle);
    }
}

// ─── Tab Navigation ─────────────────────────
function initTabs() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = link.dataset.tab;

            // Update active nav link
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Update active panel
            document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
            document.getElementById('panel-' + tab).classList.add('active');
        });
    });
}

// ─── Character Counters ─────────────────────
function initCharCounters() {
    const pairs = [
        ['encryptInput', 'encryptCharCount'],
        ['decryptInput', 'decryptCharCount'],
        ['hashInput', 'hashCharCount']
    ];
    pairs.forEach(([inputId, countId]) => {
        const input = document.getElementById(inputId);
        const counter = document.getElementById(countId);
        if (input && counter) {
            input.addEventListener('input', () => {
                const len = input.value.length;
                counter.textContent = len + ' character' + (len !== 1 ? 's' : '');
            });
        }
    });
}

// ─── Algorithm Info Display ─────────────────
function initAlgoInfo() {
    const encAlgo = document.getElementById('encryptAlgorithm');
    encAlgo.addEventListener('change', () => {
        showAlgoInfo('encrypt', encAlgo.value);
        toggleKeyField('encrypt', encAlgo.value);
    });

    const decAlgo = document.getElementById('decryptAlgorithm');
    decAlgo.addEventListener('change', () => {
        toggleKeyField('decrypt', decAlgo.value);
    });
}

function showAlgoInfo(prefix, algo) {
    const info = ALGO_INFO[algo];
    const card = document.getElementById(prefix + 'AlgoInfo');
    if (!info || !card) return;

    document.getElementById(prefix + 'AlgoName').textContent = info.name;
    document.getElementById(prefix + 'AlgoDesc').textContent = info.desc;

    const tagsEl = document.getElementById(prefix + 'AlgoTags');
    tagsEl.innerHTML = '';
    info.tags.forEach(t => {
        const span = document.createElement('span');
        span.className = 'algo-tag ' + t.cls;
        span.textContent = t.label;
        tagsEl.appendChild(span);
    });

    card.style.display = 'block';
}

function toggleKeyField(prefix, algo) {
    const info = ALGO_INFO[algo];
    const keyGroup = document.getElementById(prefix + 'KeyGroup');
    if (keyGroup) {
        keyGroup.style.display = info && info.needsKey ? 'block' : 'none';
    }
}

// ─── Validation Helpers ─────────────────────
function showValidation(id, message, type) {
    const el = document.getElementById(id);
    el.className = 'validation-msg ' + type;
    const icon = type === 'error'
        ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'
        : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
    el.innerHTML = icon + ' ' + message;
}

function clearValidation(id) {
    const el = document.getElementById(id);
    el.className = 'validation-msg';
    el.innerHTML = '';
}

// ─── Caesar Cipher ──────────────────────────
function caesarEncrypt(text, shift = 3) {
    return text.split('').map(char => {
        if (char.match(/[a-z]/)) {
            return String.fromCharCode(((char.charCodeAt(0) - 97 + shift) % 26) + 97);
        }
        if (char.match(/[A-Z]/)) {
            return String.fromCharCode(((char.charCodeAt(0) - 65 + shift) % 26) + 65);
        }
        return char;
    }).join('');
}

function caesarDecrypt(text, shift = 3) {
    return caesarEncrypt(text, 26 - shift);
}

// ─── Encrypt Handler ────────────────────────
function handleEncrypt() {
    const input = document.getElementById('encryptInput').value.trim();
    const algo = document.getElementById('encryptAlgorithm').value;
    const key = document.getElementById('encryptKey').value;
    const validationId = 'encryptValidation';

    clearValidation(validationId);

    // Validation
    if (!input) {
        showValidation(validationId, 'Please enter some text to encrypt.', 'error');
        document.getElementById('encryptInput').focus();
        return;
    }
    if (!algo) {
        showValidation(validationId, 'Please select an encryption algorithm.', 'error');
        return;
    }
    if (ALGO_INFO[algo].needsKey && !key) {
        showValidation(validationId, 'This algorithm requires a secret key.', 'error');
        document.getElementById('encryptKey').focus();
        return;
    }

    let result = '';

    try {
        switch (algo) {
            case 'caesar':
                result = caesarEncrypt(input);
                break;
            case 'aes':
                result = CryptoJS.AES.encrypt(input, key).toString();
                break;
            case 'des':
                result = CryptoJS.DES.encrypt(input, key).toString();
                break;
            case 'rsa':
                const encryptor = new JSEncrypt();
                encryptor.setPublicKey(rsaPublicKey);
                result = encryptor.encrypt(input);
                if (!result) throw new Error('RSA encryption failed. Text may be too long for the key size.');
                break;
            case 'base64':
                result = btoa(unescape(encodeURIComponent(input)));
                break;
            default:
                throw new Error('Unknown algorithm');
        }
    } catch (err) {
        showValidation(validationId, 'Encryption error: ' + err.message, 'error');
        return;
    }

    // Show output
    document.getElementById('encryptOutput').textContent = result;
    const outputCard = document.getElementById('encryptOutputCard');
    outputCard.style.display = 'block';
    outputCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    showValidation(validationId, 'Encrypted successfully using ' + ALGO_INFO[algo].name + '!', 'success');
}

// ─── Decrypt Handler ────────────────────────
function handleDecrypt() {
    const input = document.getElementById('decryptInput').value.trim();
    const algo = document.getElementById('decryptAlgorithm').value;
    const key = document.getElementById('decryptKey').value;
    const validationId = 'decryptValidation';

    clearValidation(validationId);

    if (!input) {
        showValidation(validationId, 'Please enter the ciphertext to decrypt.', 'error');
        document.getElementById('decryptInput').focus();
        return;
    }
    if (!algo) {
        showValidation(validationId, 'Please select a decryption algorithm.', 'error');
        return;
    }
    if (ALGO_INFO[algo].needsKey && !key) {
        showValidation(validationId, 'This algorithm requires a secret key.', 'error');
        document.getElementById('decryptKey').focus();
        return;
    }

    let result = '';

    try {
        switch (algo) {
            case 'caesar':
                result = caesarDecrypt(input);
                break;
            case 'aes':
                const aesBytes = CryptoJS.AES.decrypt(input, key);
                result = aesBytes.toString(CryptoJS.enc.Utf8);
                if (!result) throw new Error('Decryption failed. Check your key and ciphertext.');
                break;
            case 'des':
                const desBytes = CryptoJS.DES.decrypt(input, key);
                result = desBytes.toString(CryptoJS.enc.Utf8);
                if (!result) throw new Error('Decryption failed. Check your key and ciphertext.');
                break;
            case 'rsa':
                const decryptor = new JSEncrypt();
                decryptor.setPrivateKey(rsaPrivateKey);
                result = decryptor.decrypt(input);
                if (!result) throw new Error('RSA decryption failed. Make sure you are using ciphertext from this session.');
                break;
            case 'base64':
                result = decodeURIComponent(escape(atob(input)));
                break;
            default:
                throw new Error('Unknown algorithm');
        }
    } catch (err) {
        showValidation(validationId, 'Decryption error: ' + err.message, 'error');
        return;
    }

    document.getElementById('decryptOutput').textContent = result;
    const outputCard = document.getElementById('decryptOutputCard');
    outputCard.style.display = 'block';
    outputCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    showValidation(validationId, 'Decrypted successfully using ' + ALGO_INFO[algo].name + '!', 'success');
}

// ─── Hash Handler ───────────────────────────
function handleHash() {
    const input = document.getElementById('hashInput').value.trim();
    const algo = document.getElementById('hashAlgorithm').value;
    const validationId = 'hashValidation';

    clearValidation(validationId);

    if (!input) {
        showValidation(validationId, 'Please enter some text to hash.', 'error');
        document.getElementById('hashInput').focus();
        return;
    }
    if (!algo) {
        showValidation(validationId, 'Please select a hash algorithm.', 'error');
        return;
    }

    let result = '';
    let algoName = '';

    switch (algo) {
        case 'sha256':
            result = CryptoJS.SHA256(input).toString();
            algoName = 'SHA-256';
            break;
        case 'sha512':
            result = CryptoJS.SHA512(input).toString();
            algoName = 'SHA-512';
            break;
        case 'sha1':
            result = CryptoJS.SHA1(input).toString();
            algoName = 'SHA-1';
            break;
        case 'md5':
            result = CryptoJS.MD5(input).toString();
            algoName = 'MD5';
            break;
    }

    document.getElementById('hashOutput').textContent = result;
    const outputCard = document.getElementById('hashOutputCard');
    outputCard.style.display = 'block';
    outputCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    showValidation(validationId, 'Hash generated using ' + algoName + '!', 'success');
}

// ─── Copy to Clipboard ─────────────────────
function copyOutput(elementId) {
    const text = document.getElementById(elementId).textContent;
    navigator.clipboard.writeText(text).then(() => {
        // Show tooltip
        const btn = document.getElementById(elementId.replace('Output', '') === 'encrypt'
            ? 'copyEncryptBtn'
            : elementId.replace('Output', '') === 'decrypt'
                ? 'copyDecryptBtn'
                : 'copyHashBtn');
        const tooltip = btn.querySelector('.copy-tooltip');
        tooltip.classList.add('show');
        setTimeout(() => tooltip.classList.remove('show'), 1500);
    });
}

// ─── Initialization ─────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initTabs();
    initCharCounters();
    initAlgoInfo();
    generateRSAKeys();

    // Hide key fields initially
    document.getElementById('encryptKeyGroup').style.display = 'none';
    document.getElementById('decryptKeyGroup').style.display = 'none';
});
