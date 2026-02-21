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
    <section className="bg-atmosphere py-32">
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
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary/80">
                Latest
              </span>
            </div>
            <h2 className="font-display text-h2 text-foreground tracking-tight">
              From the Feed
            </h2>
          </motion.div>
          <button className="hidden font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60 transition-all duration-300 hover:text-primary sm:block border-b border-transparent hover:border-primary/30">
            View All Essays —
          </button>
        </div>

        {/* Posts */}
        <div className="space-y-0">
          {MOCK_POSTS.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group cursor-pointer border-b border-border py-10 transition-colors duration-500 hover:border-primary/30 first:pt-0"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                {/* Left: meta */}
                <div className="flex items-center gap-4 lg:w-48 lg:flex-col lg:items-start lg:gap-2">
                  <span className="font-mono text-xs uppercase tracking-widest text-primary mr-2 lg:mr-0">
                    {post.category}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground mr-2 lg:mr-0">
                    {post.date}
                  </span>
                  <span className="hidden font-mono text-xs text-muted-foreground lg:block">
                    {post.readTime} read
                  </span>
                </div>

                {/* Center: content */}
                <div className="flex-1 lg:max-w-2xl">
                  <h3 className="font-display text-h3 text-foreground transition-colors duration-500 group-hover:text-primary leading-tight">
                    {post.title}
                  </h3>
                  <p className="mt-5 font-body text-body-lg text-muted-foreground/70 leading-relaxed max-w-xl">
                    {post.excerpt}
                  </p>
                </div>

                {/* Right: author */}
                <div className="lg:w-40 lg:text-right">
                  <span className="font-body text-small italic text-muted-foreground">
                    by {post.author}
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EditorialFeed;
