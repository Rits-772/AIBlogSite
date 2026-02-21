const Footer = () => {
  return (
    <footer className="border-t border-border bg-background transition-colors duration-500">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12">
        <div className="flex flex-col gap-12 md:flex-row md:justify-between">
          {/* Brand */}
          <div className="max-w-sm">
            <h3 className="font-display text-h3 text-foreground transition-colors duration-500">Midnight Typewriter</h3>
            <p className="mt-4 font-body text-body text-muted-foreground leading-relaxed">
              A literary publishing space where words matter more than widgets. Crafted for writers who reject the generic.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-16">
            <div>
              <h4 className="font-mono text-[10px] uppercase tracking-widest text-primary mb-4">Platform</h4>
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
              <h4 className="font-mono text-[10px] uppercase tracking-widest text-primary mb-4">About</h4>
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
          <span className="font-mono text-[10px] text-muted-foreground tracking-wider uppercase">
            © 2026 Midnight Typewriter
          </span>
          <span className="font-mono text-[10px] text-muted-foreground tracking-wider uppercase">
            Crafted, not generated.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
