import { useState } from "react";
import HexagonOutlinedIcon from "@mui/icons-material/HexagonOutlined";
import KeyIcon from "@mui/icons-material/Key";
import FunctionsIcon from "@mui/icons-material/Functions";
import GridOnIcon from "@mui/icons-material/GridOn";
import TableChartIcon from "@mui/icons-material/TableChart";
import SettingsInputComponentIcon from "@mui/icons-material/SettingsInputComponent";
import { MobileContext } from "./layout/components";
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
const TAB_ICONS = [
  KeyIcon,
  FunctionsIcon,
  GridOnIcon,
  TableChartIcon,
  SettingsInputComponentIcon,
];

export default function AppMobile() {
  const [active, setActive] = useState(0);
  const Panel = PANELS[active];

  return (
    <div
      style={{
        height: "100dvh",
        background: "#080810",
        color: "#e8e8f0",
        fontFamily: "'Inter', sans-serif",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #080810; overscroll-behavior: none; }
        input[type=number]::-webkit-inner-spin-button { opacity: 0.3; }
        textarea:focus, input:focus { border-color: #3dffa0 !important; box-shadow: 0 0 0 2px rgba(61,255,160,0.15) !important; }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      {/* HEADER — compact for mobile */}
      <header
        style={{
          padding: "1rem 1.25rem 0.75rem",
          borderBottom: "1px solid #1a1a1a",
          background:
            "linear-gradient(180deg, rgba(61,255,160,0.05) 0%, transparent 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <HexagonOutlinedIcon sx={{ fontSize: "1.4rem", color: "#3dffa0" }} />
          <span
            style={{
              fontSize: "1.2rem",
              fontWeight: 800,
              color: "#3dffa0",
              letterSpacing: "0.08em",
              textShadow: "0 0 20px rgba(61,255,160,0.3)",
            }}
          >
            CIPHERLAB
          </span>
        </div>
        <div
          style={{
            fontSize: "0.65rem",
            color: "#555",
            fontFamily: "'JetBrains Mono', monospace",
            textAlign: "right",
            lineHeight: 1.4,
          }}
        >
          <div style={{ color: "#ffb450" }}>Bimo Kusumo Putro W</div>
          <div>21120123120029</div>
        </div>
      </header>

      {/* ACTIVE CIPHER LABEL */}
      <div
        style={{
          padding: "0.85rem 1.25rem 0",
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
        }}
      >
        <h2
          style={{
            fontSize: "1.2rem",
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
            fontSize: "0.65rem",
            padding: "0.2rem 0.55rem",
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

      {/* SCROLLABLE CONTENT */}
      <main
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "0.75rem 1.25rem",
          paddingBottom: "calc(0.75rem + 72px)",
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
        }}
      >
        <div
          style={{
            background: "#0f0f18",
            border: "1px solid #1a1a1a",
            borderRadius: "12px",
            padding: "1.25rem",
            width: "100%",
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <MobileContext.Provider value={true}>
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <Panel />
            </div>
          </MobileContext.Provider>
        </div>
      </main>

      {/* BOTTOM TAB BAR */}
      <nav
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: "68px",
          background: "#0a0a14",
          borderTop: "1px solid #1a1a1a",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          paddingBottom: "env(safe-area-inset-bottom)",
          zIndex: 100,
          width: "100%",
        }}
      >
        {CIPHERS.map((name, i) => {
          const Icon = TAB_ICONS[i];
          const isActive = active === i;
          return (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                flex: 1,
                minWidth: 0, // Mencegah Enigma keluar layar
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.25rem",
                border: "none", // Memastikan tidak ada border tombol
                outline: "none", // Menghapus outline saat diklik
                background: "transparent",
                cursor: "pointer",
                padding: "4px 2px",
                transition: "all 0.2s",
                position: "relative",
                WebkitTapHighlightColor: "transparent", // Menghapus highlight abu-abu di HP
              }}
            >
              {/* INDICATOR GARIS DI ATAS SUDAH DIHAPUS */}

              <Icon
                sx={{
                  fontSize: "1.2rem", // Sedikit diperbesar karena garis sudah hilang
                  color: isActive ? "#3dffa0" : "#444",
                  transition: "color 0.2s",
                  filter: isActive
                    ? "drop-shadow(0 0 5px rgba(61,255,160,0.4))"
                    : "none",
                }}
              />
              <span
                style={{
                  fontSize: "0.55rem",
                  fontWeight: 700,
                  color: isActive ? "#3dffa0" : "#444",
                  fontFamily: "'Inter', sans-serif",
                  transition: "color 0.2s",
                  textAlign: "center",
                  whiteSpace: "nowrap",
                  letterSpacing: "0.02em",
                }}
              >
                {name.toUpperCase()}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
