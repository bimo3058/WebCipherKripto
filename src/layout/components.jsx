// ─── SHARED UI COMPONENTS ────────────────────────────────────
import { createContext, useContext } from "react";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import CloseIcon from "@mui/icons-material/Close";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

// Context untuk mobile mode
export const MobileContext = createContext(false);

// Overhaul Input Style: Industrial Cyber
export const inputStyle = {
  width: "100%",
  background: "#08080c", // Lebih gelap untuk kontras neon
  border: "1px solid #1a1a25",
  borderRadius: "6px",
  color: "#3dffa0", // Teks default hijau neon lembut
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: "0.9rem",
  padding: "0.8rem 1rem",
  outline: "none",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.3)",
};

export const taStyle = {
  ...inputStyle,
  minHeight: "160px",
  resize: "vertical",
  lineHeight: "1.6",
};

export function OutputBox({ result, error, label }) {
  if (!result && !error) return null;
  return (
    <div
      style={{
        marginTop: "1.5rem",
        padding: "1.25rem",
        borderRadius: "8px",
        background: error
          ? "rgba(255,80,80,0.04)"
          : "linear-gradient(135deg, rgba(61,255,160,0.05) 0%, rgba(61,255,160,0.01) 100%)",
        border: `1px solid ${error ? "rgba(255,80,80,0.3)" : "rgba(61,255,160,0.3)"}`,
        borderLeft: `4px solid ${error ? "#ff5050" : "#3dffa0"}`,
        fontFamily: "'JetBrains Mono', monospace",
        boxShadow: error ? "none" : "0 10px 30px rgba(0,0,0,0.2)",
      }}
    >
      <div
        style={{
          fontSize: "0.7rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: error ? "#ff8080" : "#3dffa0",
          marginBottom: "0.6rem",
          fontWeight: 800,
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        {error ? (
          <>
            <WarningAmberIcon sx={{ fontSize: "1rem" }} />
            SYSTEM_ERROR
          </>
        ) : (
          <>
            <div
              style={{
                width: 8,
                height: 8,
                background: "#3dffa0",
                borderRadius: "50%",
                boxShadow: "0 0 8px #3dffa0",
              }}
            />
            {label || "OUTPUT_RESULT"}
          </>
        )}
      </div>
      <div
        style={{
          fontSize: "1.1rem",
          fontWeight: 700,
          color: error ? "#ff8080" : "#fff", // Hasil putih agar lebih terbaca
          wordBreak: "break-all",
          lineHeight: 1.6,
          textShadow: error ? "none" : "0 0 20px rgba(61,255,160,0.2)",
        }}
      >
        {error || result}
      </div>
    </div>
  );
}

export function FieldLabel({ children }) {
  return (
    <div
      style={{
        fontSize: "0.7rem",
        fontWeight: 800,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: "#555", // Warna label lebih redup agar input lebih menonjol
        marginBottom: "0.6rem",
        fontFamily: "'Inter', sans-serif",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
      }}
    >
      <span style={{ color: "#3dffa0" }}>//</span> {children}
    </div>
  );
}

export function BtnRow({ onEncrypt, onDecrypt, onClear, extra, hasText }) {
  const isMobile = useContext(MobileContext);

  const btnBase = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    padding: "0.8rem 1rem",
    borderRadius: "8px",
    fontSize: "0.85rem",
    fontWeight: "800",
    textTransform: "uppercase",
    cursor: "pointer",
    transition: "all 0.2s",
    border: "none",
    fontFamily: "'Inter', sans-serif",
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.75rem",
        marginTop: "auto",
        paddingTop: "2rem",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          flex: isMobile ? "1 1 100%" : "1",
          gap: "0.75rem",
        }}
      >
        {/* ENKRIPSI */}
        <button
          onClick={onEncrypt}
          style={{ ...btnBase, background: "#3dffa0", color: "#000", flex: 1 }}
        >
          <LockIcon sx={{ fontSize: "1rem" }} /> Enkripsi
        </button>

        {/* DEKRIPSI */}
        {onDecrypt && (
          <button
            onClick={onDecrypt}
            style={{
              ...btnBase,
              background: "rgba(61,255,160,0.05)",
              border: "1px solid rgba(61,255,160,0.3)",
              color: "#3dffa0",
              flex: 1,
            }}
          >
            <LockOpenIcon sx={{ fontSize: "1rem" }} /> Dekripsi
          </button>
        )}

        {/* TOMBOL ICON (GRID) */}
        {extra}
      </div>

      {/* TOMBOL CLEAR (WARNA MERAH INDUSTRIAL) */}
      {(!isMobile || hasText) && (
        <button
          onClick={onClear}
          style={{
            ...btnBase,
            flex: isMobile ? "1 1 100%" : "none",
            background: "rgba(255, 80, 80, 0.05)", // Merah transparan tipis
            border: "1px solid rgba(255, 80, 80, 0.4)", // Border merah
            color: "#ff5050", // Teks merah neon
            paddingLeft: "1.5rem",
            paddingRight: "1.5rem",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "rgba(255, 80, 80, 0.1)";
            e.currentTarget.style.boxShadow = "0 0 10px rgba(255, 80, 80, 0.1)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "rgba(255, 80, 80, 0.05)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <CloseIcon sx={{ fontSize: "1rem" }} /> Clear
        </button>
      )}
    </div>
  );
}

export function Desc({ children }) {
  return (
    <div
      style={{
        borderLeft: "2px solid #3dffa0",
        padding: "0.75rem 1.25rem",
        background: "rgba(61,255,160,0.02)",
        color: "#888",
        fontSize: "0.85rem",
        fontFamily: "'Inter', sans-serif",
        lineHeight: 1.8,
        marginBottom: "1.5rem",
        borderRadius: "0 4px 4px 0",
      }}
    >
      {children}
    </div>
  );
}
