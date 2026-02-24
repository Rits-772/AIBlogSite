import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../integrations/supabase/client";
import { toast } from "sonner";
import Editor from "../components/Editor";
import axios from "axios";
import StarBorder from "../components/animations/StarBorder";
import ClickSpark from "../components/animations/ClickSpark";
import TurndownService from 'turndown';
import { Eye, FileText } from "lucide-react";

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
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [status, setStatus] = useState("draft");
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState("editor"); // "editor" or "markdown"

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
    setThumbnailUrl(data.thumbnail_url || "");
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
      thumbnail_url: thumbnailUrl || null,
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
      <header className="border-b border-border bg-background/90 backdrop-blur-xl sticky top-0 z-50 transition-colors duration-500">
        <div className="mx-auto flex max-w-[900px] items-center justify-between px-4 sm:px-6 py-4">
          <Link to="/dashboard" className="group flex items-center gap-2 font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-all">
            <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span> <span className="hidden xs:inline">Dashboard</span>
          </Link>
          <div className="flex items-center gap-3 sm:gap-6">
            <button
              onClick={() => setShowAI(!showAI)}
              className={`font-mono text-[9px] uppercase tracking-[0.2em] transition-all duration-300 flex items-center gap-2 ${
                showAI ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`}
            >
              <div className={`h-1.5 w-1.5 rounded-full ${showAI ? 'bg-primary' : 'bg-muted-foreground/40'}`} />
              <span className="hidden sm:inline">{showAI ? "Close Companion" : "AI Companion"}</span>
              <span className="sm:hidden">AI</span>
            </button>
            <div className="h-4 w-px bg-border" />
            
            <div className="flex items-center gap-1 bg-card/40 p-0.5 sm:p-1 rounded-md border border-border/50">
              <button
                onClick={() => setViewMode("editor")}
                className={`p-1 sm:p-1.5 rounded transition-all ${viewMode === "editor" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                title="Editor View"
              >
                <FileText className="h-3 w-3" />
              </button>
              <button
                onClick={() => setViewMode("markdown")}
                className={`p-1 sm:p-1.5 rounded transition-all ${viewMode === "markdown" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                title="Markdown View"
              >
                <Eye className="h-3 w-3" />
              </button>
            </div>
            <div className="h-4 w-px bg-border hidden sm:block" />
            <button
              onClick={() => handleSave("draft")}
              disabled={saving}
              className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground transition-all hover:text-foreground disabled:opacity-50 hidden md:block"
            >
              Save Draft
            </button>
            <button
              onClick={() => handleSave("published")}
              disabled={saving}
              className="relative overflow-hidden border border-primary bg-primary px-3 sm:px-6 py-2 sm:py-2.5 font-mono text-[9px] uppercase tracking-[0.2em] text-primary-foreground transition-all duration-500 hover:bg-transparent hover:text-primary disabled:opacity-50"
            >
              Publish
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[900px] px-6 py-16 lg:px-12 relative">
        {/* Editor Area */}
        <div className="bg-card/20 border border-border/50 p-8 sm:p-16 backdrop-blur-sm min-h-[70vh]">
          {/* Title */}
          <motion.input
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="An Untitled Thought..."
            className="w-full bg-transparent font-display text-h2 sm:text-h1 text-foreground outline-none placeholder:text-muted-foreground/30 mb-12 transition-colors duration-500 tracking-tight"
          />

          {/* Meta Configuration (Expandable/Subtle) */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-wrap gap-8 mb-16 border-b border-border/50 pb-8 transition-colors duration-500"
          >
            <div className="flex-1 min-w-[200px] group">
              <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60 mb-2 block transition-colors group-hover:text-primary/60">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-transparent border-b border-dashed border-border py-2 font-mono text-xs text-foreground outline-none focus:border-primary transition-all appearance-none cursor-pointer"
              >
                <option value="" className="bg-card">Uncategorized</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-card">{c}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[200px] group">
              <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60 mb-2 block transition-colors group-hover:text-primary/60">Tags</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Comma, separated, keywords"
                className="w-full bg-transparent border-b border-dashed border-border py-2 font-mono text-xs text-foreground outline-none focus:border-primary placeholder:text-muted-foreground/30 transition-all"
              />
            </div>
            <div className="flex-1 min-w-[200px] group">
              <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60 mb-2 block transition-colors group-hover:text-primary/60">Thumbnail URL</label>
              <input
                type="text"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-transparent border-b border-dashed border-border py-2 font-mono text-xs text-foreground outline-none focus:border-primary placeholder:text-muted-foreground/30 transition-all"
              />
            </div>
          </motion.div>

          {/* Content Area */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {viewMode === "editor" ? (
              <Editor 
                content={content} 
                onChange={setContent} 
                placeholder="The page is blank. Begin here..."
              />
            ) : (
              <div className="min-h-[500px] font-mono text-sm leading-relaxed text-muted-foreground bg-card/10 p-6 rounded border border-dashed border-border/40 overflow-auto whitespace-pre-wrap">
                {new TurndownService({ 
                  headingStyle: 'atx',
                  codeBlockStyle: 'fenced'
                }).turndown(content || "")}
              </div>
            )}
          </motion.div>
        </div>

        {/* Floating AI Panel */}
        <AnimatePresence mode="wait">
          {showAI && (
            <>
              {/* Overlay for mobile */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAI(false)}
                className="fixed inset-0 bg-background/20 backdrop-blur-sm z-30 xl:hidden"
              />
              
              <motion.div 
                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.95 }}
                className="fixed xl:absolute top-20 sm:top-24 xl:top-16 right-4 sm:right-6 xl:right-0 xl:translate-x-full xl:ml-8 w-[calc(100%-2rem)] sm:w-80 border border-border/60 bg-background/95 sm:bg-card/60 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl z-40 rounded-2xl md:rounded-none"
              >
                <div className="mb-6 flex items-center justify-between border-b border-border/50 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                      Co-Writer
                    </span>
                  </div>
                  <button onClick={() => setShowAI(false)} className="text-muted-foreground hover:text-foreground p-1">✕</button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="font-mono text-[9px] text-teal/80 mb-2 block uppercase tracking-widest">Core Topic</label>
                    <input
                      type="text"
                      value={aiTopic}
                      onChange={(e) => setAiTopic(e.target.value)}
                      className="w-full bg-transparent border-b border-dashed border-border py-2 font-body text-body text-foreground outline-none focus:border-primary transition-all placeholder:text-muted-foreground/30 placeholder:italic"
                      placeholder="The architecture of silence..."
                    />
                  </div>

                  <div className="flex flex-col xs:flex-row gap-4">
                    <div className="flex-1">
                      <label className="font-mono text-[9px] text-teal/80 mb-2 block uppercase tracking-widest">Tone</label>
                      <select
                        value={aiTone}
                        onChange={(e) => setAiTone(e.target.value)}
                        className="w-full bg-transparent border-b border-dashed border-border py-2 font-mono text-[10px] text-foreground outline-none focus:border-primary transition-all appearance-none cursor-pointer"
                      >
                        {TONES.map((t) => (
                          <option key={t} value={t} className="bg-card text-foreground">
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="w-full xs:w-24">
                      <label className="font-mono text-[9px] text-teal/80 mb-2 block uppercase tracking-widest">Words</label>
                      <input
                        type="number"
                        value={aiWordCount}
                        onChange={(e) => setAiWordCount(e.target.value)}
                        className="w-full bg-transparent border-b border-dashed border-border py-2 font-mono text-[10px] text-foreground outline-none focus:border-primary transition-all"
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
                    className="w-full mt-6"
                    color="hsl(var(--primary))"
                    speed="4s"
                  >
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] w-full text-center py-2 flex items-center justify-center">
                      {aiGenerating ? (
                        <span className="flex items-center gap-2 opacity-80">
                          Writing<span className="subtle-pulse">...</span>
                        </span>
                      ) : (
                        "Generate Draft"
                      )}
                    </span>
                  </StarBorder>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

      </div>
    </div>
  </ClickSpark>
);
};

export default PostEditor;
