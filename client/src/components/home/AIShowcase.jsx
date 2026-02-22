import { motion } from "framer-motion";

const AIShowcase = () => {
  return (
    <section className="relative border-t border-border bg-transparent py-32 overflow-hidden transition-colors duration-500">

      {/* Subtle accent glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="flex flex-col gap-20 lg:flex-row lg:items-start lg:gap-24">
          {/* Left: description */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2"
          >
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-teal">
              AI Assistant
            </span>
            <h2 className="mt-4 font-display text-h2 text-foreground">
              Enhanced,
              <br />
              not replaced.
            </h2>
            <p className="mt-6 max-w-md font-body text-body-lg text-muted-foreground leading-relaxed">
              Our AI doesn't write for you — it thinks alongside you. 
              Choose your tone, set your scope, and receive a structured draft 
              that's yours to shape.
            </p>

            <div className="mt-10 space-y-4">
              {[
                "Prompt-engineered for editorial quality",
                "Powered by Groq for lightning-fast drafts",
                "Tone and length controls",
              ].map((feature, i) => (
                <motion.div 
                  key={feature}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="h-px w-4 bg-primary" />
                  <span className="font-body text-small text-muted-foreground">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: terminal mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="lg:w-1/2"
          >
            <div className="border border-border bg-card p-8 accent-glow transition-colors duration-500">
              {/* Terminal header */}
              <div className="mb-6 flex items-center gap-2 border-b border-border pb-4 transition-colors duration-500">
                <div className="h-2 w-2 bg-primary/60" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  ai.generate.groq
                </span>
              </div>

              {/* Prompt area */}
              <div className="space-y-4">
                <div>
                  <span className="font-mono text-[10px] text-teal uppercase tracking-wider">topic:</span>
                  <p className="mt-1 font-mono text-small text-foreground">
                    "The paradox of productivity culture"
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-teal uppercase tracking-wider">tone:</span>
                  <span className="font-mono text-small text-foreground">contemplative</span>
                </div>
                <div>
                  <span className="font-mono text-[10px] text-teal uppercase tracking-wider">length:</span>
                  <span className="ml-2 font-mono text-small text-foreground">~800 words</span>
                </div>

                <div className="mt-6 border-t border-border pt-6 transition-colors duration-500">
                  <span className="font-mono text-[10px] text-primary uppercase tracking-wider">output:</span>
                  <p className="mt-3 font-body text-body text-muted-foreground leading-relaxed italic">
                    "We measure ourselves in units of output — emails sent, tasks completed, 
                    hours logged — as if the soul were a factory floor awaiting inspection. 
                    But the most meaningful work often happens in the pauses..."
                  </p>
                  <span className="inline-block mt-1 w-1.5 h-3 bg-primary cursor-blink" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AIShowcase;
