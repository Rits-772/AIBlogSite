import { useState, useEffect } from "react";
import { supabase } from "../integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, Sparkles, User, Trash2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const Comments = ({ postId, postContent }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [generatingReply, setGeneratingReply] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("comments")
      .select("*, profiles:user_id(username, avatar_url)")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (!error) setComments(data || []);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to comment");
      return;
    }
    if (!newComment.trim()) return;

    setSubmitting(true);
    const { error } = await supabase.from("comments").insert({
      post_id: postId,
      user_id: user.id,
      content: newComment.trim()
    });

    if (error) {
      toast.error("Failed to post comment");
    } else {
      setNewComment("");
      fetchComments();
      toast.success("Comment posted");
    }
    setSubmitting(false);
  };

  const handleGenerateReply = async (commentContent) => {
    setGeneratingReply(true);
    try {
      const response = await axios.post("http://localhost:5000/api/ai/reply", {
        postContent,
        comment: commentContent
      });
      setNewComment(response.data.data);
      toast.success("AI draft generated");
    } catch (error) {
      toast.error("AI failed to draft reply");
    } finally {
      setGeneratingReply(false);
    }
  };

  const handleDelete = async (commentId) => {
    const { error } = await supabase.from("comments").delete().eq("id", commentId);
    if (!error) {
      setComments(prev => prev.filter(c => c.id !== commentId));
      toast.success("Comment deleted");
    }
  };

  return (
    <div className="mt-16 pt-12 border-t border-border">
      <div className="flex items-center gap-3 mb-10">
        <MessageSquare className="h-5 w-5 text-primary" />
        <h3 className="font-display text-h3 text-foreground">Dialogue</h3>
        <span className="font-mono text-xs text-muted-foreground">({comments.length})</span>
      </div>

      <div className="space-y-8 mb-12">
        <AnimatePresence>
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="group relative flex gap-4 p-4 rounded-lg bg-card/10 border border-border/40 hover:border-primary/20 transition-all"
            >
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-display text-sm text-foreground">{comment.profiles?.username || "Anonymous"}</span>
                  <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="font-body text-body text-muted-foreground/90 leading-relaxed">
                  {comment.content}
                </p>
                
                <div className="mt-4 flex items-center gap-4 border-t border-border/20 pt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleGenerateReply(comment.content)}
                    className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-primary hover:tracking-[0.15em] transition-all"
                  >
                    <Sparkles className="h-3 w-3" /> AI Reply
                  </button>
                  {user?.id === comment.user_id && (
                    <button 
                      onClick={() => handleDelete(comment.id)}
                      className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground hover:text-destructive transition-all"
                    >
                      <Trash2 className="h-3 w-3" /> Delete
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {user ? (
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Contribute to the dialogue..."
            className="w-full bg-card/20 border border-border/60 rounded-xl p-6 font-body text-body text-foreground outline-none focus:border-primary/50 transition-all min-h-[120px] resize-none"
          />
          <div className="absolute bottom-4 right-4 flex items-center gap-3">
            {generatingReply && <Sparkles className="h-4 w-4 text-primary animate-pulse" />}
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="bg-primary text-primary-foreground p-3 rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      ) : (
        <div className="p-12 border border-dashed border-border/60 rounded-xl text-center">
          <p className="font-body text-muted-foreground mb-4">Please sign in to participate in the dialogue.</p>
          <a href="/auth" className="font-mono text-[10px] uppercase tracking-widest text-primary hover:underline">Sign In →</a>
        </div>
      )}
    </div>
  );
};

export default Comments;
