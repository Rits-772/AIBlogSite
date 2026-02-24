import { motion } from "framer-motion";

const MOCK_POSTS = [
  {
    id: 1,
    title: "On the Disappearance of Slow Reading",
    excerpt: "We've optimized our way out of comprehension. The modern reader skims, scans, and scrolls — but rarely sits with a sentence long enough to let it change them.",
    author: "Elena Vasquez",
    date: "Feb 18, 2026",
    category: "Essay",
    readTime: "8 min",
  },
  {
    id: 2,
    title: "The Architecture of Silence in Digital Spaces",
    excerpt: "Every pixel competes for attention. What if design's highest ambition wasn't to capture the eye, but to quiet the mind?",
    author: "Thomas Okoro",
    date: "Feb 15, 2026",
    category: "Design",
    readTime: "12 min",
  },
  {
    id: 3,
    title: "Why I Stopped Using AI to Write and Started Using It to Think",
    excerpt: "The tool isn't the problem. The relationship is. When I stopped asking AI to write for me and started asking it to challenge me, everything shifted.",
    author: "Mira Chatterjee",
    date: "Feb 12, 2026",
    category: "Technology",
    readTime: "6 min",
  },
];

const EditorialFeed = () => {
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
          <button className="hidden font-mono text-[12px] uppercase tracking-[0.3em] text-muted-foreground/60 transition-all duration-300 hover:text-primary sm:block border-b border-transparent hover:border-primary/30">
            View All Essays —
          </button>
        </div>

        {/* Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">
          {MOCK_POSTS.map((post, index) => {
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
                key={post.id}
                initial={{ opacity: 0, scale: 0.98, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`${containerClass} m-0 overflow-hidden ${index === 0 ? 'rounded-[15px]' : 'rounded-[10px]'}`}
              >
                <div className="flex flex-col gap-0 mb-8">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[12px] uppercase tracking-[0.3em] text-primary">
                      {post.category}
                    </span>
                    <div className="h-px w-4 bg-border" />
                    <span className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-widest">
                      {post.date}
                    </span>
                  </div>

                  <div>
                    <h3 className={`${index === 0 ? 'text-h2' : 'text-h3'} font-display text-foreground transition-colors duration-500 group-hover:text-primary leading-tight tracking-tight`}>
                      {post.title}
                    </h3>
                    <p className={`mt-4 font-body ${index === 0 ? 'text-body-lg' : 'text-body'} text-muted-foreground/70 leading-relaxed line-clamp-3`}>
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t border-border/50 flex justify-between items-center">
                  <span className="font-body text-small italic text-muted-foreground/80">
                    by {post.author}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-widest text-primary/0 transition-all duration-300 group-hover:text-primary">
                    Read →
                  </span>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default EditorialFeed;
