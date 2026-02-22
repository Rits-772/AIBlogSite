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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">
              {posts.map((post, index) => {
                const authorName = post.profiles?.username || "Anonymous";
                
                // Determine styling based on index to create a bento effect
                let containerClass = "p-8 border border-border bg-card/10 backdrop-blur-sm transition-all duration-500 hover:border-primary/40 group flex flex-col justify-between";
                
                // Make the first post large (2x2)
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
                    <Link to={`/post/${post.id}`} className="block h-full flex flex-col">
                      <div className="flex flex-col gap-4 mb-8">
                        <div className="flex items-center gap-3">
                          {post.category && (
                            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">
                              {post.category}
                            </span>
                          )}
                          {(post.category) && <div className="h-px w-4 bg-border" />}
                          <span className="font-mono text-[9px] text-muted-foreground/60 uppercase tracking-widest">
                            {new Date(post.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric"
                            })}
                          </span>
                        </div>

                        <div>
                          <h2 className={`${index === 0 ? 'text-h2' : 'text-h3'} font-display text-foreground transition-colors duration-500 group-hover:text-primary leading-tight tracking-tight`}>
                            {post.title}
                          </h2>
                          <p className={`mt-4 font-body ${index === 0 ? 'text-body-lg' : 'text-body'} text-muted-foreground/70 leading-relaxed line-clamp-3`}>
                            {getExcerpt(post.content, index === 0 ? 300 : Math.random() > 0.5 ? 150 : 100)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-auto pt-6 border-t border-border/50 flex justify-between items-center">
                        <span className="font-body text-small italic text-muted-foreground/80">
                          by {authorName}
                        </span>
                        <span className="font-mono text-[9px] uppercase tracking-widest text-primary/0 transition-all duration-300 group-hover:text-primary">
                          Read →
                        </span>
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
