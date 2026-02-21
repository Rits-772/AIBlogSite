import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-atmosphere-deep flex flex-col items-center justify-center px-6 transition-colors duration-500">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">404</span>
        <h1 className="mt-4 font-display text-hero text-foreground">Lost in the stacks.</h1>
        <p className="mt-6 font-body text-body-lg text-muted-foreground max-w-md mx-auto">
          The page you're looking for doesn't exist in our current volume.
        </p>
        <Link 
          to="/" 
          className="mt-12 inline-block border border-primary px-10 py-4 font-mono text-xs uppercase tracking-[0.2em] text-primary transition-all duration-500 hover:bg-primary hover:text-primary-foreground"
        >
          Return Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
