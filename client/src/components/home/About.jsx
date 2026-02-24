import { motion } from "framer-motion";
import { Feather, Wind, Sparkles, PenTool } from "lucide-react";

const About = () => {
  return (
    <section id="about" className="bg-background py-32 transition-colors duration-500 border-y border-border/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="flex flex-col gap-16 lg:flex-row lg:items-center">
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-8 bg-teal/40" />
                <span className="font-mono text-[15px] uppercase tracking-[0.4em] text-teal">
                  Our Philosophy
                </span>
              </div>
              <h2 className="mt-2 font-display text-[25px] text-foreground leading-tight">
                For those who think <br />
                <span className="italic text-primary">before they publish.</span>
              </h2>
              <p className="mt-8 font-body text-body-lg text-muted-foreground leading-relaxed max-w-xl">
                In an era of instant output, we choose the deliberate. Midnight Typewriter is an editorial platform designed for writers who value the texture of a sentence as much as the weight of an idea.
              </p>
              <p className="mt-6 font-body text-body text-muted-foreground leading-relaxed max-w-xl">
                We believe that AI should be a mirror for your own intellect, not a replacement for it. Our tools are built to help you refine, expand, and structure your thoughts while keeping your unique voice firmly at the center of every piece.
              </p>
            </motion.div>
          </div>
          
          <div className="lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Intentionality",
                desc: "Every feature is crafted to slow you down exactly where it matters.",
                icon: Feather
              },
              {
                title: "Atmospheric",
                desc: "A distraction-free environment that adapts to your creative mood.",
                icon: Wind
              },
              {
                title: "AI Collaboration",
                desc: "Sophisticated assistance that respects the boundaries of authorship.",
                icon: Sparkles
              },
              {
                title: "Artisan Quality",
                desc: "Because great writing deserves a platform that feels like fine stationery.",
                icon: PenTool
              }
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="border border-border p-10 bg-card/30 backdrop-blur-sm transition-all duration-500 hover:border-primary/30 group font-semibold rounded-[10px] overflow-hidden"
              >
                <item.icon className="w-6 h-6 text-primary/60 mb-6 transition-transform duration-500 group-hover:scale-110" />
                <h4 className="font-display text-h4 text-foreground mb-4">{item.title}</h4>
                <p className="font-body text-small text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
