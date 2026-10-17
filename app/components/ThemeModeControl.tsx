"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Desktop, Moon, Sun } from "@phosphor-icons/react";
import styles from "./ThemeModeControl.module.css";

type ThemeMode = "light" | "system" | "dark";
const storageKey = "soki-theme-mode";
const changeEvent = "soki-theme-mode-change";
let fallbackMode: ThemeMode = "system";

function readMode(): ThemeMode {
  try {
    const value = localStorage.getItem(storageKey);
    return value === "light" || value === "dark" || value === "system" ? value : "system";
  } catch {
    return fallbackMode;
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(changeEvent, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(changeEvent, onChange);
  };
}

const modes = [
  { value: "light", label: "浅色模式", icon: Sun },
  { value: "system", label: "跟随系统", icon: Desktop },
  { value: "dark", label: "深色模式", icon: Moon },
] as const;

function selectMode(next: ThemeMode) {
  fallbackMode = next;
  try { localStorage.setItem(storageKey, next); } catch { /* Keep the choice for this session. */ }
  window.dispatchEvent(new Event(changeEvent));
}

export function ThemeModeControl() {
  const mode = useSyncExternalStore(subscribe, readMode, () => "system" as const);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      document.documentElement.dataset.theme = mode === "dark" || (mode === "system" && media.matches) ? "dark" : "light";
    };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [mode]);

  return <div className={styles.control} role="group" aria-label="显示模式">
    {modes.map(({ value, label, icon: Icon }) => <button key={value} type="button" aria-label={label} aria-pressed={mode === value} data-tooltip={label} onClick={() => selectMode(value)}>
      <Icon size={19} aria-hidden="true" />
    </button>)}
  </div>;
}
