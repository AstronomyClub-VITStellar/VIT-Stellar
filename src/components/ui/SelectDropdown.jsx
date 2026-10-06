import React, { useState, useEffect, useRef } from 'react';
import Icon from './Icon';

export default function SelectDropdown({ id, value, onChange, options, placeholder = "Select a position" }) {
  const [open, setOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    function handleKeyDown(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleToggle = () => {
    if (!open && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      setDropUp(spaceBelow < 320 && spaceAbove > spaceBelow);
    }
    setOpen((o) => !o);
  };

  return (
    <div className="board-pref-dropdown" ref={ref}>
      <button
        type="button"
        id={id}
        className="board-pref-trigger"
        onClick={handleToggle}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={value ? "" : "board-pref-placeholder"}>{value || placeholder}</span>
        <Icon name="expand_more" className={`board-pref-chevron${open ? " open" : ""}`} />
      </button>

      {open && (
        <ul className={`board-pref-menu${dropUp ? " drop-up" : ""}`} role="listbox" aria-label={placeholder}>
          {options.map((opt) => (
            <li key={opt}>
              <button
                type="button"
                role="option"
                aria-selected={opt === value}
                className={`board-pref-option${opt === value ? " active" : ""}`}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
              >
                {opt}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
