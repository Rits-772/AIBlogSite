import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../integrations/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedList from "../components/animations/AnimatedList";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      setUser(user);
      fetchPosts(user.id);
    };
    checkAuth();
  }, [navigate]);

  const fetchPosts = async (userId) => {
    const { data, error } = await supabase
      .from("posts")
      .select("id, title, status, created_at, updated_at, is_ai_generated, views")
      .eq("author_id", userId)
      .neq("status", "deleted")
      .order("updated_at", { ascending: false });

    if (error) {
      toast.error("Error loading posts: " + error.message);
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (postId) => {
    const { error } = await supabase
      .from("posts")
      .update({ status: "deleted" })
      .eq("id", postId);

    if (error) {
      toast.error("Error deleting post: " + error.message);
    } else {
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      toast.success("Post deleted");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-atmosphere-deep flex items-center justify-center transition-colors duration-500">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground subtle-pulse">Loading editorial space...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-atmosphere-deep transition-colors duration-500">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50 transition-colors duration-500">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-12">
          <Link to="/" className="font-display text-h3 text-foreground transition-all duration-300 hover:text-primary">
            Midnight
          </Link>
          <div className="flex items-center gap-6">
            <Link
              to="/write"
              className="border border-primary px-5 py-2 font-mono text-[10px] uppercase tracking-widest text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
            >
              New Post
            </Link>
            <button
              onClick={handleSignOut}
              className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-colors duration-300 hover:text-foreground"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mx-auto max-w-7xl px-6 py-16 lg:px-12"
      >
        <div className="mb-12">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary">Dashboard</span>
          <h1 className="mt-2 font-display text-h1 text-foreground transition-colors duration-500">Your Posts</h1>
        </div>

        {posts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="border border-border py-20 text-center transition-colors duration-500"
          >
            <p className="font-body text-body-lg text-muted-foreground mb-6">
              No posts yet. Start writing your first piece.
            </p>
            <Link
              to="/write"
              className="inline-block border border-primary px-8 py-3.5 font-mono text-[10px] uppercase tracking-[0.2em] text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
            >
              Write Your First Post
            </Link>
          </motion.div>
        ) : (
          <AnimatedList
            className="space-y-0"
            distance={20}
            direction="vertical"
          >
            {posts.map((post) => (
              <article 
                key={post.id} 
                className="group border-b border-border py-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between transition-colors duration-500"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`font-mono text-[10px] uppercase tracking-widest ${
                        post.status === "published" ? "text-teal" : "text-muted-foreground"
                      }`}
                    >
                      {post.status}
                    </span>
                    {post.is_ai_generated && (
                      <span className="font-mono text-[10px] uppercase tracking-widest text-primary/60">AI Generated</span>
                    )}
                  </div>
                  <Link
                    to={`/write/${post.id}`}
                    className="font-display text-h3 text-foreground transition-colors duration-300 hover:text-primary"
                  >
                    {post.title || "Untitled"}
                  </Link>
                  <p className="mt-1 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                    {new Date(post.updated_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                    {" · "}
                    {post.views || 0} views
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <Link
                    to={`/write/${post.id}`}
                    className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-all duration-300 hover:text-foreground hover:tracking-[0.15em]"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-all duration-300 hover:text-destructive hover:tracking-[0.15em]"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </AnimatedList>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
