// ─── CIPHER ALGORITHMS ───────────────────────────────────────

const A = 65;
export const cleanText = (s) => s.toUpperCase().replace(/[^A-Z]/g, "");

// ─── HELPERS ─────────────────────────────────────────────────
export function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

export function modInverse(a, m) {
  for (let x = 1; x < m; x++) if ((a * x) % m === 1) return x;
  return -1;
}

// ─── 1. VIGENÈRE ─────────────────────────────────────────────
export function vigEncrypt(text, key) {
  const k = cleanText(key);
  if (!k) throw new Error("Kunci tidak boleh kosong");
  let result = "",
    ki = 0;
  for (const ch of text) {
    if (/[A-Za-z]/.test(ch)) {
      const isUp = ch === ch.toUpperCase();
      const p = ch.toUpperCase().charCodeAt(0) - A;
      const kc = k.charCodeAt(ki % k.length) - A;
      const c = (p + kc) % 26;
      result += String.fromCharCode(c + A + (isUp ? 0 : 32));
      ki++;
    } else result += ch;
  }
  return result;
}

export function vigDecrypt(text, key) {
  const k = cleanText(key);
  if (!k) throw new Error("Kunci tidak boleh kosong");
  let result = "",
    ki = 0;
  for (const ch of text) {
    if (/[A-Za-z]/.test(ch)) {
      const isUp = ch === ch.toUpperCase();
      const c = ch.toUpperCase().charCodeAt(0) - A;
      const kc = k.charCodeAt(ki % k.length) - A;
      const p = (c - kc + 26) % 26;
      result += String.fromCharCode(p + A + (isUp ? 0 : 32));
      ki++;
    } else result += ch;
  }
  return result;
}

// ─── 2. AFFINE ───────────────────────────────────────────────
export function affEncrypt(text, a, b) {
  if (gcd(a, 26) !== 1)
    throw new Error(
      `a=${a} tidak koprima dengan 26. Pilih: 1,3,5,7,9,11,15,17,19,21,23,25`,
    );
  let result = "";
  for (const ch of text) {
    if (/[A-Za-z]/.test(ch)) {
      const isUp = ch === ch.toUpperCase();
      const x = ch.toUpperCase().charCodeAt(0) - A;
      const c = (a * x + b) % 26;
      result += String.fromCharCode(c + A + (isUp ? 0 : 32));
    } else result += ch;
  }
  return result;
}

export function affDecrypt(text, a, b) {
  if (gcd(a, 26) !== 1) throw new Error(`a=${a} tidak koprima dengan 26`);
  const aInv = modInverse(a, 26);
  let result = "";
  for (const ch of text) {
    if (/[A-Za-z]/.test(ch)) {
      const isUp = ch === ch.toUpperCase();
      const y = ch.toUpperCase().charCodeAt(0) - A;
      const p = (aInv * (y - b + 26)) % 26;
      result += String.fromCharCode(p + A + (isUp ? 0 : 32));
    } else result += ch;
  }
  return result;
}

// ─── 3. PLAYFAIR ─────────────────────────────────────────────
export function buildPlayfairGrid(key) {
  const seen = new Set();
  const grid = [];
  const src = (key + "ABCDEFGHIKLMNOPQRSTUVWXYZ")
    .toUpperCase()
    .replace(/J/g, "I");
  for (const ch of src) {
    if (/[A-Z]/.test(ch) && !seen.has(ch)) {
      seen.add(ch);
      grid.push(ch);
    }
  }
  return grid;
}

function pfPos(grid, ch) {
  const i = grid.indexOf(ch === "J" ? "I" : ch);
  return [Math.floor(i / 5), i % 5];
}

function prepPF(text) {
  let t = cleanText(text).replace(/J/g, "I");
  let out = "";
  let i = 0;
  while (i < t.length) {
    out += t[i];
    if (i + 1 < t.length) {
      if (t[i] === t[i + 1]) out += "X";
      else {
        out += t[i + 1];
        i++;
      }
    }
    i++;
  }
  if (out.length % 2 !== 0) out += "X";
  return out;
}

export function playfairProcess(text, key, encrypt) {
  if (!key) throw new Error("Kunci tidak boleh kosong");
  const grid = buildPlayfairGrid(key);
  const prepared = encrypt ? prepPF(text) : cleanText(text).replace(/J/g, "I");
  if (prepared.length % 2 !== 0 && !encrypt)
    throw new Error("Panjang cipherteks harus genap");
  let result = "";
  for (let i = 0; i < prepared.length; i += 2) {
    const a = prepared[i],
      b = prepared[i + 1] || "X";
    const [r1, c1] = pfPos(grid, a);
    const [r2, c2] = pfPos(grid, b);
    if (r1 === r2) {
      result += grid[r1 * 5 + (encrypt ? (c1 + 1) % 5 : (c1 + 4) % 5)];
      result += grid[r2 * 5 + (encrypt ? (c2 + 1) % 5 : (c2 + 4) % 5)];
    } else if (c1 === c2) {
      result += grid[(encrypt ? (r1 + 1) % 5 : (r1 + 4) % 5) * 5 + c1];
      result += grid[(encrypt ? (r2 + 1) % 5 : (r2 + 4) % 5) * 5 + c2];
    } else {
      result += grid[r1 * 5 + c2];
      result += grid[r2 * 5 + c1];
    }
  }
  return result;
}

