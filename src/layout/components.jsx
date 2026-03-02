// ─── SHARED UI COMPONENTS ────────────────────────────────────
import { createContext, useContext } from "react";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import CloseIcon from "@mui/icons-material/Close";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

// Context untuk mobile mode — panels tidak perlu tahu, BtnRow yang handle
export const MobileContext = createContext(false);

export const inputStyle = {
  width: "100%",
  background: "#111",
  border: "1px solid #2a2a2a",
  borderRadius: "8px",
  color: "#e8e8f0",
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: "0.9rem",
  padding: "0.7rem 1rem",
  outline: "none",
  resize: "vertical",
  transition: "border-color 0.2s",
};

export const taStyle = {
  ...inputStyle,
  minHeight: "160px",
  resize: "vertical",
};

export function OutputBox({ result, error, label }) {
  if (!result && !error) return null;
  return (
    <div
      style={{
        marginTop: "1rem",
        padding: "1rem 1.25rem",
        borderRadius: "10px",
        background: error ? "rgba(255,80,80,0.08)" : "rgba(80,255,180,0.06)",
        border: `1px solid ${error ? "#ff5050" : "#3dffa0"}`,
        fontFamily: "'JetBrains Mono', monospace",
        transition: "all 0.3s",
      }}
    >
      <div
        style={{
          fontSize: "0.8rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: error ? "#ff8080" : "#3dffa0",
          marginBottom: "0.4rem",
        }}
      >
        {error ? (
          <>
            <WarningAmberIcon
              sx={{ fontSize: "0.9rem", mr: 0.5, verticalAlign: "middle" }}
            />{" "}
            Error
          </>
        ) : (
          label
        )}
      </div>
      <div
        style={{
          fontSize: "1rem",
          fontWeight: 700,
          color: error ? "#ff8080" : "#3dffa0",
          wordBreak: "break-all",
          lineHeight: 1.7,
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
        fontSize: "0.82rem",
        fontWeight: 700,
        letterSpacing: "0.13em",
        textTransform: "uppercase",
        color: "#aaa",
        marginBottom: "0.45rem",
      }}
    >
      {children}
    </div>
  );
}

// components.jsx

export function BtnRow({ onEncrypt, onDecrypt, onClear, extra, hasText }) {
  const isMobile = useContext(MobileContext);

  const btnBase = {
    flex: isMobile ? "1 1 140px" : "1", // Di mobile, minimal 140px sebelum wrap
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    padding: "0.75rem 1rem",
    borderRadius: "8px",
    fontSize: "0.85rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
    border: "none",
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap", // Agar tombol Clear bisa turun jika sempit
        gap: "0.75rem",
        marginTop: "auto", // KUNCI: Mendorong tombol ke posisi paling bawah layar
        paddingTop: "1.5rem",
        width: "100%",
      }}
    >
      {/* Container untuk Tombol Utama (Enkripsi & Dekripsi) */}
      {/* Kita pakai flex: 1 1 250px agar mereka sebisa mungkin berjejer */}
      <div
        style={{
          display: "flex",
          flex: isMobile ? "1 1 250px" : "1",
          gap: "0.75rem",
          minWidth: isMobile ? "100%" : "auto",
        }}
      >
        <button
          onClick={onEncrypt}
          style={{ ...btnBase, background: "#3dffa0", color: "#000", flex: 1 }}
        >
          <LockIcon sx={{ fontSize: "1rem" }} /> Enkripsi
        </button>
        {onDecrypt && (
          <button
            onClick={onDecrypt}
            style={{
              ...btnBase,
              background: "transparent",
              border: "2px solid #3dffa0",
              color: "#3dffa0",
              flex: 1,
            }}
          >
            <LockOpenIcon sx={{ fontSize: "1rem" }} /> Dekripsi
          </button>
        )}
      </div>

      {/* Tombol Extra (jika ada, misal Playfair) */}
      {extra && (
        <div style={{ flex: isMobile ? "1 1 100%" : "none" }}>{extra}</div>
      )}

      {/* Tombol Clear */}
      {(!isMobile || hasText) && (
        <button
          onClick={onClear}
          style={{
            ...btnBase,
            flex: isMobile ? "1 1 100%" : "none", // Di mobile dia jadi lebar penuh di bawah
            background: "transparent",
            border: "2px solid #2a2a2a",
            color: "#aaa",
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
        borderLeft: "3px solid #3dffa0",
        paddingLeft: "1rem",
        color: "#bbb",
        fontSize: "0.92rem",
        fontFamily: "'Inter', sans-serif",
        lineHeight: 1.7,
        marginBottom: "1.25rem",
      }}
    >
      {children}
    </div>
  );
}
