import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative flex items-center justify-center p-2 rounded-full border border-border bg-card/50 hover:bg-accent transition-all duration-300"
      aria-label="Toggle theme"
    >
      <div className="relative h-4 w-4">
        {theme === "dark" ? (
          <Sun className="h-4 w-4 text-saffron transition-all" />
        ) : (
          <Moon className="h-4 w-4 text-teal transition-all" />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;