// ─── 4. HILL (2×2) ───────────────────────────────────────────
export function hillDet(K) {
  return (((K[0][0] * K[1][1] - K[0][1] * K[1][0]) % 26) + 26) % 26;
}

export function hillInverse(K) {
  const det = hillDet(K);
  const di = modInverse(det, 26);
  if (di === -1) return null;
  return [
    [(((K[1][1] * di) % 26) + 26) % 26, (((-K[0][1] * di) % 26) + 26) % 26],
    [(((-K[1][0] * di) % 26) + 26) % 26, (((K[0][0] * di) % 26) + 26) % 26],
  ];
}

function hillApply(text, K) {
  let t = cleanText(text);
  if (t.length % 2 !== 0) t += "X";
  let result = "";
  for (let i = 0; i < t.length; i += 2) {
    const v0 = t.charCodeAt(i) - A,
      v1 = t.charCodeAt(i + 1) - A;
    result += String.fromCharCode(((K[0][0] * v0 + K[0][1] * v1) % 26) + A);
    result += String.fromCharCode(((K[1][0] * v0 + K[1][1] * v1) % 26) + A);
  }
  return result;
}

export function hillEncrypt(text, K) {
  const det = hillDet(K);
  if (gcd(det, 26) !== 1)
    throw new Error(
      `det(K)=${det} tidak koprima dengan 26. Ganti matriks kunci.`,
    );
  return hillApply(text, K);
}

export function hillDecrypt(text, K) {
  const det = hillDet(K);
  if (gcd(det, 26) !== 1)
    throw new Error(`det(K)=${det} tidak koprima dengan 26.`);
  const Ki = hillInverse(K);
  if (!Ki) throw new Error("Matriks tidak bisa diinvers mod 26!");
  return hillApply(text, Ki);
}

// ─── 5. ENIGMA ───────────────────────────────────────────────
const ROTORS = [
  { wiring: "EKMFLGDQVZNTOWYHXUSPAIBRCJ", notch: "Q" }, // Rotor I
  { wiring: "AJDKSIRUXBLHWTMCQGZNPYFVOE", notch: "E" }, // Rotor II
  { wiring: "BDFHJLCPRTXVZNYEIWGAKMUSQO", notch: "V" }, // Rotor III
];
const REFLECTOR_B = "YRUHQSLDPXNGOKMIEBFZCWVJAT";

function enigmaChar(ch, pos) {
  let c = ch.charCodeAt(0) - A;

  // Pasang kabel dari kanan ke kiri (Rotor III -> II -> I)
  for (let r = 2; r >= 0; r--) {
    const off = pos[r];
    const w = ROTORS[r].wiring;
    c = (w.charCodeAt((c + off) % 26) - A - off + 26) % 26;
  }

  // Reflektor
  c = REFLECTOR_B.charCodeAt(c) - A;

  // Kembali dari kiri ke kanan (Rotor I -> II -> III)
  for (let r = 0; r <= 2; r++) {
    const off = pos[r];
    const w = ROTORS[r].wiring;
    // Mencari indeks karakter yang sesuai (inverse wiring)
    const targetChar = String.fromCharCode(((c + off) % 26) + A);
    c = (w.indexOf(targetChar) - off + 26) % 26;
  }

  return String.fromCharCode(c + A);
}

export function enigmaProcess(text, rotorSettings) {
  // Ubah karakter rotor ['A','A','A'] menjadi angka [0,0,0]
  let pos = rotorSettings.map((r) => r.charCodeAt(0) - 65);
  let result = "";

  for (let char of text.toUpperCase()) {
    if (/[A-Z]/.test(char)) {
      // Mekanisme perputaran rotor (Stepping) sebelum enkripsi satu huruf
      // Rotor III (Indeks 2) selalu berputar setiap huruf
      pos[2] = (pos[2] + 1) % 26;

      // Notch logic sederhana (tambahkan double-stepping jika perlu sesuai spesifikasi)
      if (pos[2] === ROTORS[2].notch.charCodeAt(0) - 65)
        pos[1] = (pos[1] + 1) % 26;
      if (pos[1] === ROTORS[1].notch.charCodeAt(0) - 65)
        pos[0] = (pos[0] + 1) % 26;

      result += enigmaChar(char, pos);
    } else {
      result += char;
    }
  }
  return result;
}