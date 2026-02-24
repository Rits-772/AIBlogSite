import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../integrations/supabase/client";
import ThemeToggle from "../ThemeToggle";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });
    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-12">
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-3 ml-0.5 mr-auto justify-center flex-wrap w-auto self-center text-[20px]">
          <span className="font-display text-h3 tracking-tighter text-foreground transition-colors duration-300 group-hover:text-primary" style={{ marginLeft: "-6px", marginRight: "-6px" }}>
            Midnight
          </span>
          <div className="h-4 w-px bg-border group-hover:bg-primary/20 transition-colors" />
          <span className="font-mono text-[12px] uppercase tracking-[0.3em] text-muted-foreground/60" style={{ textAlign: "left", marginLeft: "-6px", marginRight: "-6px" }}>
            Typewriter
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden items-center gap-8 md:flex text-[14px]">
          <Link
            to="/#about"
            onClick={(e) => {
              if (window.location.pathname === "/") {
                e.preventDefault();
                document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="font-mono text-small uppercase tracking-widest text-muted-foreground transition-all duration-300 hover:text-primary hover:tracking-[0.15em]"
          >
            About
          </Link>
          <Link
            to="/feed"
            className="font-mono text-small uppercase tracking-widest text-muted-foreground transition-all duration-300 hover:text-primary hover:tracking-[0.15em]"
          >
            Feed
          </Link>
          <a
            href="mailto:hello@midnight.typewriter"
            className="font-mono text-small uppercase tracking-widest text-muted-foreground transition-all duration-300 hover:text-primary hover:tracking-[0.15em]"
          >
            Contact
          </a>
          {isLoggedIn ? (
            <>
              <Link
                to="/write"
                className="font-mono text-small uppercase tracking-widest text-muted-foreground transition-all duration-300 hover:text-primary hover:tracking-[0.15em]"
              >
                Write
              </Link>
              <Link
                to="/dashboard"
                className="border border-primary px-5 py-2 font-mono text-xs uppercase tracking-widest text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground rounded-[15px] overflow-hidden"
              >
                Dashboard
              </Link>
            </>
          ) : (
            <Link
              to="/auth"
              className="relative border border-primary/40 px-6 py-2.5 font-mono text-[12px] uppercase tracking-[0.25em] text-primary transition-all duration-500 hover:bg-primary hover:text-primary-foreground active:scale-95 rounded-[25px] overflow-hidden"
            >
              Sign In
            </Link>
          )}
          <ThemeToggle />
        </nav>

        {/* Mobile menu toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <ThemeToggle />
          <button className="flex flex-col gap-1.5" onClick={() => navigate(isLoggedIn ? "/dashboard" : "/auth")}>
            <span className="h-px w-6 bg-foreground transition-all" />
            <span className="h-px w-4 bg-foreground transition-all" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
