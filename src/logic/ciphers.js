const A = 65;
export const cleanText = (s) => s.toUpperCase().replace(/[^A-Z]/g, "");

// ─── HELPERS ─────────────────────────────────────────────────
export function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

export function modInverse(a, m) {
  a = ((a % m) + m) % m;
  for (let x = 1; x < m; x++) if ((a * x) % m === 1) return x;
  return -1;
}

// ─── 1. VIGENÈRE (Preserve Case) ──────────────────────────────
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
    throw new Error(`Nilai 'a' (${a}) harus koprima dengan 26.`);
  return text.replace(/[a-zA-Z]/g, (ch) => {
    const isUp = ch === ch.toUpperCase();
    const x = ch.toUpperCase().charCodeAt(0) - A;
    const c = (a * x + b) % 26;
    return String.fromCharCode(c + A + (isUp ? 0 : 32));
  });
}

export function affDecrypt(text, a, b) {
  const aInv = modInverse(a, 26);
  if (aInv === -1)
    throw new Error(`Nilai 'a' (${a}) tidak memiliki invers mod 26.`);
  return text.replace(/[a-zA-Z]/g, (ch) => {
    const isUp = ch === ch.toUpperCase();
    const y = ch.toUpperCase().charCodeAt(0) - A;
    const p = (aInv * (y - b + 26)) % 26;
    return String.fromCharCode(p + A + (isUp ? 0 : 32));
  });
}

// ─── 3. PLAYFAIR (Improved Prep) ─────────────────────────────
export function buildPlayfairGrid(key) {
  const seen = new Set();
  const grid = [];
  const src = (cleanText(key) + "ABCDEFGHIKLMNOPQRSTUVWXYZ").replace(/J/g, "I");
  for (const ch of src) {
    if (!seen.has(ch)) {
      seen.add(ch);
      grid.push(ch);
    }
  }
  return grid;
}

function prepPF(text) {
  let t = cleanText(text).replace(/J/g, "I");
  let out = "";
  for (let i = 0; i < t.length; i++) {
    out += t[i];
    if (i < t.length - 1) {
      if (t[i] === t[i + 1]) {
        out += t[i] === "X" ? "Q" : "X"; // Jika XX maka XQX
      } else {
        out += t[++i];
      }
    }
  }
  if (out.length % 2 !== 0) out += "X";
  return out;
}

export function playfairProcess(text, key, encrypt) {
  const grid = buildPlayfairGrid(key);
  const prepared = encrypt ? prepPF(text) : cleanText(text).replace(/J/g, "I");
  let result = "";

  for (let i = 0; i < prepared.length; i += 2) {
    const a = prepared[i],
      b = prepared[i + 1];
    const idx1 = grid.indexOf(a),
      idx2 = grid.indexOf(b);
    const r1 = Math.floor(idx1 / 5),
      c1 = idx1 % 5;
    const r2 = Math.floor(idx2 / 5),
      c2 = idx2 % 5;

    if (r1 === r2) {
      // Same Row
      result += grid[r1 * 5 + (encrypt ? (c1 + 1) % 5 : (c1 + 4) % 5)];
      result += grid[r2 * 5 + (encrypt ? (c2 + 1) % 5 : (c2 + 4) % 5)];
    } else if (c1 === c2) {
      // Same Column
      result += grid[(encrypt ? (r1 + 1) % 5 : (r1 + 4) % 5) * 5 + c1];
      result += grid[(encrypt ? (r2 + 1) % 5 : (r2 + 4) % 5) * 5 + c2];
    } else {
      // Rectangle
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

export function hillEncrypt(text, K) {
  const det = hillDet(K);
  if (gcd(det, 26) !== 1)
    throw new Error("Matriks tidak valid (Determinan tidak koprima dengan 26)");

  let t = cleanText(text);
  if (t.length % 2 !== 0) t += "X";
  let res = "";
  for (let i = 0; i < t.length; i += 2) {
    const p = [t.charCodeAt(i) - A, t.charCodeAt(i + 1) - A];
    res += String.fromCharCode(((K[0][0] * p[0] + K[0][1] * p[1]) % 26) + A);
    res += String.fromCharCode(((K[1][0] * p[0] + K[1][1] * p[1]) % 26) + A);
  }
  return res;
}

export function hillDecrypt(text, K) {
  const det = hillDet(K);
  const detInv = modInverse(det, 26);
  if (detInv === -1) throw new Error("Matriks tidak bisa diinvers.");

  // Adjoint matrix mod 26
  const Ki = [
    [(K[1][1] * detInv) % 26, ((-K[0][1] + 26) * detInv) % 26],
    [((-K[1][0] + 26) * detInv) % 26, (K[0][0] * detInv) % 26],
  ];

  let t = cleanText(text);
  let res = "";
  for (let i = 0; i < t.length; i += 2) {
    const c = [t.charCodeAt(i) - A, t.charCodeAt(i + 1) - A];
    res += String.fromCharCode(((Ki[0][0] * c[0] + Ki[0][1] * c[1]) % 26) + A);
    res += String.fromCharCode(((Ki[1][0] * c[0] + Ki[1][1] * c[1]) % 26) + A);
  }
  return res;
}

// ─── 5. ENIGMA (M3 Simulation) ───────────────────────────────
const ROTORS = [
  { w: "EKMFLGDQVZNTOWYHXUSPAIBRCJ", n: "Q" }, // I
  { w: "AJDKSIRUXBLHWTMCQGZNPYFVOE", n: "E" }, // II
  { w: "BDFHJLCPRTXVZNYEIWGAKMUSQO", n: "V" }, // III
];
const REFLECTOR = "YRUHQSLDPXNGOKMIEBFZCWVJAT"; // Wide B

export function enigmaProcess(text, settings) {
  // Mapping Rotor: 0=Left, 1=Middle, 2=Right
  let pos = settings.map((s) => s.charCodeAt(0) - A);
  const n0 = ROTORS[0].n.charCodeAt(0) - A;
  const n1 = ROTORS[1].n.charCodeAt(0) - A;
  const n2 = ROTORS[2].n.charCodeAt(0) - A;

  return text
    .toUpperCase()
    .split("")
    .map((char) => {
      if (!/[A-Z]/.test(char)) return char;

      // --- STEPPING LOGIC (M3 Double Stepping) ---
      // Rotor Tengah di notch? Double step tengah dan kiri
      if (pos[1] === n1) {
        pos[0] = (pos[0] + 1) % 26;
        pos[1] = (pos[1] + 1) % 26;
      }
      // Rotor Kanan di notch? Putar tengah
      else if (pos[2] === n2) {
        pos[1] = (pos[1] + 1) % 26;
      }
      // Rotor Kanan selalu berputar
      pos[2] = (pos[2] + 1) % 26;

      // --- ENCRYPTION PATH ---
      let c = char.charCodeAt(0) - A;

      // Right -> Left
      for (let i = 2; i >= 0; i--) {
        c = (ROTORS[i].w.charCodeAt((c + pos[i]) % 26) - A - pos[i] + 26) % 26;
      }

      // Reflector
      c = REFLECTOR.charCodeAt(c) - A;

      // Left -> Right (Inverse)
      for (let i = 0; i <= 2; i++) {
        const charAtC = String.fromCharCode(((c + pos[i]) % 26) + A);
        c = (ROTORS[i].w.indexOf(charAtC) - pos[i] + 26) % 26;
      }

      return String.fromCharCode(c + A);
    })
    .join("");
}
