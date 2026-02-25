import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { auth, posts, ai as aiApi } from "../utils/api";

const API = import.meta.env.VITE_API_URL;

const PostDetail = () => {
  const { id, slug } = useParams();
  const identifier = id || slug;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [summary, setSummary] = useState("");
  const [summarizing, setSummarizing] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    auth.getMe().then(({ user }) => setUser(user)).catch(() => setUser(null));

    const fetchPost = async () => {
      if (!identifier) return;

      try {
        const { data } = await posts.getOne(identifier);
        setPost(data);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [identifier]);

  if (loading) {
    return (
      <div className="min-h-screen bg-atmosphere-deep flex items-center justify-center transition-colors duration-500">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground subtle-pulse">Reading from the archives...</span>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-atmosphere-deep flex flex-col items-center justify-center gap-6 transition-colors duration-500">
        <h1 className="font-display text-h2 text-foreground">Post not found</h1>
        <Link to="/feed" className="font-mono text-[10px] uppercase tracking-widest text-primary hover:text-foreground transition-all">
          ← Back to Feed
        </Link>
      </div>
    );
  }

  const authorName = post.author?.name || "Anonymous";

  const handleSummarize = async () => {
    if (summary) {
      setShowSummary(true);
      return;
    }

    setSummarizing(true);
    try {
      const response = await aiApi.summarize(post.content);
      setSummary(response.data);
      setShowSummary(true);
      toast.success("Summary generated");
    } catch (error) {
      toast.error("Failed to generate summary: " + (error.response?.data?.message || error.message));
    } finally {
      setSummarizing(false);
    }
  };

  return (
    <div className="min-h-screen bg-atmosphere-deep transition-colors duration-500">
      <Header />
      <main className="pt-24">
        <motion.article 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-3xl px-6 py-20 lg:px-12"
        >
          {/* Thumbnail */}
          <div className="mb-12 rounded-2xl overflow-hidden border border-border/50 aspect-video relative group">
            <img 
              src={post.thumbnail_url || getFallbackImage(post._id)}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
          </div>

          {/* Meta */}
          <div className="mb-8 flex items-center gap-6">
            {post.category && (
              <span className="font-mono text-[12px] uppercase tracking-[0.25em] text-primary">{post.category}</span>
            )}
            <span className="font-mono text-[12px] text-muted-foreground uppercase tracking-wider">
              {new Date(post.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </span>
            {post.is_ai_generated && (
              <span className="font-mono text-[12px] uppercase tracking-widest text-primary/40">AI-assisted draft</span>
            )}
          </div>

          {/* Title */}
          <h1 className="font-display text-h1 text-foreground mb-6 transition-colors duration-500">{post.title}</h1>

          {/* Author */}
          <p className="font-body text-body italic text-muted-foreground mb-12 pb-8 border-b border-border transition-colors duration-500">
            by {authorName}
          </p>

          {/* Content - Rendered as HTML for Tiptap support with Paywall logic */}
          <div className="relative">
            <div 
              className={`prose prose-lg dark:prose-invert max-w-none font-body text-foreground leading-[1.8] transition-colors duration-500 ${!user ? 'max-h-[500px] overflow-hidden' : ''}`}
              dangerouslySetInnerHTML={{ 
                __html: !user 
                  ? post.content.split(' ').slice(0, 250).join(' ') + '...' 
                  : post.content 
              }}
            />
            
            {!user && (
              <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-atmosphere-deep to-transparent flex flex-col items-center justify-end pb-8">
                <div className="p-8 border border-primary/20 bg-card/60 backdrop-blur-md rounded-2xl text-center shadow-2xl max-w-md mx-auto">
                  <h3 className="font-display text-[24px] text-foreground mb-4">Continue Reading</h3>
                  <p className="font-body text-sm text-muted-foreground mb-6">Join Midnight Typewriter to unlock the full narrative and participate in the dialogue.</p>
                  <Link
                    to="/auth"
                    className="inline-block border border-primary bg-primary px-8 py-4 font-mono text-[12px] uppercase tracking-[0.2em] text-primary-foreground transition-all duration-500 hover:bg-transparent hover:text-primary rounded-[25px] overflow-hidden"
                  >
                    Gain Access →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-16 pt-8 border-t border-border flex items-center gap-3 flex-wrap transition-colors duration-500">
              {post.tags.map((tag) => (
                <span key={tag} className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground border border-border px-3 py-1 bg-card/30 transition-colors duration-500 rounded-[15px]">
                  #{tag}
                </span>
              ))}
              
              <button
                onClick={handleSummarize}
                disabled={summarizing}
                className="flex items-center gap-2 px-4 py-2 rounded-[25px] border border-primary/30 bg-primary/5 hover:bg-primary/10 transition-all group disabled:opacity-50"
              >
                <Sparkles className={`h-3 w-3 ${summarizing ? 'animate-spin' : 'text-primary group-hover:scale-110 transition-transform'}`} />
                <span className="font-mono text-[11px] uppercase tracking-widest text-primary">
                  {summarizing ? "Summarizing..." : "Summarize Post"}
                </span>
              </button>
            </div>
          )}

          {/* AI Summary Panel */}
          <AnimatePresence>
            {showSummary && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-8 border border-primary/20 bg-primary/5 rounded-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span className="font-mono text-[11px] uppercase tracking-widest text-primary font-bold">AI Snapshot</span>
                    </div>
                    <button onClick={() => setShowSummary(false)} className="text-muted-foreground hover:text-foreground p-1">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="font-body text-body-lg text-foreground/90 italic leading-relaxed">
                    {summary}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Comments postId={post._id} postContent={post.content} />
        </motion.article>
      </main>
      <Footer />
    </div>
  );
};

export default PostDetail;
