import { useState, useCallback } from "react";

// ─── CIPHER ALGORITHMS ───────────────────────────────────────

const A = 65;
const cleanText = (s) => s.toUpperCase().replace(/[^A-Z]/g, "");

// 1. VIGENÈRE
function vigEncrypt(text, key) {
  const k = cleanText(key);
  if (!k) throw new Error("Kunci tidak boleh kosong");
  let result = "", ki = 0;
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

function vigDecrypt(text, key) {
  const k = cleanText(key);
  if (!k) throw new Error("Kunci tidak boleh kosong");
  let result = "", ki = 0;
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

// 2. AFFINE
function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }
function modInverse(a, m) {
  for (let x = 1; x < m; x++) if ((a * x) % m === 1) return x;
  return -1;
}

function affEncrypt(text, a, b) {
  if (gcd(a, 26) !== 1) throw new Error(`a=${a} tidak koprima dengan 26. Pilih: 1,3,5,7,9,11,15,17,19,21,23,25`);
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

function affDecrypt(text, a, b) {
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

// 3. PLAYFAIR
function buildPlayfairGrid(key) {
  const seen = new Set();
  const grid = [];
  const src = (key + "ABCDEFGHIKLMNOPQRSTUVWXYZ").toUpperCase().replace(/J/g, "I");
  for (const ch of src) {
    if (/[A-Z]/.test(ch) && !seen.has(ch)) { seen.add(ch); grid.push(ch); }
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
      else { out += t[i + 1]; i++; }
    }
    i++;
  }
  if (out.length % 2 !== 0) out += "X";
  return out;
}

function playfairProcess(text, key, encrypt) {
  if (!key) throw new Error("Kunci tidak boleh kosong");
  const grid = buildPlayfairGrid(key);
  const prepared = encrypt ? prepPF(text) : cleanText(text).replace(/J/g, "I");
  if (prepared.length % 2 !== 0 && !encrypt) throw new Error("Panjang cipherteks harus genap");
  let result = "";
  for (let i = 0; i < prepared.length; i += 2) {
    const a = prepared[i], b = prepared[i + 1] || "X";
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

// 4. HILL (2×2)
function hillDet(K) { return ((K[0][0] * K[1][1] - K[0][1] * K[1][0]) % 26 + 26) % 26; }
function hillInverse(K) {
  const det = hillDet(K);
  const di = modInverse(det, 26);
  if (di === -1) return null;
  return [
    [((K[1][1] * di) % 26 + 26) % 26, ((-K[0][1] * di) % 26 + 26) % 26],
    [((-K[1][0] * di) % 26 + 26) % 26, ((K[0][0] * di) % 26 + 26) % 26],
  ];
}

function hillApply(text, K) {
  let t = cleanText(text);
  if (t.length % 2 !== 0) t += "X";
  let result = "";
  for (let i = 0; i < t.length; i += 2) {
    const v0 = t.charCodeAt(i) - A, v1 = t.charCodeAt(i + 1) - A;
    result += String.fromCharCode(((K[0][0] * v0 + K[0][1] * v1) % 26) + A);
    result += String.fromCharCode(((K[1][0] * v0 + K[1][1] * v1) % 26) + A);
  }
  return result;
}

function hillEncrypt(text, K) {
  const det = hillDet(K);
  if (gcd(det, 26) !== 1) throw new Error(`det(K)=${det} tidak koprima dengan 26. Ganti matriks kunci.`);
  return hillApply(text, K);
}

function hillDecrypt(text, K) {
  const det = hillDet(K);
  if (gcd(det, 26) !== 1) throw new Error(`det(K)=${det} tidak koprima dengan 26.`);
  const Ki = hillInverse(K);
  if (!Ki) throw new Error("Matriks tidak bisa diinvers mod 26!");
  return hillApply(text, Ki);
}

// 5. ENIGMA
const ROTORS = [
  { wiring: "EKMFLGDQVZNTOWYHXUSPAIBRCJ", notch: "Q" },
  { wiring: "AJDKSIRUXBLHWTMCQGZNPYFVOE", notch: "E" },
  { wiring: "BDFHJLCPRTXVZNYEIWGAKMUSQO", notch: "V" },
];
const REFLECTOR_B = "YRUHQSLDPXNGOKMIEBFZCWVJAT";

function enigmaChar(ch, pos) {
  let c = ch;
  for (let r = 2; r >= 0; r--) {
    const off = pos[r], w = ROTORS[r].wiring;
    c = (w.charCodeAt((c + off) % 26) - A - off + 26) % 26;
  }
  c = REFLECTOR_B.charCodeAt(c) - A;
  for (let r = 0; r <= 2; r++) {
    const off = pos[r], w = ROTORS[r].wiring;
    c = (w.indexOf(String.fromCharCode((c + off) % 26 + A)) - off + 26) % 26;
  }
  return c;
}

function stepRotors(pos) {
  const p = [...pos];
  const midAtNotch = String.fromCharCode(pos[1] + A) === ROTORS[1].notch;
  const rgtAtNotch = String.fromCharCode(pos[2] + A) === ROTORS[2].notch;
  if (midAtNotch) { p[0] = (pos[0] + 1) % 26; p[1] = (pos[1] + 1) % 26; }
  if (rgtAtNotch) p[1] = (p[1] + 1) % 26;
  p[2] = (pos[2] + 1) % 26;
  return p;
}

function enigmaProcess(text, r1, r2, r3) {
  let pos = [r1.charCodeAt(0) - A, r2.charCodeAt(0) - A, r3.charCodeAt(0) - A];
  let result = "";
  for (const ch of text.toUpperCase()) {
    if (/[A-Z]/.test(ch)) {
      pos = stepRotors(pos);
      result += String.fromCharCode(enigmaChar(ch.charCodeAt(0) - A, pos) + A);
    } else result += ch;
  }
  return result;
}

// ─── COMPONENTS ──────────────────────────────────────────────

const CIPHERS = ["Vigenère", "Affine", "Playfair", "Hill", "Enigma"];

function OutputBox({ result, error, label }) {
  if (!result && !error) return null;
  return (
    <div style={{
      marginTop: "1rem",
      padding: "1rem 1.25rem",
      borderRadius: "10px",
      background: error ? "rgba(255,80,80,0.08)" : "rgba(80,255,180,0.06)",
      border: `1px solid ${error ? "#ff5050" : "#3dffa0"}`,
      fontFamily: "'Courier New', monospace",
      transition: "all 0.3s",
    }}>
      <div style={{ fontSize: "0.68rem", letterSpacing: "0.15em", textTransform: "uppercase", color: error ? "#ff8080" : "#3dffa0", marginBottom: "0.4rem" }}>
        {error ? "⚠ Error" : label}
      </div>
      <div style={{ fontSize: "1rem", fontWeight: 700, color: error ? "#ff8080" : "#3dffa0", wordBreak: "break-all", lineHeight: 1.7 }}>
        {error || result}
      </div>
    </div>
  );
}

function FieldLabel({ children }) {
  return (
    <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.13em", textTransform: "uppercase", color: "#666", marginBottom: "0.45rem" }}>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%", background: "#111", border: "1px solid #2a2a2a", borderRadius: "8px",
  color: "#e8e8f0", fontFamily: "'Courier New', monospace", fontSize: "0.9rem",
  padding: "0.7rem 1rem", outline: "none", resize: "vertical", transition: "border-color 0.2s",
};

const taStyle = { ...inputStyle, minHeight: "100px", resize: "vertical" };

function BtnRow({ onEncrypt, onDecrypt, onClear, extra }) {
  const btnBase = { padding: "0.65rem 1.4rem", borderRadius: "8px", fontFamily: "'Syne', sans-serif", fontSize: "0.88rem", fontWeight: 700, cursor: "pointer", border: "none", transition: "all 0.2s" };
  return (
    <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginTop: "1rem" }}>
      <button onClick={onEncrypt} style={{ ...btnBase, background: "#3dffa0", color: "#000" }}>🔒 Enkripsi</button>
      {onDecrypt && <button onClick={onDecrypt} style={{ ...btnBase, background: "transparent", border: "2px solid #3dffa0", color: "#3dffa0" }}>🔓 Dekripsi</button>}
      {extra}
      <button onClick={onClear} style={{ ...btnBase, background: "transparent", border: "2px solid #2a2a2a", color: "#666" }}>✕ Clear</button>
    </div>
  );
}

// ─── PANEL: VIGENÈRE
function VigenerePanel() {
  const [text, setText] = useState("");
  const [key, setKey] = useState("");
  const [out, setOut] = useState(null);

  const run = (fn, label) => {
    try { setOut({ result: fn(text, key), label, error: null }); }
    catch (e) { setOut({ error: e.message }); }
  };

  return (
    <div>
      <Desc>Polyalphabetic substitution — setiap huruf digeser oleh huruf kunci yang berulang. Formula: C = (P + K) mod 26</Desc>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div><FieldLabel>Teks Input</FieldLabel><textarea style={taStyle} value={text} onChange={e => setText(e.target.value)} placeholder="Masukkan teks..." /></div>
        <div><FieldLabel>Kunci (kata/frasa)</FieldLabel><input style={inputStyle} value={key} onChange={e => setKey(e.target.value)} placeholder="contoh: KUNCI" /></div>
      </div>
      <BtnRow onEncrypt={() => run(vigEncrypt, "Cipherteks:")} onDecrypt={() => run(vigDecrypt, "Plainteks:")} onClear={() => { setText(""); setKey(""); setOut(null); }} />
      {out && <OutputBox {...out} />}
    </div>
  );
}

// ─── PANEL: AFFINE
function AffinePanel() {
  const [text, setText] = useState("");
  const [a, setA] = useState(7);
  const [b, setB] = useState(10);
  const [out, setOut] = useState(null);

  const run = (fn, label) => {
    try { setOut({ result: fn(text, Number(a), Number(b)), label, error: null }); }
    catch (e) { setOut({ error: e.message }); }
  };

  return (
    <div>
      <Desc>Formula: E(x) = (ax + b) mod 26. Nilai <b>a</b> harus koprima dengan 26. Valid: 1,3,5,7,9,11,15,17,19,21,23,25</Desc>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div><FieldLabel>Teks Input</FieldLabel><textarea style={taStyle} value={text} onChange={e => setText(e.target.value)} placeholder="Masukkan teks..." /></div>
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <div><FieldLabel>Kunci a</FieldLabel><input type="number" style={inputStyle} value={a} onChange={e => setA(e.target.value)} /></div>
            <div><FieldLabel>Kunci b (0–25)</FieldLabel><input type="number" style={inputStyle} value={b} min={0} max={25} onChange={e => setB(e.target.value)} /></div>
          </div>
          <div style={{ fontSize: "0.72rem", color: "#555", marginTop: "0.5rem", fontFamily: "'Courier New', monospace" }}>
            det koprima 26: 1,3,5,7,9,11,15,17,19,21,23,25
          </div>
        </div>
      </div>
      <BtnRow onEncrypt={() => run(affEncrypt, "Cipherteks:")} onDecrypt={() => run(affDecrypt, "Plainteks:")} onClear={() => { setText(""); setOut(null); }} />
      {out && <OutputBox {...out} />}
    </div>
  );
}

// ─── PANEL: PLAYFAIR
function PlayfairPanel() {
  const [text, setText] = useState("");
  const [key, setKey] = useState("MONARCHY");
  const [out, setOut] = useState(null);
  const [showGrid, setShowGrid] = useState(false);

  const grid = buildPlayfairGrid(key || "KEY");
  const run = (fn, encrypt, label) => {
    try { setOut({ result: fn(text, key, encrypt), label, error: null }); }
    catch (e) { setOut({ error: e.message }); }
  };

  return (
    <div>
      <Desc>Enkripsi digraf menggunakan matriks 5×5. Huruf I dan J dianggap sama. Pasangan huruf sama dipisah dengan X.</Desc>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div><FieldLabel>Teks Input</FieldLabel><textarea style={taStyle} value={text} onChange={e => setText(e.target.value)} placeholder="Masukkan teks..." /></div>
        <div>
          <FieldLabel>Kunci</FieldLabel>
          <input style={inputStyle} value={key} onChange={e => setKey(e.target.value)} placeholder="contoh: MONARCHY" />
          {showGrid && (
            <div style={{ marginTop: "0.75rem" }}>
              <table style={{ borderCollapse: "collapse", fontFamily: "'Courier New', monospace", fontSize: "0.85rem" }}>
                {[0,1,2,3,4].map(r => (
                  <tr key={r}>{[0,1,2,3,4].map(c => (
                    <td key={c} style={{ width: 32, height: 32, textAlign: "center", border: "1px solid #2a2a2a", color: "#3dffa0", fontWeight: 700 }}>
                      {grid[r * 5 + c]}
                    </td>
                  ))}</tr>
                ))}
              </table>
            </div>
          )}
        </div>
      </div>
      <BtnRow
        onEncrypt={() => run(playfairProcess, true, "Cipherteks:")}
        onDecrypt={() => run(playfairProcess, false, "Plainteks:")}
        onClear={() => { setText(""); setOut(null); setShowGrid(false); }}
        extra={<button onClick={() => setShowGrid(g => !g)} style={{ padding: "0.65rem 1.4rem", borderRadius: "8px", fontFamily: "'Syne', sans-serif", fontSize: "0.88rem", fontWeight: 700, cursor: "pointer", background: "transparent", border: "2px solid #ff6b35", color: "#ff6b35", transition: "all 0.2s" }}>👁 Grid</button>}
      />
      {out && <OutputBox {...out} />}
    </div>
  );
}

// ─── PANEL: HILL
function HillPanel() {
  const [text, setText] = useState("");
  const [K, setK] = useState([[3,3],[2,5]]);
  const [out, setOut] = useState(null);

  const setCell = (r, c, v) => {
    const nk = K.map(row => [...row]);
    nk[r][c] = parseInt(v) || 0;
    setK(nk);
  };

  const run = (fn, label) => {
    try { setOut({ result: fn(text, K), label, error: null }); }
    catch (e) { setOut({ error: e.message }); }
  };

  const det = hillDet(K);

  return (
    <div>
      <Desc>Enkripsi menggunakan perkalian matriks 2×2 terhadap vektor huruf. det(K) harus koprima dengan 26.</Desc>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div><FieldLabel>Teks Input</FieldLabel><textarea style={taStyle} value={text} onChange={e => setText(e.target.value)} placeholder="Masukkan teks..." /></div>
        <div>
          <FieldLabel>Matriks Kunci 2×2</FieldLabel>
          <div style={{ display: "inline-flex", flexDirection: "column", gap: "0.5rem", background: "#111", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "0.75rem", position: "relative" }}>
            <div style={{ position: "absolute", left: 4, top: 8, bottom: 8, width: 3, borderTop: "2px solid #333", borderBottom: "2px solid #333", borderLeft: "2px solid #333" }} />
            <div style={{ position: "absolute", right: 4, top: 8, bottom: 8, width: 3, borderTop: "2px solid #333", borderBottom: "2px solid #333", borderRight: "2px solid #333" }} />
            {[0,1].map(r => (
              <div key={r} style={{ display: "flex", gap: "0.5rem" }}>
                {[0,1].map(c => (
                  <input key={c} type="number" value={K[r][c]} onChange={e => setCell(r, c, e.target.value)}
                    style={{ ...inputStyle, width: 72, textAlign: "center", fontSize: "1.1rem", padding: "0.5rem" }} />
                ))}
              </div>
            ))}
          </div>
          <div style={{ fontSize: "0.72rem", color: gcd(det, 26) === 1 ? "#3dffa0" : "#ff6060", fontFamily: "'Courier New', monospace", marginTop: "0.5rem" }}>
            det = {det} — {gcd(det, 26) === 1 ? "✓ valid" : "✗ tidak koprima dengan 26"}
          </div>
        </div>
      </div>
      <BtnRow onEncrypt={() => run(hillEncrypt, "Cipherteks:")} onDecrypt={() => run(hillDecrypt, "Plainteks:")} onClear={() => { setText(""); setOut(null); }} />
      {out && <OutputBox {...out} />}
    </div>
  );
}

// ─── PANEL: ENIGMA
function EnigmaPanel() {
  const [text, setText] = useState("");
  const [rotors, setRotors] = useState(["A","A","A"]);
  const [out, setOut] = useState(null);

  const setRotor = (i, v) => {
    const r = [...rotors];
    r[i] = v.toUpperCase().replace(/[^A-Z]/g, "").slice(-1) || "A";
    setRotors(r);
  };

  const run = () => {
    try { setOut({ result: enigmaProcess(text, rotors[0], rotors[1], rotors[2]), label: "Output (simetris — enkripsi = dekripsi):", error: null }); }
    catch (e) { setOut({ error: e.message }); }
  };

  return (
    <div>
      <Desc>Simulasi mesin Enigma 3 rotor (I, II, III) dengan Reflector-B. Bersifat simetris: output enkripsi dengan setting sama menghasilkan plainteks asli.</Desc>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div><FieldLabel>Teks Input</FieldLabel><textarea style={taStyle} value={text} onChange={e => setText(e.target.value)} placeholder="Masukkan teks..." /></div>
        <div>
          <FieldLabel>Posisi Awal Rotor (A–Z)</FieldLabel>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            {["Rotor I","Rotor II","Rotor III"].map((label, i) => (
              <div key={i} style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: "0.68rem", color: "#555", marginBottom: "0.35rem", fontFamily: "'Courier New', monospace" }}>{label}</div>
                <input style={{ ...inputStyle, textAlign: "center", fontSize: "1.6rem", fontWeight: 700, color: "#3dffa0", padding: "0.5rem" }}
                  value={rotors[i]} maxLength={1} onChange={e => setRotor(i, e.target.value)} />
              </div>
            ))}
          </div>
          <div style={{ fontSize: "0.72rem", color: "#555", fontFamily: "'Courier New', monospace", marginTop: "0.6rem" }}>
            ⚙ Notch: Rotor I=Q, II=E, III=V
          </div>
        </div>
      </div>
      <BtnRow onEncrypt={run} onClear={() => { setText(""); setRotors(["A","A","A"]); setOut(null); }} />
      {out && <OutputBox {...out} />}
    </div>
  );
}

function Desc({ children }) {
  return (
    <div style={{ borderLeft: "3px solid #2a2a2a", paddingLeft: "1rem", color: "#555", fontSize: "0.87rem", lineHeight: 1.65, marginBottom: "1.25rem" }}>
      {children}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────
const PANELS = [VigenerePanel, AffinePanel, PlayfairPanel, HillPanel, EnigmaPanel];
const BADGE = ["26 huruf alfabet", "E(x)=(ax+b)mod26", "5×5 Grid · I=J", "Matrix 2×2", "3 Rotor Simulation"];

export default function App() {
  const [active, setActive] = useState(0);
  const Panel = PANELS[active];

  return (
    <div style={{ minHeight: "100vh", background: "#080810", color: "#e8e8f0", fontFamily: "'Syne', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;800&family=Courier+Prime:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #080810; }
        input[type=number]::-webkit-inner-spin-button { opacity: 0.3; }
        textarea:focus, input:focus { border-color: #3dffa0 !important; box-shadow: 0 0 0 3px rgba(61,255,160,0.1) !important; }
        button:hover { opacity: 0.85; transform: translateY(-1px); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #2a2a2a; }
      `}</style>

      {/* HEADER */}
      <header style={{ textAlign: "center", padding: "3rem 2rem 2rem", borderBottom: "1px solid #1a1a1a", background: "linear-gradient(180deg, rgba(61,255,160,0.04) 0%, transparent 100%)" }}>
        <div style={{ fontSize: "2rem", fontWeight: 800, color: "#3dffa0", letterSpacing: "0.08em", textShadow: "0 0 40px rgba(61,255,160,0.35)" }}>
          ⬡ CIPHERLAB
        </div>
        <div style={{ color: "#444", fontSize: "0.75rem", marginTop: "0.4rem", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "'Courier New', monospace" }}>
          Kriptografi Klasik · Semester Genap 2025/2026
        </div>
      </header>

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1.5rem 5rem" }}>
        {/* TABS */}
        <div style={{ display: "flex", gap: "0.3rem", background: "#0f0f18", border: "1px solid #1a1a1a", borderRadius: "12px", padding: "0.3rem", marginBottom: "2rem", overflowX: "auto" }}>
          {CIPHERS.map((name, i) => (
            <button key={i} onClick={() => setActive(i)} style={{
              flex: 1, minWidth: 100, padding: "0.6rem 0.8rem", borderRadius: "8px", border: "none", cursor: "pointer",
              fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.88rem", transition: "all 0.2s",
              background: active === i ? "#3dffa0" : "transparent",
              color: active === i ? "#000" : "#555",
              boxShadow: active === i ? "0 0 20px rgba(61,255,160,0.25)" : "none",
            }}>
              {name}
            </button>
          ))}
        </div>

        {/* PANEL */}
        <div style={{ background: "#0f0f18", border: "1px solid #1a1a1a", borderRadius: "14px", padding: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, background: "linear-gradient(135deg, #fff 0%, #3dffa0 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {CIPHERS[active]} Cipher
            </h2>
            <span style={{ fontFamily: "'Courier New', monospace", fontSize: "0.68rem", padding: "0.28rem 0.7rem", borderRadius: 999, border: "1px solid #3dffa0", color: "#3dffa0", background: "rgba(61,255,160,0.05)", whiteSpace: "nowrap" }}>
              {BADGE[active]}
            </span>
          </div>
          <Panel />
        </div>
      </main>

      <footer style={{ textAlign: "center", padding: "1.5rem", color: "#2a2a2a", fontSize: "0.72rem", borderTop: "1px solid #111", fontFamily: "'Courier New', monospace", letterSpacing: "0.08em" }}>
        CipherLab · React · Vigenère · Affine · Playfair · Hill · Enigma
      </footer>
    </div>
  );
}
