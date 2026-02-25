import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { posts as postsApi } from "../../utils/api";
import { getFallbackImage } from "../../utils/assets";

const EditorialFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await postsApi.getAll({ limit: 3 });
        setPosts(data || []);
      } catch (err) {
        console.error("Error loading editorial feed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const getExcerpt = (content, maxLen = 200) => {
    if (!content) return "";
    const stripped = content.replace(/<[^>]*>?/gm, '');
    return stripped.length > maxLen ? stripped.slice(0, maxLen) + "..." : stripped;
  };

  if (loading) return null;
  return (
    <section className="bg-card/40 py-32 border-y border-border/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Section header */}
        <div className="mb-20 flex items-end justify-between border-b border-border pb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="h-px w-6 bg-primary/60" />
              <span className="font-mono text-[12px] uppercase tracking-[0.4em] text-primary/80">
                Latest
              </span>
            </div>
            <h2 className="font-display text-[29px] sm:text-[35px] text-foreground tracking-tight">
              From the Feed
            </h2>
          </motion.div>
          <Link to="/feed" className="hidden font-mono text-[12px] uppercase tracking-[0.3em] text-muted-foreground/60 transition-all duration-300 hover:text-primary sm:block border-b border-transparent hover:border-primary/30">
            View All Essays —
          </Link>
        </div>

        {/* Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">
          {posts.map((post, index) => {
            const authorName = post.author?.name || "Anonymous";
            // Determine styling based on index to create a bento effect
            let containerClass = "p-8 border border-border bg-card/10 backdrop-blur-sm transition-all duration-500 hover:border-primary/40 group flex flex-col justify-between gap-0";
            
            // First post large (2x2)
            if (index === 0) {
              containerClass += " md:col-span-2 lg:col-span-2 lg:row-span-2 bg-card/30";
            } 
            // Third post stretches wide (2x1) 
            // Modifying logic slightly here for a 3-item array to make it look intentionally asymmetric
            else if (index === 2) {
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
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`${containerClass} m-0 overflow-hidden ${index === 0 ? 'rounded-[15px]' : 'rounded-[10px]'}`}
              >
                <Link to={`/blog/${post.slug || post._id}`} className="block h-full flex flex-col">
                <div className="flex flex-col gap-0 mb-8">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[12px] uppercase tracking-[0.3em] text-primary">
                      {post.category}
                    </span>
                    <div className="h-px w-4 bg-border" />
                    <span className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-widest">
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <div>
                    <h3 className={`${index === 0 ? 'text-h2' : 'text-h3'} font-display text-foreground transition-colors duration-500 group-hover:text-primary leading-tight tracking-tight`}>
                      {post.title}
                    </h3>
                    <p className={`mt-4 font-body ${index === 0 ? 'text-body-lg' : 'text-body'} text-muted-foreground/70 leading-relaxed line-clamp-3`}>
                      {getExcerpt(post.content, index === 0 ? 300 : 150)}
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
      </div>
    </section>
  );
};

export default EditorialFeed;
