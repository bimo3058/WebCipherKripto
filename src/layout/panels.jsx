import { useState, useContext } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  OutputBox,
  FieldLabel,
  BtnRow,
  Desc,
  inputStyle,
  taStyle,
  MobileContext,
} from "./components";
import {
  vigEncrypt,
  vigDecrypt,
  affEncrypt,
  affDecrypt,
  playfairProcess,
  buildPlayfairGrid,
  hillEncrypt,
  hillDecrypt,
  hillDet,
  enigmaProcess,
  gcd,
} from "../logic/ciphers";

// Helper: responsive grid style berdasarkan mobile context
const useGridStyle = () => {
  const isMobile = useContext(MobileContext);
  return isMobile
    ? { display: "flex", flexDirection: "column", gap: "1rem" }
    : { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" };
};

// Helper: root panel style — di mobile mengisi penuh secara vertikal
const usePanelStyle = () => {
  const isMobile = useContext(MobileContext);
  return isMobile
    ? { display: "flex", flexDirection: "column", flexGrow: 1 }
    : {};
};

// ─── PANEL: VIGENÈRE ─────────────────────────────────────────
export function VigenerePanel() {
  const gridStyle = useGridStyle();
  const panelStyle = usePanelStyle();
  const [text, setText] = useState("");
  const [key, setKey] = useState("");
  const [out, setOut] = useState(null);

  const run = (fn, label) => {
    try {
      setOut({ result: fn(text, key), label, error: null });
    } catch (e) {
      setOut({ error: e.message });
    }
  };

  return (
    <div style={panelStyle}>
      <Desc>
        Polyalphabetic substitution — setiap huruf digeser oleh huruf kunci yang
        berulang. Formula: C = (P + K) mod 26
      </Desc>
      <div style={gridStyle}>
        <div>
          <FieldLabel>Teks Input</FieldLabel>
          <textarea
            style={taStyle}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Masukkan teks..."
          />
        </div>
        <div>
          <FieldLabel>Kunci (kata/frasa)</FieldLabel>
          <input
            style={inputStyle}
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="contoh: KUNCI"
          />
        </div>
      </div>
      <BtnRow
        hasText={!!text}
        onEncrypt={() => run(vigEncrypt, "Cipherteks:")}
        onDecrypt={() => run(vigDecrypt, "Plainteks:")}
        onClear={() => {
          setText("");
          setKey("");
          setOut(null);
        }}
      />
      {out && <OutputBox {...out} />}
    </div>
  );
}

// ─── PANEL: AFFINE ───────────────────────────────────────────
export function AffinePanel() {
  const gridStyle = useGridStyle();
  const panelStyle = usePanelStyle();
  const [text, setText] = useState("");
  const [a, setA] = useState(7);
  const [b, setB] = useState(10);
  const [out, setOut] = useState(null);

  const run = (fn, label) => {
    try {
      setOut({ result: fn(text, Number(a), Number(b)), label, error: null });
    } catch (e) {
      setOut({ error: e.message });
    }
  };

  return (
    <div style={panelStyle}>
      <Desc>
        Formula: E(x) = (ax + b) mod 26. Nilai <b>a</b> harus koprima dengan 26.
        Valid: 1,3,5,7,9,11,15,17,19,21,23,25
      </Desc>
      <div style={gridStyle}>
        <div>
          <FieldLabel>Teks Input</FieldLabel>
          <textarea
            style={taStyle}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Masukkan teks..."
          />
        </div>
        <div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.75rem",
            }}
          >
            <div>
              <FieldLabel>Kunci a</FieldLabel>
              <input
                type="number"
                style={inputStyle}
                value={a}
                onChange={(e) => setA(e.target.value)}
              />
            </div>
            <div>
              <FieldLabel>Kunci b (0–25)</FieldLabel>
              <input
                type="number"
                style={inputStyle}
                value={b}
                min={0}
                max={25}
                onChange={(e) => setB(e.target.value)}
              />
            </div>
          </div>
          <div
            style={{
              fontSize: "0.82rem",
              color: "#999",
              marginTop: "0.5rem",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            det koprima 26: 1,3,5,7,9,11,15,17,19,21,23,25
          </div>
        </div>
      </div>
      <BtnRow
        hasText={!!text}
        onEncrypt={() => run(affEncrypt, "Cipherteks:")}
        onDecrypt={() => run(affDecrypt, "Plainteks:")}
        onClear={() => {
          setText("");
          setOut(null);
        }}
      />
      {out && <OutputBox {...out} />}
    </div>
  );
}

// ─── PANEL: PLAYFAIR ─────────────────────────────────────────
export function PlayfairPanel() {
  const gridStyle = useGridStyle();
  const panelStyle = usePanelStyle();
  const [text, setText] = useState("");
  const [key, setKey] = useState("MONARCHY");
  const [out, setOut] = useState(null);
  const [showGrid, setShowGrid] = useState(false);

  const grid = buildPlayfairGrid(key || "KEY");
  const run = (fn, encrypt, label) => {
    try {
      setOut({ result: fn(text, key, encrypt), label, error: null });
    } catch (e) {
      setOut({ error: e.message });
    }
  };

  return (
    <div style={panelStyle}>
      <Desc>
        Enkripsi digraf menggunakan matriks 5×5. Huruf I dan J dianggap sama.
        Pasangan huruf sama dipisah dengan X.
      </Desc>
      <div style={gridStyle}>
        <div>
          <FieldLabel>Teks Input</FieldLabel>
          <textarea
            style={taStyle}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Masukkan teks..."
          />
        </div>
        <div>
          <FieldLabel>Kunci</FieldLabel>
          <input
            style={inputStyle}
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="contoh: MONARCHY"
          />
          {showGrid && (
            <div style={{ marginTop: "0.75rem" }}>
              <table
                style={{
                  borderCollapse: "collapse",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.85rem",
                }}
              >
                {[0, 1, 2, 3, 4].map((r) => (
                  <tr key={r}>
                    {[0, 1, 2, 3, 4].map((c) => (
                      <td
                        key={c}
                        style={{
                          width: 32,
                          height: 32,
                          textAlign: "center",
                          border: "1px solid #2a2a2a",
                          color: "#3dffa0",
                          fontWeight: 700,
                        }}
                      >
                        {grid[r * 5 + c]}
                      </td>
                    ))}
                  </tr>
                ))}
              </table>
            </div>
          )}
        </div>
      </div>
      <BtnRow
        hasText={!!text}
        onEncrypt={() => run(playfairProcess, true, "Cipherteks:")}
        onDecrypt={() => run(playfairProcess, false, "Plainteks:")}
        onClear={() => {
          setText("");
          setOut(null);
          setShowGrid(false);
        }}
        extra={
          <button
            onClick={() => setShowGrid((g) => !g)}
            style={{
              padding: "0.65rem 1.4rem",
              borderRadius: "8px",
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.88rem",
              fontWeight: 700,
              cursor: "pointer",
              background: "transparent",
              border: "2px solid #ff6b35",
              color: "#ff6b35",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <VisibilityIcon sx={{ fontSize: "1rem" }} /> Grid
          </button>
        }
      />
      {out && <OutputBox {...out} />}
    </div>
  );
}

// ─── PANEL: HILL ─────────────────────────────────────────────
export function HillPanel() {
  const gridStyle = useGridStyle();
  const panelStyle = usePanelStyle();
  const [text, setText] = useState("");
  const [K, setK] = useState([
    [3, 3],
    [2, 5],
  ]);
  const [out, setOut] = useState(null);

  const setCell = (r, c, v) => {
    const nk = K.map((row) => [...row]);
    nk[r][c] = parseInt(v) || 0;
    setK(nk);
  };

  const run = (fn, label) => {
    try {
      setOut({ result: fn(text, K), label, error: null });
    } catch (e) {
      setOut({ error: e.message });
    }
  };

  const det = hillDet(K);

  return (
    <div style={panelStyle}>
      <Desc>
        Enkripsi menggunakan perkalian matriks 2×2 terhadap vektor huruf. det(K)
        harus koprima dengan 26.
      </Desc>
      <div style={gridStyle}>
        <div>
          <FieldLabel>Teks Input</FieldLabel>
          <textarea
            style={taStyle}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Masukkan teks..."
          />
        </div>
        <div>
          <FieldLabel>Matriks Kunci 2×2</FieldLabel>
          <div
            style={{
              display: "inline-flex",
              flexDirection: "column",
              gap: "0.5rem",
              background: "#111",
              border: "1px solid #2a2a2a",
              borderRadius: "8px",
              padding: "0.75rem",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 4,
                top: 8,
                bottom: 8,
                width: 3,
                borderTop: "2px solid #333",
                borderBottom: "2px solid #333",
                borderLeft: "2px solid #333",
              }}
            />
            <div
              style={{
                position: "absolute",
                right: 4,
                top: 8,
                bottom: 8,
                width: 3,
                borderTop: "2px solid #333",
                borderBottom: "2px solid #333",
                borderRight: "2px solid #333",
              }}
            />
            {[0, 1].map((r) => (
              <div key={r} style={{ display: "flex", gap: "0.5rem" }}>
                {[0, 1].map((c) => (
                  <input
                    key={c}
                    type="number"
                    value={K[r][c]}
                    onChange={(e) => setCell(r, c, e.target.value)}
                    style={{
                      ...inputStyle,
                      width: 72,
                      textAlign: "center",
                      fontSize: "1.1rem",
                      padding: "0.5rem",
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
          <div
            style={{
              fontSize: "0.82rem",
              color: gcd(det, 26) === 1 ? "#3dffa0" : "#ff6060",
              fontFamily: "'JetBrains Mono', monospace",
              marginTop: "0.5rem",
            }}
          >
            det = {det} —{" "}
            {gcd(det, 26) === 1 ? "✓ valid" : "✗ tidak koprima dengan 26"}
          </div>
        </div>
      </div>
      <BtnRow
        hasText={!!text}
        onEncrypt={() => run(hillEncrypt, "Cipherteks:")}
        onDecrypt={() => run(hillDecrypt, "Plainteks:")}
        onClear={() => {
          setText("");
          setOut(null);
        }}
      />
      {out && <OutputBox {...out} />}
    </div>
  );
}

// ─── PANEL: ENIGMA ───────────────────────────────────────────
export function EnigmaPanel() {
  const [text, setText] = useState("");
  const [rotors, setRotors] = useState(["A", "A", "A"]);
  const [out, setOut] = useState(null);
  const isMobile = useContext(MobileContext);

  const shiftRotor = (idx, delta) => {
    const current = rotors[idx].charCodeAt(0);
    let next = current + delta;
    if (next < 65) next = 90;
    if (next > 90) next = 65;
    const newR = [...rotors];
    newR[idx] = String.fromCharCode(next);
    setRotors(newR);
  };

  const handleProcess = () => {
    try {
      const res = enigmaProcess(text, rotors);
      setOut({ result: res });
    } catch (e) {
      setOut({ error: e.message });
    }
  };

  const rotorContainerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    padding: "16px",
    background: "rgba(255,255,255,0.02)",
    borderRadius: "12px",
    border: "1px solid #2a2a2a",
    marginTop: "0.5px",
  };

  return (
    <div style={usePanelStyle()}>
      <div style={useGridStyle()}>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <FieldLabel>Input Teks</FieldLabel>
          <textarea
            style={taStyle}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Masukkan pesan..."
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <FieldLabel>Pengaturan Rotor (I - II - III)</FieldLabel>
          <div style={rotorContainerStyle}>
            {rotors.map((r, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "#111",
                  padding: "8px 16px",
                  borderRadius: "8px",
                }}
              >
                <span
                  style={{
                    color: "#666",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                  }}
                >
                  ROTOR {i + 1}
                </span>

                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <button
                    onClick={() => shiftRotor(i, -1)}
                    style={{
                      background: "none",
                      border: "1px solid #333",
                      color: "#3dffa0",
                      cursor: "pointer",
                      borderRadius: "4px",
                      padding: "2px 8px",
                    }}
                  >
                    ▼
                  </button>
                  <span
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 800,
                      color: "#3dffa0",
                      minWidth: "30px",
                      textAlign: "center",
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {r}
                  </span>
                  <button
                    onClick={() => shiftRotor(i, 1)}
                    style={{
                      background: "none",
                      border: "1px solid #333",
                      color: "#3dffa0",
                      cursor: "pointer",
                      borderRadius: "4px",
                      padding: "2px 8px",
                    }}
                  >
                    ▲
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              fontSize: "0.7rem",
              color: "#555",
              marginTop: "4px",
              paddingLeft: "4px",
            }}
          >
            * Enigma menggunakan kunci yang sama untuk enkripsi & dekripsi.
          </div>
        </div>
      </div>

      <BtnRow
        hasText={!!text}
        onEncrypt={handleProcess}
        onDecrypt={handleProcess} // Dekripsi Enigma sama dengan Enkripsi
        onClear={() => {
          setText("");
          setRotors(["A", "A", "A"]);
          setOut(null);
        }}
      />
      <OutputBox {...out} />
    </div>
  );
}
