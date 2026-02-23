import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../integrations/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const Auth = () => {
  const [mode, setMode] = useState("login"); // login, signup, forgot-password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleModeChange = (newMode) => {
    setMode(newMode);
  };

  const handleAuthError = (error) => {
    // Provide cleaner error messages instead of raw 400 Bad Request
    if (error.status === 400 && error.message.includes("Invalid login credentials")) {
      toast.error("Incorrect email or password. Please try again.");
    } else {
      toast.error(error.message || "An authentication error occurred.");
    }
  };

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    navigate("/dashboard");
  };

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } }
    });
    if (error) throw error;
    toast.info("Account created successfully. Check your email to verify.");
    setMode("login");
  };

  const handleForgotPassword = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
    toast.success("Password reset link sent to your email.");
    setMode("login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "login") await handleLogin();
      else if (mode === "signup") await handleSignUp();
      else if (mode === "forgot-password") await handleForgotPassword();
    } catch (error) {
      console.error("Auth Error:", error);
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Left Panel - Atmospheric Visual */}
      <div className="hidden w-1/2 lg:flex flex-col justify-between border-r border-border p-12 relative overflow-hidden bg-atmosphere-deep">
        <div className="absolute inset-0 z-0">
          <img 
            src="/assets/hero-typewriter.jpg" 
            alt="Atmosphere" 
            className="h-full w-full object-cover opacity-20 grayscale mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
        
        <div className="relative z-10 flex items-center gap-4">
          <span className="font-display text-h3 tracking-tighter text-foreground">
            Midnight
          </span>
          <div className="h-4 w-px bg-primary/40" />
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
            Typewriter
          </span>
        </div>

        <div className="relative z-10 max-w-md">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="font-display text-h2 leading-tight tracking-tight text-foreground/90"
          >
            "The most meaningful work often happens in the <span className="text-primary italic">pauses</span>."
          </motion.p>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-8 flex items-center gap-3"
          >
            <div className="h-px w-8 bg-primary/40" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              A workspace for thought
            </span>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center p-6 sm:p-12 relative">
        {/* Back button (Mobile mainly) */}
        <div className="absolute top-8 left-8">
          <Link
            to="/"
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-all duration-300 hover:text-foreground hover:-translate-x-1 inline-block"
          >
            ← Home
          </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-[400px]"
        >
          {/* Header */}
          <div className="mb-12">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary">
              {mode === "login" && "Authentication"}
              {mode === "signup" && "Registration"}
              {mode === "forgot-password" && "Recovery"}
            </span>
            <h1 className="mt-2 font-display text-[40px] leading-none text-foreground tracking-tight">
              {mode === "login" && "Welcome Back."}
              {mode === "signup" && "Create Space."}
              {mode === "forgot-password" && "Reset Access."}
            </h1>
            <p className="mt-4 font-body text-body text-muted-foreground">
              {mode === "login" && "Enter your credentials to access your workspace."}
              {mode === "signup" && "Join a publishing platform built for intention."}
              {mode === "forgot-password" && "We'll email you a secure link to reset your password."}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode} // Re-animates when mode changes
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {mode === "signup" && (
                  <div className="group relative">
                    <input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      placeholder=" "
                      className="peer w-full bg-transparent border-b border-border py-4 font-body text-body text-foreground outline-none transition-colors focus:border-primary"
                    />
                    <label 
                      htmlFor="username"
                      className="absolute left-0 top-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60 transition-all peer-focus:-top-4 peer-focus:text-[9px] peer-focus:text-primary peer-valid:-top-4 peer-valid:text-[9px]"
                    >
                      Writer Alias
                    </label>
                  </div>
                )}

                <div className="group relative">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder=" "
                    className="peer w-full bg-transparent border-b border-border py-4 font-body text-body text-foreground outline-none transition-colors focus:border-primary"
                  />
                  <label 
                    htmlFor="email"
                    className="absolute left-0 top-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60 transition-all peer-focus:-top-4 peer-focus:text-[9px] peer-focus:text-primary peer-valid:-top-4 peer-valid:text-[9px]"
                  >
                    Email Address
                  </label>
                </div>

                {mode !== "forgot-password" && (
                  <div className="group relative">
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      placeholder=" "
                      className="peer w-full bg-transparent border-b border-border py-4 font-body text-body text-foreground outline-none transition-colors focus:border-primary"
                    />
                    <label 
                      htmlFor="password"
                      className="absolute left-0 top-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60 transition-all peer-focus:-top-4 peer-focus:text-[9px] peer-focus:text-primary peer-valid:-top-4 peer-valid:text-[9px]"
                    >
                      Password
                    </label>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full overflow-hidden border border-primary bg-primary py-4 font-mono text-[10px] uppercase tracking-[0.25em] text-primary-foreground transition-all duration-500 hover:bg-transparent hover:text-primary disabled:opacity-50"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? "Authenticating..." : 
                 mode === "login" ? "Enter Workspace" : 
                 mode === "signup" ? "Begin Journey" : 
                 "Send Recovery Link"}
              </span>
            </button>
          </form>

          {/* Toggle Links */}
          <div className="mt-12 space-y-4 text-[20px]">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-border" />
              <span className="font-mono text-[12px] uppercase tracking-widest text-muted-foreground/50">
                Or
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="flex flex-col items-center gap-3 pt-4 text-[12px]">
              {mode === "login" ? (
                <>
                  <button 
                    onClick={() => handleModeChange("signup")} 
                    className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Create an account
                  </button>
                  <button 
                    onClick={() => handleModeChange("forgot-password")}
                    className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60 hover:text-primary transition-colors"
                  >
                    Forgot Password?
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => handleModeChange("login")} 
                  className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                >
                  Return to Sign In
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
