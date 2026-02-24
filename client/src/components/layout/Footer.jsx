import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background transition-colors duration-500">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12">
        <div className="flex flex-col gap-12 md:flex-row md:justify-between">
          {/* Brand */}
          <div className="max-w-sm">
            <h3 className="font-display text-[17px] text-foreground transition-colors duration-500">Midnight Typewriter</h3>
            <p className="mt-4 font-body text-[17px] text-muted-foreground leading-relaxed">
              A literary publishing space where words matter more than widgets. Crafted for writers who reject the generic.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 font-mono text-[9px] uppercase tracking-widest text-muted-foreground/60">
              <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <span className="text-border">/</span>
              <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
              <span className="text-border">/</span>
              <a href="/sitemap.xml" className="hover:text-primary transition-colors">Sitemap</a>
            </div>
          </div>

          {/* Links */}
          <div className="flex gap-16 text-[17px]">
            <div>
              <h4 className="font-mono text-[14px] uppercase tracking-widest text-primary mb-4">Platform</h4>
              <ul className="space-y-3">
                {["Public Feed", "Write", "AI Assistant", "Themes"].map((item) => (
                  <li key={item}>
                    <button className="font-body text-small text-muted-foreground transition-colors duration-300 hover:text-foreground">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-mono text-[14px] uppercase tracking-widest text-primary mb-4">About</h4>
              <ul className="space-y-3">
                {["Philosophy", "Design System", "Open Source", "Contact"].map((item) => (
                  <li key={item}>
                    <button className="font-body text-small text-muted-foreground transition-colors duration-300 hover:text-foreground">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex items-center justify-between border-t border-border pt-8 transition-colors duration-500">
          <span className="font-mono text-[15px] text-muted-foreground tracking-wider uppercase">
            © 2026 Midnight Typewriter
          </span>
          <span className="font-mono text-[13px] text-muted-foreground tracking-wider uppercase">
            Crafted, not generated.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
