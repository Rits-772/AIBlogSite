import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Hero from "../components/home/Hero";
import EditorialFeed from "../components/home/EditorialFeed";
import AIShowcase from "../components/home/AIShowcase";
import About from "../components/home/About";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background transition-colors duration-500"
    >
      <Header />
      <main>
        <Hero />
        <About />
        <EditorialFeed />
        <AIShowcase />
      </main>
      <Footer />
    </motion.div>
  );
};

export default Index;
