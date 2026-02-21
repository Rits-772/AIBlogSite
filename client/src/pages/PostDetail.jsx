import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../integrations/supabase/client";
import { motion } from "framer-motion";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from("posts")
        .select("id, title, content, category, tags, created_at, views, is_ai_generated, profiles:author_id(username)")
        .eq("id", id)
        .eq("status", "published")
        .single();

      if (!error && data) {
        setPost(data);
        // Track view (simple increment)
        await supabase.rpc('increment_views', { post_id: id });
      }
      setLoading(false);
    };
    fetchPost();
  }, [id]);

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

  const authorName = post.profiles?.username || "Anonymous";

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
          {/* Meta */}
          <div className="mb-8 flex items-center gap-6">
            {post.category && (
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary">{post.category}</span>
            )}
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
              {new Date(post.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </span>
            {post.is_ai_generated && (
              <span className="font-mono text-[10px] uppercase tracking-widest text-primary/40">AI-assisted draft</span>
            )}
          </div>

          {/* Title */}
          <h1 className="font-display text-h1 text-foreground mb-6 transition-colors duration-500">{post.title}</h1>

          {/* Author */}
          <p className="font-body text-body italic text-muted-foreground mb-12 pb-8 border-b border-border transition-colors duration-500">
            by {authorName}
          </p>

          {/* Content - Rendered as HTML for Tiptap support */}
          <div 
            className="prose prose-lg dark:prose-invert max-w-none font-body text-foreground leading-[1.8] transition-colors duration-500"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-16 pt-8 border-t border-border flex items-center gap-3 flex-wrap transition-colors duration-500">
              {post.tags.map((tag) => (
                <span key={tag} className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground border border-border px-3 py-1 bg-card/30 transition-colors duration-500">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </motion.article>
      </main>
      <Footer />
    </div>
  );
};

export default PostDetail;
