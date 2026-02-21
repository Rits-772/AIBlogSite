import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../integrations/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have a session (recovery link sets a session)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Invalid or expired reset link.");
        navigate("/auth");
      }
    };
    checkSession();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated successfully.");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-atmosphere-deep flex items-center justify-center px-6 transition-colors duration-500">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="mb-10 text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary">Security</span>
          <h1 className="mt-2 font-display text-h1 text-foreground">New Password</h1>
          <p className="mt-3 font-body text-body text-muted-foreground">
            Set a strong password for your editorial space.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block">
              New Password
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

          <div>
            <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-transparent border-b border-border py-3 font-body text-body text-foreground outline-none transition-colors duration-300 focus:border-primary placeholder:text-muted-foreground/30"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full border border-primary bg-primary py-3.5 font-mono text-[10px] uppercase tracking-[0.2em] text-primary-foreground transition-all duration-500 hover:bg-transparent hover:text-primary disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
