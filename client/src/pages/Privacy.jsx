import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { motion } from "framer-motion";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background transition-colors duration-500">
      <Header />
      <main className="pt-32 pb-24 px-6">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-display text-h1 text-foreground mb-8">Privacy Policy</h1>
            <div className="prose prose-lg dark:prose-invert max-w-none font-body text-muted-foreground leading-relaxed">
              <p className="mb-6">
                Last updated: February 23, 2026
              </p>
              <p className="mb-6">
                At Midnight Typewriter, we value your privacy as much as your words. This policy outlines how we handle your data.
              </p>
              <h2 className="font-display text-h3 text-foreground mt-12 mb-4">1. Information Collection</h2>
              <p className="mb-6">
                We collect information you provide directly to us, such as when you create an account, write a post, or comment. This includes your email and editorial content.
              </p>
              <h2 className="font-display text-h3 text-foreground mt-12 mb-4">2. AI Services</h2>
              <p className="mb-6">
                Our AI Companion uses third-party LLMs (Groq). When you use AI features, only the topic and tone you provide are sent to the AI service. Your personal account data is never shared with AI providers.
              </p>
              <h2 className="font-display text-h3 text-foreground mt-12 mb-4">3. Data Security</h2>
              <p className="mb-6">
                We use industry-standard encryption and Supabase Auth to protect your credentials and content.
              </p>
              <h2 className="font-display text-h3 text-foreground mt-12 mb-4">4. Your Rights</h2>
              <p className="mb-6">
                You retain full ownership of your writing. You can delete your posts or account at any time via the dashboard.
              </p>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
