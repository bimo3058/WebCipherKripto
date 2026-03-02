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
        background: "#050508", // Lebih gelap & dalam
        color: "#e8e8f0",
        fontFamily: "'Inter', sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=JetBrains+Mono:wght@400;700&display=swap');
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        body { 
          background: #050508; 
          overflow-x: hidden;
        }

        /* Scanline Effect untuk kesan retro-futuristik */
        body::before {
          content: " ";
          position: fixed;
          top: 0; left: 0; bottom: 0; right: 0;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), 
                      linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03));
          z-index: 9999;
          background-size: 100% 4px, 3px 100%;
          pointer-events: none;
        }

        input:focus, textarea:focus {
          border-color: #3dffa0 !important;
          box-shadow: 0 0 15px rgba(61,255,160,0.2) !important;
        }

        button { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #050508; }
        ::-webkit-scrollbar-thumb { background: #1a1a25; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #3dffa0; }
      `}</style>

      {/* HEADER: INDUSTRIAL STYLE */}
      <header
        style={{
          padding: "1.5rem 4rem",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          background: "rgba(10, 10, 15, 0.8)",
          backdropFilter: "blur(10px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 1000
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ 
            background: "rgba(61,255,160,0.1)", 
            padding: "8px", 
            borderRadius: "8px",
            border: "1px solid rgba(61,255,160,0.2)"
          }}>
            <HexagonOutlinedIcon sx={{ fontSize: "2rem", color: "#3dffa0", display: "block" }} />
          </div>
          <div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "0.2em", color: "#fff" }}>
              CIPHER<span style={{ color: "#3dffa0" }}>LAB</span>
            </h1>
            <p style={{ fontSize: "0.6rem", color: "#555", fontFamily: "'JetBrains Mono'", letterSpacing: "0.1em" }}>
              V1.0 Your Ultimate Cryptography Toolkit
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "1.5rem" }}>
          {[
            { label: "MODULE", val: "KRIPTOGRAFI KLASIK", color: "#3dffa0" },
            { label: "OP_NAME", val: "BIMO KUSUMO PUTRO W", color: "#ffb450" },
            { label: "ID_CODE", val: "21120123120029", color: "#78b4ff" }
          ].map((item, i) => (
            <div key={i} style={{ textAlign: "right", borderRight: i !== 2 ? "1px solid #222" : "none", paddingRight: i !== 2 ? "1.5rem" : 0 }}>
              <div style={{ fontSize: "0.55rem", color: "#444", fontWeight: 800 }}>{item.label}</div>
              <div style={{ fontSize: "0.75rem", color: item.color, fontWeight: 600, fontFamily: "'JetBrains Mono'" }}>{item.val}</div>
            </div>
          ))}
        </div>
      </header>

      <main style={{ maxWidth: "1200px", margin: "0 auto", width: "100%", padding: "3rem 2rem" }}>
        
        {/* TAB NAVIGATION: NEON COMMAND STYLE */}
        <div style={{ 
          display: "flex", 
          background: "#0f0f18", 
          padding: "4px", 
          borderRadius: "12px", 
          border: "1px solid #1a1a25",
          marginBottom: "2.5rem",
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
        }}>
          {CIPHERS.map((name, i) => {
            const isActive = active === i;
            return (
              <button
                key={i}
                onClick={() => setActive(i)}
                style={{
                  flex: 1,
                  padding: "1rem",
                  border: "none",
                  borderRadius: "8px",
                  background: isActive ? "rgba(61,255,160,0.1)" : "transparent",
                  color: isActive ? "#3dffa0" : "#555",
                  cursor: "pointer",
                  fontWeight: 800,
                  fontSize: "0.85rem",
                  letterSpacing: "0.1em",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                {isActive && (
                  <div style={{ 
                    position: "absolute", bottom: 0, left: "20%", right: "20%", height: "2px", 
                    background: "#3dffa0", boxShadow: "0 0 10px #3dffa0" 
                  }} />
                )}
                {name.toUpperCase()}
              </button>
            );
          })}
        </div>

        {/* MAIN PANEL BOX */}
        <div style={{ 
          background: "#0f0f18", 
          border: "1px solid #1a1a25", 
          borderRadius: "16px",
          position: "relative",
          overflow: "hidden"
        }}>
          {/* Header Internal Panel */}
          <div style={{ 
            padding: "1.5rem 2.5rem", 
            borderBottom: "1px solid #1a1a25", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between",
            background: "linear-gradient(90deg, rgba(61,255,160,0.02) 0%, transparent 100%)"
          }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "1rem" }}>
              <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#fff" }}>{CIPHERS[active]}</h2>
              <span style={{ 
                fontFamily: "'JetBrains Mono'", fontSize: "0.75rem", color: "#3dffa0", opacity: 0.7 
              }}>{BADGE[active]}</span>
            </div>
            <div style={{ fontSize: "0.6rem", color: "#333", letterSpacing: "0.2em" }}>
              STATUS: <span style={{ color: "#3dffa0" }}>ONLINE</span>
            </div>
          </div>

          {/* Content Area */}
          <div style={{ padding: "2.5rem" }}>
            <Panel />
          </div>
        </div>
      </main>

      <footer style={{ 
        marginTop: "auto", 
        padding: "2rem", 
        textAlign: "center", 
        borderTop: "1px solid #111",
        background: "#050508"
      }}>
        <div style={{ 
          fontSize: "0.65rem", 
          color: "#333", 
          fontFamily: "'JetBrains Mono'", 
          letterSpacing: "0.3em" 
        }}>
          SYSTEM_DECODING_ACTIVE // SEMESTER_GENAP_2025
        </div>
      </footer>
    </div>
  );
}