import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../integrations/supabase/client";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { motion } from "framer-motion";
import AnimatedList from "../components/animations/AnimatedList";
import ClickSpark from "../components/animations/ClickSpark";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("id, title, content, category, tags, created_at, views, is_ai_generated, profiles:author_id(username)")
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(50);

      if (!error && data) {
        setPosts(data);
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const getExcerpt = (content, maxLen = 200) => {
    if (!content) return "";
    // Strip HTML tags for excerpt
    const stripped = content.replace(/<[^>]*>?/gm, '');
    return stripped.length > maxLen ? stripped.slice(0, maxLen) + "..." : stripped;
  };

  return (
    <ClickSpark sparkColor="hsl(var(--primary))">
      <div className="min-h-screen bg-background transition-colors duration-500">
      <Header />
      <main className="pt-24">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-24 border-b border-border pb-8 transition-colors duration-500"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-primary/40" />
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary/80">Public Feed</span>
            </div>
            <h1 className="font-display text-hero text-foreground tracking-tighter transition-colors duration-500">The Latest</h1>
            <p className="mt-6 max-w-xl font-body text-body-lg text-muted-foreground/80 leading-relaxed">
              Essays, reflections, and ideas from writers who value intention over volume.
            </p>
          </motion.div>

          {loading ? (
            <div className="py-20 text-center">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/40 subtle-pulse">Accessing archives...</span>
            </div>
          ) : posts.length === 0 ? (
            <div className="py-20 text-center transition-colors duration-500">
              <p className="font-body text-body-lg text-muted-foreground/60">
                No published posts yet. Be the first to write.
              </p>
            </div>
          ) : (
            <div className="space-y-0">
              {posts.map((post, index) => {
                const authorName = post.profiles?.username || "Anonymous";
                return (
                  <motion.article 
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.05 }}
                    className="group border-b border-border py-12 first:pt-0 transition-colors duration-500 hover:border-primary/20 cursor-pointer"
                  >
                    <Link to={`/post/${post.id}`} className="block">
                      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex items-center gap-4 lg:w-48 lg:flex-col lg:items-start lg:gap-3">
                          {post.category && (
                            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">
                              {post.category}
                            </span>
                          )}
                          <span className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-widest">
                            {new Date(post.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>

                        <div className="flex-1 lg:max-w-2xl">
                          <h2 className="font-display text-h2 text-foreground transition-colors duration-500 group-hover:text-primary leading-tight tracking-tight">
                            {post.title}
                          </h2>
                          <p className="mt-5 font-body text-body-lg text-muted-foreground/70 leading-relaxed max-w-xl">
                            {getExcerpt(post.content)}
                          </p>
                        </div>

                        <div className="lg:w-48 lg:text-right">
                          <span className="font-body text-body italic text-muted-foreground/60">
                            by {authorName}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
    </ClickSpark>
  );
};

export default Feed;
