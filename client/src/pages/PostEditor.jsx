import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../integrations/supabase/client";
import { toast } from "sonner";
import Editor from "../components/Editor";
import axios from "axios";
import StarBorder from "../components/animations/StarBorder";
import ClickSpark from "../components/animations/ClickSpark";

const TONES = ["contemplative", "analytical", "conversational", "provocative", "lyrical"];
const CATEGORIES = ["Essay", "Technology", "Design", "Philosophy", "Culture", "Personal"];

const PostEditor = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("draft");
  const [saving, setSaving] = useState(false);

  // AI state
  const [showAI, setShowAI] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [aiTone, setAiTone] = useState("contemplative");
  const [aiWordCount, setAiWordCount] = useState("800");
  const [aiGenerating, setAiGenerating] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      if (isEditing) loadPost();
    };
    checkAuth();
  }, [id, navigate, isEditing]);

  const loadPost = async () => {
    if (!id) return;
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      toast.error("Post not found");
      navigate("/dashboard");
      return;
    }
    setTitle(data.title);
    setContent(data.content || "");
    setTags((data.tags || []).join(", "));
    setCategory(data.category || "");
    setStatus(data.status);
  };

  const handleSave = async (publishStatus) => {
    setSaving(true);
    const finalStatus = publishStatus || status;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const postData = {
      title: title || "Untitled",
      content,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      category: category || null,
      status: finalStatus,
      author_id: user.id,
      updated_at: new Date().toISOString()
    };

    let error;
    if (isEditing && id) {
      ({ error } = await supabase.from("posts").update(postData).eq("id", id));
    } else {
      const { data, error: insertError } = await supabase.from("posts").insert(postData).select("id").single();
      error = insertError;
      if (data && !insertError) {
        navigate(`/write/${data.id}`, { replace: true });
      }
    }

    if (error) {
      toast.error("Error saving: " + error.message);
    } else {
      toast.success(finalStatus === "published" ? "Published!" : "Draft saved");
      setStatus(finalStatus);
    }
    setSaving(false);
  };

  const handleAIGenerate = useCallback(async () => {
    if (!aiTopic.trim()) return;
    setAiGenerating(true);

    try {
      const response = await axios.post("http://localhost:5000/api/ai/generate", {
        topic: aiTopic,
        tone: aiTone,
        wordCount: parseInt(aiWordCount),
      });

      const { title: aiTitle, content: aiContent, tags: aiTags, category: aiCategory } = response.data.data;
      
      setTitle(aiTitle);
      setContent(aiContent);
      setTags(aiTags.join(", "));
      setCategory(aiCategory);
      
      setShowAI(false);
      toast.success("AI draft generated with Groq");
    } catch (error) {
      toast.error("AI Generation Failed: " + (error.response?.data?.message || error.message));
    } finally {
      setAiGenerating(false);
    }
  }, [aiTopic, aiTone, aiWordCount]);

  return (
    <ClickSpark sparkColor="hsl(var(--primary))">
      <div className="min-h-screen bg-atmosphere-deep transition-colors duration-500">
      {/* Top bar */}
      <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50 transition-colors duration-500">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-12">
          <Link to="/dashboard" className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-all">
            ← Dashboard
          </Link>
          <div className="flex items-center gap-6">
            <button
              onClick={() => setShowAI(!showAI)}
              className={`font-mono text-[10px] uppercase tracking-widest transition-all duration-300 ${
                showAI ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`}
            >
              {showAI ? "Close AI" : "AI Assist"}
            </button>
            <button
              onClick={() => handleSave("draft")}
              disabled={saving}
              className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-all hover:text-foreground disabled:opacity-50"
            >
              Save Draft
            </button>
            <button
              onClick={() => handleSave("published")}
              disabled={saving}
              className="border border-primary px-5 py-2 font-mono text-[10px] uppercase tracking-widest text-primary transition-all duration-500 hover:bg-primary hover:text-primary-foreground disabled:opacity-50"
            >
              Publish
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-12 lg:px-12">
        {/* AI Panel */}
        <AnimatePresence>
          {showAI && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-12 border border-border bg-card p-8 accent-glow overflow-hidden"
            >
              <div className="mb-6 flex items-center gap-2 border-b border-border pb-4">
                <div className="h-2 w-2 bg-primary/60" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  ai.generate.groq
                </span>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="font-mono text-[10px] text-teal mb-2 block uppercase tracking-wider">topic:</label>
                  <input
                    type="text"
                    value={aiTopic}
                    onChange={(e) => setAiTopic(e.target.value)}
                    className="w-full bg-transparent border-b border-border py-2 font-mono text-small text-foreground outline-none focus:border-primary transition-all"
                    placeholder="What should we write about?"
                  />
                </div>

                <div className="flex gap-8">
                  <div className="flex-1">
                    <label className="font-mono text-[10px] text-teal mb-2 block uppercase tracking-wider">tone:</label>
                    <select
                      value={aiTone}
                      onChange={(e) => setAiTone(e.target.value)}
                      className="w-full bg-transparent border-b border-border py-2 font-mono text-small text-foreground outline-none focus:border-primary transition-all"
                    >
                      {TONES.map((t) => (
                        <option key={t} value={t} className="bg-card text-foreground">
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-32">
                    <label className="font-mono text-[10px] text-teal mb-2 block uppercase tracking-wider">words:</label>
                    <input
                      type="number"
                      value={aiWordCount}
                      onChange={(e) => setAiWordCount(e.target.value)}
                      className="w-full bg-transparent border-b border-border py-2 font-mono text-small text-foreground outline-none focus:border-primary transition-all"
                      min={200}
                      max={3000}
                      step={100}
                    />
                  </div>
                </div>

                <StarBorder
                  as="button"
                  onClick={handleAIGenerate}
                  disabled={aiGenerating || !aiTopic.trim()}
                  className="mt-4"
                  color="hsl(var(--primary))"
                  speed="4s"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em]">
                    {aiGenerating ? (
                      <span className="flex items-center gap-2">
                        Generating<span className="subtle-pulse">...</span>
                      </span>
                    ) : (
                      "Generate Draft"
                    )}
                  </span>
                </StarBorder>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Title */}
        <motion.input
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full bg-transparent font-display text-hero text-foreground outline-none placeholder:text-muted-foreground/20 mb-8 transition-colors duration-500"
        />

        {/* Meta */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-wrap gap-6 mb-10 border-b border-border pb-6 transition-colors duration-500"
        >
          <div className="flex-1 min-w-[200px]">
            <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-transparent border-b border-border py-2 font-mono text-small text-foreground outline-none focus:border-primary transition-all"
            >
              <option value="" className="bg-card">None</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-card">{c}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block">Tags</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="comma, separated, tags"
              className="w-full bg-transparent border-b border-border py-2 font-mono text-small text-foreground outline-none focus:border-primary placeholder:text-muted-foreground/50 transition-all"
            />
          </div>
        </motion.div>

        {/* Content - Rich Text Editor */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Editor 
            content={content} 
            onChange={setContent} 
            placeholder="Begin writing your masterpiece..."
          />
        </motion.div>
      </div>
    </div>
  </ClickSpark>
);
};

export default PostEditor;
