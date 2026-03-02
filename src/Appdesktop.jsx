import { useState } from "react";
import HexagonOutlinedIcon from "@mui/icons-material/HexagonOutlined";
import {
  VigenerePanel,
  AffinePanel,
  PlayfairPanel,
  HillPanel,
  EnigmaPanel,
} from "./layout/panels";

const CIPHERS = ["Vigenère", "Affine", "Playfair", "Hill", "Enigma"];
const BADGE = [
  "26 huruf alfabet",
  "E(x)=(ax+b)mod26",
  "5×5 Grid · I=J",
  "Matrix 2×2",
  "3 Rotor Simulation",
];
const PANELS = [
  VigenerePanel,
  AffinePanel,
  PlayfairPanel,
  HillPanel,
  EnigmaPanel,
];

export default function AppDesktop() {
  const [active, setActive] = useState(0);
  const Panel = PANELS[active];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080810",
        color: "#e8e8f0",
        fontFamily: "'Inter', sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #080810; }
        input[type=number]::-webkit-inner-spin-button { opacity: 0.3; }
        textarea:focus, input:focus { border-color: #3dffa0 !important; box-shadow: 0 0 0 3px rgba(61,255,160,0.1) !important; }
        button:hover { opacity: 0.85; transform: translateY(-1px); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #2a2a2a; }
      `}</style>

      <header
        style={{
          textAlign: "center",
          padding: "2rem 3rem 1.5rem",
          borderBottom: "1px solid #1a1a1a",
          background:
            "linear-gradient(180deg, rgba(61,255,160,0.04) 0%, transparent 100%)",
        }}
      >
        <div
          style={{
            fontSize: "2rem",
            fontWeight: 800,
            color: "#3dffa0",
            letterSpacing: "0.08em",
            textShadow: "0 0 40px rgba(61,255,160,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
          }}
        >
          <HexagonOutlinedIcon sx={{ fontSize: "2rem" }} /> CIPHERLAB
        </div>
        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "0.6rem",
          }}
        >
          {[
            {
              text: "Kriptografi Klasik",
              bg: "rgba(61,255,160,0.08)",
              border: "rgba(61,255,160,0.25)",
              color: "#3dffa0",
            },
            {
              text: "Semester Genap 2025/2026",
              bg: "rgba(120,180,255,0.08)",
              border: "rgba(120,180,255,0.25)",
              color: "#78b4ff",
            },
            {
              text: "Bimo Kusumo Putro W",
              bg: "rgba(255,180,80,0.08)",
              border: "rgba(255,180,80,0.25)",
              color: "#ffb450",
            },
            {
              text: "21120123120029",
              bg: "rgba(255,120,180,0.08)",
              border: "rgba(255,120,180,0.25)",
              color: "#ff78b4",
            },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                padding: "0.55rem 1.2rem",
                borderRadius: "10px",
                background: item.bg,
                backdropFilter: "blur(10px)",
                border: `1px solid ${item.border}`,
                fontSize: "0.72rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                fontFamily: "'JetBrains Mono', monospace",
                color: item.color,
              }}
            >
              {item.text}
            </div>
          ))}
        </div>
      </header>

      <main
        style={{
          maxWidth: "100%",
          margin: "0 auto",
          padding: "2rem 3rem 5rem",
          flexGrow: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "0.3rem",
            background: "#0f0f18",
            border: "1px solid #1a1a1a",
            borderRadius: "12px",
            padding: "0.3rem",
            marginBottom: "2rem",
            overflowX: "auto",
          }}
        >
          {CIPHERS.map((name, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                flex: 1,
                minWidth: 100,
                padding: "0.6rem 0.8rem",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: "0.88rem",
                transition: "all 0.2s",
                background: active === i ? "#3dffa0" : "transparent",
                color: active === i ? "#000" : "#555",
                boxShadow:
                  active === i ? "0 0 20px rgba(61,255,160,0.25)" : "none",
              }}
            >
              {name}
            </button>
          ))}
        </div>

        <div
          style={{
            background: "#0f0f18",
            border: "1px solid #1a1a1a",
            borderRadius: "14px",
            padding: "2rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "1.5rem",
            }}
          >
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: 800,
                background: "linear-gradient(135deg, #fff 0%, #3dffa0 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {CIPHERS[active]} Cipher
            </h2>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.8rem",
                padding: "0.28rem 0.7rem",
                borderRadius: 999,
                border: "1px solid #3dffa0",
                color: "#3dffa0",
                background: "rgba(61,255,160,0.05)",
                whiteSpace: "nowrap",
              }}
            >
              {BADGE[active]}
            </span>
          </div>
          <Panel />
        </div>
      </main>

      <footer
        style={{
          textAlign: "center",
          padding: "1.5rem",
          color: "#888",
          fontSize: "0.82rem",
          borderTop: "1px solid #111",
          fontFamily: "'Inter', sans-serif",
          letterSpacing: "0.04em",
        }}
      >
        CipherLab · React · Vigenère · Affine · Playfair · Hill · Enigma
      </footer>
    </div>
  );
}
