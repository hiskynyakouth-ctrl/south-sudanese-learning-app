import { useEffect, useRef, useState } from "react";

const COUNTRIES = [
  { code: "+211", name: "South Sudan",  iso: "ss" },
  { code: "+256", name: "Uganda",       iso: "ug" },
  { code: "+251", name: "Ethiopia",     iso: "et" },
  { code: "+254", name: "Kenya",        iso: "ke" },
  { code: "+249", name: "Sudan",        iso: "sd" },
  { code: "+1",   name: "USA/Canada",   iso: "us" },
  { code: "+44",  name: "UK",           iso: "gb" },
];

export default function CountryCodePicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  const selected = COUNTRIES.find(c => c.code === value) || COUNTRIES[0];

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="ccp-wrap" ref={ref}>
      {/* Trigger button */}
      <button type="button" className="ccp-trigger" onClick={() => setOpen(o => !o)}>
        <img
          src={`https://flagcdn.com/w40/${selected.iso}.png`}
          alt={selected.name}
          className="ccp-flag"
          onError={e => { e.target.onerror = null; e.target.style.display = "none"; }}
        />
        <span className="ccp-code">{selected.code}</span>
        <svg className={`ccp-chevron${open ? " open" : ""}`} width="12" height="12" viewBox="0 0 12 12">
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="ccp-dropdown">
          {COUNTRIES.map(c => (
            <button
              key={c.code}
              type="button"
              className={`ccp-option${c.code === value ? " selected" : ""}`}
              onClick={() => { onChange(c.code); setOpen(false); }}
            >
              <img
                src={`https://flagcdn.com/w40/${c.iso}.png`}
                alt={c.name}
                className="ccp-flag"
                onError={e => { e.target.onerror = null; e.target.style.display = "none"; }}
              />
              <span className="ccp-option-code">{c.code}</span>
              <span className="ccp-option-name">{c.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
