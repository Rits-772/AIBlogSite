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
            className="border border-border p-12 lg:p-24 bg-card/20 text-center transition-colors duration-500 flex flex-col items-center justify-center max-w-3xl mx-auto"
          >
            <div className="h-px w-12 bg-primary/40 mb-8" />
            <h2 className="font-display text-h2 text-foreground mb-4">An Empty Page</h2>
            <p className="font-body text-body-lg text-muted-foreground leading-relaxed max-w-lg mb-10">
              The cursor blinks. The page is blank. This is where intention begins. Start writing your first piece.
            </p>
            <Link
              to="/write"
              className="inline-block border border-primary bg-primary px-10 py-4 font-mono text-[10px] uppercase tracking-[0.25em] text-primary-foreground transition-all duration-500 hover:bg-transparent hover:text-primary"
            >
              Enter Editor
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">
            {posts.map((post, index) => {
              // Determine styling based on index to create a bento effect
              let containerClass = "p-8 border border-border bg-card/10 backdrop-blur-sm transition-all duration-500 hover:border-primary/40 group flex flex-col justify-between";
              
              // First post large (2x2)
              if (index === 0) {
                containerClass += " md:col-span-2 lg:col-span-2 lg:row-span-2 bg-card/30";
              } 
              // Every 5th post stretches wide (2x1)
              else if (index % 5 === 0) {
                containerClass += " md:col-span-2 lg:col-span-2 bg-card/20";
              }
              // Default small tile (1x1)
              else {
                containerClass += " col-span-1";
              }

              return (
                <motion.article 
                  key={post.id} 
                  initial={{ opacity: 0, scale: 0.98, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className={containerClass}
                >
                  <div className="flex flex-col gap-4 mb-8">
                    <div className="flex items-center gap-3">
                      <span className={`font-mono text-[10px] uppercase tracking-widest ${post.status === "published" ? "text-teal" : "text-muted-foreground"}`}>
                        {post.status}
                      </span>
                      <div className="h-px w-4 bg-border" />
                      <span className="font-mono text-[9px] text-muted-foreground/60 uppercase tracking-widest">
                        {new Date(post.updated_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      {post.is_ai_generated && (
                        <>
                          <div className="h-px w-4 bg-border hidden sm:block" />
                          <span className="font-mono text-[9px] uppercase tracking-widest text-primary/60 hidden sm:block">AI Draft</span>
                        </>
                      )}
                    </div>

                    <Link to={`/write/${post.id}`} className="block mt-2">
                      <h2 className={`${index === 0 ? 'text-h2' : 'text-h3'} font-display text-foreground transition-colors duration-500 group-hover:text-primary leading-tight tracking-tight`}>
                        {post.title || "Untitled Draft"}
                      </h2>
                    </Link>
                  </div>

                  <div className="mt-auto pt-6 border-t border-border/50 flex justify-between items-center">
                    <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                      {post.views || 0} views
                    </span>
                    <div className="flex items-center gap-4">
                      <Link
                        to={`/write/${post.id}`}
                        className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground transition-all duration-300 hover:text-foreground hover:tracking-[0.15em]"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground transition-all duration-300 hover:text-destructive hover:tracking-[0.15em]"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
