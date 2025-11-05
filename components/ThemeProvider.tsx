"use client";

import { useEffect, useState } from "react";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");

  useEffect(() => {
    const savedTheme =
      (localStorage.getItem("theme") as "light" | "dark" | "system") || "system";
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const appliedTheme =
      savedTheme === "system" ? (prefersDark ? "dark" : "light") : savedTheme;

    document.documentElement.setAttribute("data-theme", appliedTheme);
    setTheme(appliedTheme);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      const currentSetting = localStorage.getItem("theme") as
        | "light"
        | "dark"
        | "system";
      if (currentSetting === "system" || !currentSetting) {
        const systemTheme = e.matches ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", systemTheme);
        setTheme(systemTheme);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return <>{children}</>;
}