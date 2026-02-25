import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "../../utils/api";
import ThemeToggle from "../ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight } from "lucide-react";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { user } = await auth.getMe();
        setIsLoggedIn(!!user);
      } catch (err) {
        setIsLoggedIn(false);
      }
    };
    checkSession();
  }, [window.location.pathname]); // Re-check on navigation

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
          <a
            href="/#about"
            onClick={(e) => {
              if (window.location.pathname === "/") {
                e.preventDefault();
                document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="font-mono text-small uppercase tracking-widest text-muted-foreground transition-all duration-300 hover:text-primary hover:tracking-[0.15em]"
          >
            About
          </a>
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
                className="font-mono text-small uppercase tracking-widest text-muted-foreground transition-all duration-300 hover:text-primary hover:tracking-[0.15em]"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  auth.logout();
                  setIsLoggedIn(false);
                  navigate("/");
                }}
                className="font-mono text-small uppercase tracking-widest text-muted-foreground transition-all duration-300 hover:text-foreground"
              >
                Sign Out
              </button>
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
          <button 
            className="p-2 text-foreground focus:outline-none" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-40 flex flex-col bg-background/95 backdrop-blur-xl md:hidden pt-24 px-6 pb-12"
          >
            <nav className="flex flex-col gap-6">
              {[
                { name: "About", path: "/#about", isAnchor: true },
                { name: "Feed", path: "/feed" },
                { name: "Contact", path: "mailto:hello@midnight.typewriter", isAnchor: true }
              ].map((item) => (
                item.isAnchor ? (
                  <a
                    key={item.name}
                    href={item.path}
                    onClick={(e) => {
                      setIsMobileMenuOpen(false);
                      if (item.path === "/#about" && window.location.pathname === "/") {
                        e.preventDefault();
                        document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="flex items-center justify-between border-b border-border/50 pb-4 font-display text-h3 text-foreground"
                  >
                    {item.name}
                    <ChevronRight size={20} className="text-primary/40" />
                  </a>
                ) : (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between border-b border-border/50 pb-4 font-display text-h3 text-foreground"
                  >
                    {item.name}
                    <ChevronRight size={20} className="text-primary/40" />
                  </Link>
                )
              ))}
              
              {isLoggedIn ? (
                <>
                  <Link
                    to="/write"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between border-b border-border/50 pb-4 font-display text-h3 text-foreground"
                  >
                    Write
                    <ChevronRight size={20} className="text-primary/40" />
                  </Link>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between border-b border-border/50 pb-4 font-display text-h3 text-foreground"
                  >
                    Dashboard
                    <ChevronRight size={20} className="text-primary/40" />
                  </Link>
                  <button
                    onClick={() => {
                      auth.logout();
                      setIsLoggedIn(false);
                      setIsMobileMenuOpen(false);
                      navigate("/");
                    }}
                    className="mt-8 self-start font-mono text-small uppercase tracking-widest text-primary border border-primary px-8 py-4 transition-all active:scale-95"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mt-8 flex items-center justify-center border border-primary bg-primary py-5 font-mono text-small uppercase tracking-[0.3em] text-primary-foreground transition-all active:scale-95 shadow-xl shadow-primary/20"
                >
                  Sign In
                </Link>
              )}
            </nav>
            <div className="mt-auto flex justify-center">
               <span className="font-mono text-[9px] uppercase tracking-[0.5em] text-muted-foreground/40 italic">Midnight Typewriter</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
