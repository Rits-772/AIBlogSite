import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../integrations/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import ClickSpark from "../components/animations/ClickSpark";

const Auth = () => {
  const [mode, setMode] = useState("login"); // login, signup, forgot-password, otp
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const captchaRef = useRef(null);
  const navigate = useNavigate();

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setCaptchaToken("");
    if (captchaRef.current) captchaRef.current.resetCaptcha();
  };

  const onCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const handleLogin = async () => {
    if (!captchaToken) {
      toast.error("Please complete the captcha");
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ 
      email, 
      password,
      options: { captchaToken }
    });
    if (error) throw error;
    navigate("/dashboard");
  };

  const handleSignUp = async () => {
    if (!captchaToken) {
      toast.error("Please complete the captcha");
      return;
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { 
        data: { username },
        captchaToken
      },
    });
    if (error) throw error;
    toast.info("Account created. Check your email for verification.");
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

  const handleVerifyOTP = async () => {
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'signup' // or 'recovery' depending on flow
    });
    if (error) throw error;
    toast.success("Identity verified.");
    navigate("/dashboard");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "login") await handleLogin();
      else if (mode === "signup") await handleSignUp();
      else if (mode === "forgot-password") await handleForgotPassword();
      else if (mode === "otp") await handleVerifyOTP();
    } catch (error) {
      toast.error(error.message);
      if (captchaRef.current) captchaRef.current.resetCaptcha();
      setCaptchaToken("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ClickSpark sparkColor="hsl(var(--primary))">
      <div className="min-h-screen bg-atmosphere-deep flex items-center justify-center px-6 transition-colors duration-500">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Back */}
        <Link
          to="/"
          className="inline-block mb-12 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-all duration-300 hover:text-foreground"
        >
          ← Back
        </Link>

        {/* Header */}
        <div className="mb-10">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary">
            {mode === "login" && "Welcome Back"}
            {mode === "signup" && "Join Us"}
            {mode === "forgot-password" && "Reset Password"}
            {mode === "otp" && "Verify Identity"}
          </span>
          <h1 className="mt-2 font-display text-h1 text-foreground">
            {mode === "login" && "Sign In"}
            {mode === "signup" && "Create Account"}
            {mode === "forgot-password" && "Forgot Password"}
            {mode === "otp" && "Enter OTP"}
          </h1>
          <p className="mt-3 font-body text-body text-muted-foreground">
            {mode === "login" && "Enter your editorial space."}
            {mode === "signup" && "Begin your writing journey."}
            {mode === "forgot-password" && "We'll send you a recovery link."}
            {mode === "otp" && "Check your email for a 6-digit code."}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence mode="wait">
            {mode === "signup" ? (
              <motion.div
                key="signup-fields"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full bg-transparent border-b border-border py-3 font-body text-body text-foreground outline-none transition-colors duration-300 focus:border-primary placeholder:text-muted-foreground/30"
                    placeholder="Your pen name"
                  />
                </div>
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-transparent border-b border-border py-3 font-body text-body text-foreground outline-none transition-colors duration-300 focus:border-primary placeholder:text-muted-foreground/30"
                    placeholder="writer@example.com"
                  />
                </div>
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full bg-transparent border-b border-border py-3 font-body text-body text-foreground outline-none transition-colors duration-300 focus:border-primary placeholder:text-muted-foreground/30"
                    placeholder="••••••••"
                  />
                </div>
              </motion.div>
            ) : mode === "login" ? (
              <motion.div
                key="login-fields"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-transparent border-b border-border py-3 font-body text-body text-foreground outline-none transition-colors duration-300 focus:border-primary placeholder:text-muted-foreground/30"
                    placeholder="writer@example.com"
                  />
                </div>
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-transparent border-b border-border py-3 font-body text-body text-foreground outline-none transition-colors duration-300 focus:border-primary placeholder:text-muted-foreground/30"
                    placeholder="••••••••"
                  />
                </div>
              </motion.div>
            ) : mode === "forgot-password" ? (
              <motion.div
                key="forgot-password-field"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-transparent border-b border-border py-3 font-body text-body text-foreground outline-none transition-colors duration-300 focus:border-primary placeholder:text-muted-foreground/30"
                  placeholder="writer@example.com"
                />
              </motion.div>
            ) : (
              <motion.div
                key="otp-field"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="w-full bg-transparent border-b border-border py-3 font-mono text-h2 text-center text-primary tracking-[0.5em] outline-none transition-colors duration-300 focus:border-primary placeholder:text-muted-foreground/10"
                  placeholder="000000"
                  maxLength={6}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {(mode === "login" || mode === "signup") && (
            <div className="flex justify-center py-4 bg-muted/30 rounded-lg">
              <HCaptcha
                sitekey="10000000-ffff-ffff-ffff-000000000001" // Test sitekey
                onVerify={onCaptchaChange}
                ref={captchaRef}
                theme="dark"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full border border-primary bg-primary py-3.5 font-mono text-[10px] uppercase tracking-[0.2em] text-primary-foreground transition-all duration-500 hover:bg-transparent hover:text-primary disabled:opacity-50"
          >
            {loading ? "..." : 
              mode === "login" ? "Enter" : 
              mode === "signup" ? "Create Account" : 
              mode === "forgot-password" ? "Send Link" : 
              "Verify"}
          </button>
        </form>

        {/* Toggle & Extra Links */}
        <div className="mt-8 space-y-4 text-center">
          <p className="font-body text-small text-muted-foreground">
            {mode === "login" && (
              <>
                No account yet?{" "}
                <button onClick={() => handleModeChange("signup")} className="text-primary hover:text-foreground">Create one</button>
              </>
            )}
            {mode === "signup" && (
              <>
                Already have an account?{" "}
                <button onClick={() => handleModeChange("login")} className="text-primary hover:text-foreground">Sign in</button>
              </>
            )}
            {mode === "forgot-password" && (
              <button onClick={() => handleModeChange("login")} className="text-primary hover:text-foreground">Back to Sign In</button>
            )}
            {mode === "otp" && (
              <button onClick={() => handleModeChange("login")} className="text-primary hover:text-foreground">Go Back</button>
            )}
          </p>
          
          {mode === "login" && (
            <button 
              onClick={() => handleModeChange("forgot-password")}
              className="block w-full font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
            >
              Forgot Password?
            </button>
          )}

          {mode === "login" && (
            <button 
              onClick={() => handleModeChange("otp")}
              className="block w-full font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60 hover:text-primary transition-colors"
            >
              Verify with OTP instead?
            </button>
          )}
        </div>
      </motion.div>
    </div>
    </ClickSpark>
  );
};

export default Auth;
