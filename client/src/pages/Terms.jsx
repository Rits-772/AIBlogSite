import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { motion } from "framer-motion";

const Terms = () => {
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
            <h1 className="font-display text-h1 text-foreground mb-8">Terms of Service</h1>
            <div className="prose prose-lg dark:prose-invert max-w-none font-body text-muted-foreground leading-relaxed">
              <p className="mb-6">
                Welcome to Midnight Typewriter. By using our platform, you agree to these terms.
              </p>
              <h2 className="font-display text-h3 text-foreground mt-12 mb-4">1. Authorship</h2>
              <p className="mb-6">
                You are responsible for the content you publish. We reject plagiarism and expect all users to respect intellectual property rights.
              </p>
              <h2 className="font-display text-h3 text-foreground mt-12 mb-4">2. AI-Generated Content</h2>
              <p className="mb-6">
                While our platform provides AI drafting tools, the final responsibility for the accuracy and originality of the content lies with the user. AI-assisted posts should be reviewed and edited.
              </p>
              <h2 className="font-display text-h3 text-foreground mt-12 mb-4">3. Prohibited Conduct</h2>
              <p className="mb-6">
                Harassment, hate speech, and spam are strictly prohibited. We reserve the right to remove content or suspend accounts that violate these core principles.
              </p>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
