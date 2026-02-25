import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { posts as postsApi } from "../utils/api";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { motion } from "framer-motion";
import AnimatedList from "../components/animations/AnimatedList";
import ClickSpark from "../components/animations/ClickSpark";
import { Box } from "lucide-react";
import { getFallbackImage } from "../utils/assets";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 12;

  const fetchPosts = async (pageNum = 1) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const response = await postsApi.getAll({
        page: pageNum,
        limit: PAGE_SIZE,
      });

      const { data, total, pages } = response;
      
      if (pageNum === 1) setPosts(data);
      else setPosts(prev => [...prev, ...data]);
      
      if (pageNum >= pages) setHasMore(false);
    } catch (err) {
      console.error("Error fetching feed:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
    setPage(1);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage);
  };

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
              <span className="font-mono text-[12px] uppercase tracking-[0.4em] text-primary/80">Public Feed</span>
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
                const authorName = post.author?.name || "Anonymous";
                
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
                    key={post._id}
                    initial={{ opacity: 0, scale: 0.98, y: 20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: (index % PAGE_SIZE) * 0.05 }}
                    className={containerClass}
                  >
                    <Link to={`/blog/${post.slug || post._id}`} className="block h-full flex flex-col">
                      <div className="relative h-48 w-full mb-6 overflow-hidden rounded-lg border border-border/50 group-hover:border-primary/30 transition-all">
                        <img 
                          src={post.thumbnail_url || getFallbackImage(index)} 
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-60" />
                      </div>
                      
                      <div className="flex flex-col gap-4 mb-8">
                        <div className="flex items-center gap-3">
                          {post.category && (
                            <span className="font-mono text-[12px] uppercase tracking-[0.3em] text-primary">
                              {post.category}
                            </span>
                          )}
                          {(post.category) && <div className="h-px w-4 bg-border" />}
                          <span className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-widest">
                            {new Date(post.createdAt).toLocaleDateString("en-US", {
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
                            {getExcerpt(post.content, index === 0 ? 300 : index % 5 === 0 ? 150 : 100)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-auto pt-6 border-t border-border/50 flex justify-between items-center">
                        <span className="font-body text-small italic text-muted-foreground/80">
                          by {authorName}
                        </span>
                        <span className="font-mono text-[11px] uppercase tracking-widest text-primary/0 transition-all duration-300 group-hover:text-primary">
                          Read →
                        </span>
                      </div>
                    </Link>
                  </motion.article>
                );
              })}
            </div>
          )}

          {hasMore && posts.length > 0 && (
            <div className="mt-20 flex justify-center">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="group flex flex-col items-center gap-4 focus:outline-none"
              >
                <div className="p-5 rounded-full border border-border/60 bg-card/10 group-hover:border-primary/40 group-hover:bg-primary/5 transition-all duration-500">
                  <Box className={`h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors ${loadingMore ? 'animate-bounce' : ''}`} />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground group-hover:text-primary transition-colors">
                  {loadingMore ? "Unfolding..." : "Load More"}
                </span>
              </button>
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
