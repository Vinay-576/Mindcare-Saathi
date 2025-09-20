import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Bell } from "lucide-react";
import { useEffect, useState } from "react";

function useTheme() {
  const [theme, setTheme] = useState<string>(
    () =>
      localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"),
  );
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);
  return { theme, setTheme };
}

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [notifGranted, setNotifGranted] = useState(
    Notification.permission === "granted",
  );
  const location = useLocation();

  const requestNotifications = async () => {
    if (!("Notification" in window)) return;
    const perm = await Notification.requestPermission();
    setNotifGranted(perm === "granted");
    if (perm === "granted") {
      new Notification("Daily check-in", {
        body: "How are you feeling today? Tap to log your mood.",
        icon: "/placeholder.svg",
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-teal-400 to-violet-500" />
          <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-teal-600 to-violet-600 bg-clip-text text-transparent">
            Saathi
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link
            to="/"
            className={`hover:text-foreground transition-colors ${location.pathname === "/" ? "text-foreground" : "text-muted-foreground"}`}
          >
            Home
          </Link>
          <Link
            to="/ai"
            className={`hover:text-foreground transition-colors ${location.pathname.startsWith("/ai") ? "text-foreground" : "text-muted-foreground"}`}
          >
            AI
          </Link>
          <Link
            to="/dashboard"
            className={`hover:text-foreground transition-colors ${location.pathname.startsWith("/dashboard") ? "text-foreground" : "text-muted-foreground"}`}
          >
            Dashboard
          </Link>
          <Link
            to="/resources"
            className={`hover:text-foreground transition-colors ${location.pathname.startsWith("/resources") ? "text-foreground" : "text-muted-foreground"}`}
          >
            Resources
          </Link>
          <Link
            to="/about"
            className={`hover:text-foreground transition-colors ${location.pathname.startsWith("/about") ? "text-foreground" : "text-muted-foreground"}`}
          >
            About
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            to="/signin"
            className="hidden sm:inline text-sm text-muted-foreground hover:text-foreground"
          >
            Sign in
          </Link>
          <Link to="/signup">
            <Button size="sm">Sign up</Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          <Button
            variant={notifGranted ? "secondary" : "default"}
            size="icon"
            aria-label="Enable notifications"
            onClick={requestNotifications}
          >
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
