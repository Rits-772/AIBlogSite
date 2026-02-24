import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SplitText from "../animations/SplitText";
import TextPressure from "../animations/TextPressure";

const Hero = () => {
  return (
    <section className="relative min-h-screen bg-atmosphere-deep overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/assets/hero-typewriter.jpg" 
          alt="Vintage Typewriter" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale brightness-[0.3]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-atmosphere opacity-30 mix-blend-soft-light" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-end px-6 pb-24 pt-32 lg:px-12">
        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-12 bg-primary/40" />
            <span className="font-mono text-[15px] uppercase tracking-[0.5em] text-primary/80 italic m-0 p-0">
              AI-Assisted Editorial Publishing
            </span>
          </div>
        </motion.div>

        {/* Headline */}
        <div className="max-w-5xl mb-12 flex flex-col items-start">
          <div className="h-24 w-full md:h-32 lg:h-48 mb-2 relative -ml-4 pr-12 overflow-visible">
            <TextPressure
              text="Midnight"
              width={true}
              weight={true}
              italic={true}
              textColor="hsl(var(--foreground))"
              minFontSize={80}
              className="!overflow-visible"
            />
          </div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="font-display text-foreground leading-[0.9] mt-0 mb-8 flex flex-wrap items-stretch gap-2 sm:gap-4 text-[29px] sm:text-h1 lg:text-[4rem] pt-10 pb-0"
          >
            Write with <span className="italic text-primary font-semibold">intention.</span>
          </motion.h1>
        </div>

        {/* Subtext */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-8 max-w-2xl"
        >
          <p className="font-body text-body-lg text-muted-foreground/80 leading-relaxed text-left m-0 p-0 -mt-[60px]">
            A publishing platform that rejects the generic. Where typography carries identity, AI enhances without overtaking, and every word finds its atmosphere.
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-12 flex flex-wrap items-stretch gap-8 text-[11px]"
        >
          <Link to="/auth" className="group relative border border-primary bg-primary/90 px-10 py-4 font-mono text-[14px] uppercase tracking-[0.25em] text-primary-foreground transition-all duration-500 hover:bg-transparent hover:text-primary">
            Begin Writing
          </Link>
          <Link to="/feed" className="font-mono text-[16px] uppercase tracking-[0.25em] text-muted-foreground transition-all duration-300 hover:text-primary hover:tracking-[0.3em] pt-[15px] pb-[15px] pl-10 pr-10 border border-[rgba(88,93,107,1)] rounded-[10px] overflow-hidden">
            Explore Feed →
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-20 flex items-center gap-3"
        >
          <div className="h-8 w-px bg-primary/30 subtle-pulse" />
          <span className="font-mono text-xs text-muted-foreground tracking-widest text-[10px]">Read More</span>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
