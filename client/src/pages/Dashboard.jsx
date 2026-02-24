import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../integrations/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedList from "../components/animations/AnimatedList";
import { 
  FileText, CheckCircle, Eye, Heart, BarChart3, 
  Settings, LogOut, LayoutDashboard, MessageSquare,
  User
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from 'recharts';
import ThemeToggle from "../components/ThemeToggle";
import Header from "../components/layout/Header";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      setUser(user);
      fetchPosts(user.id);
    };
    checkAuth();
  }, [navigate]);

  const fetchPosts = async (userId) => {
    const { data, error } = await supabase
      .from("posts")
      .select("id, title, status, created_at, updated_at, is_ai_generated, views, thumbnail_url")
      .eq("author_id", userId)
      .neq("status", "deleted")
      .order("updated_at", { ascending: false });

    if (error) {
      toast.error("Error loading posts: " + error.message);
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  };

  // Calculate Metrics
  const metrics = {
    totalPosts: posts.length,
    published: posts.filter(p => p.status === 'published').length,
    totalViews: posts.reduce((acc, p) => acc + (p.views || 0), 0),
    totalLikes: posts.reduce((acc, p) => acc + (p.likes || 0), 0), // Assuming likes column exists or defaults to 0
  };

  // Prepare Tag Data for Chart
  const tagData = posts.reduce((acc, post) => {
    (post.tags || []).forEach(tag => {
      const existing = acc.find(item => item.name === tag);
      if (existing) existing.value += 1;
      else acc.push({ name: tag, value: 1 });
    });
    return acc;
  }, []).sort((a, b) => b.value - a.value).slice(0, 5);

  const COLORS = ['#9b111e', '#e63946', '#f1faee', '#a8dadc', '#457b9d'];

  const handleDelete = async (postId) => {
    const { error } = await supabase
      .from("posts")
      .update({ status: "deleted" })
      .eq("id", postId);

    if (error) {
      toast.error("Error deleting post: " + error.message);
    } else {
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      toast.success("Post deleted");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-atmosphere-deep flex items-center justify-center transition-colors duration-500">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground subtle-pulse">Loading editorial space...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-atmosphere-deep transition-colors duration-500">
      <Header />

      {/* Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mx-auto max-w-7xl px-6 py-16 lg:px-12"
      >
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary">Overview</span>
            <h1 className="mt-2 font-display text-h2 text-foreground transition-colors duration-500">Editorial Dashboard</h1>
          </div>
          <div className="flex items-center gap-4 border border-border/40 p-3 rounded-lg bg-card/10 backdrop-blur-sm">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-display text-sm text-foreground">{user?.email?.split('@')[0]}</p>
              <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { label: "Total Posts", value: metrics.totalPosts, icon: FileText, color: "text-primary" },
            { label: "Published", value: metrics.published, icon: CheckCircle, color: "text-teal" },
            { label: "Total Views", value: metrics.totalViews, icon: Eye, color: "text-saffron" },
            { label: "Estimated Likes", value: metrics.totalLikes, icon: Heart, color: "text-primary/60" }
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 border border-border/40 bg-card/10 backdrop-blur-sm hover:border-primary/20 transition-all rounded-xl group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg bg-card/50 border border-border/50 group-hover:border-primary/20 transition-all`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              <p className="font-display text-h3 text-foreground mb-1">{stat.value}</p>
              <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Charts Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-1 p-8 border border-border/40 bg-card/5 backdrop-blur-sm rounded-2xl"
          >
            <h2 className="font-display text-h4 text-foreground mb-8">Tag Insights</h2>
            <div className="h-64 h-full w-full">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <PieChart>
                  <Pie
                    data={tagData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {tagData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    itemStyle={{ color: 'hsl(var(--foreground))', fontSize: '10px', textTransform: 'uppercase' }}
                  />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Activity/Top Posts */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 p-8 border border-border/40 bg-card/5 backdrop-blur-sm rounded-2xl"
          >
            <h2 className="font-display text-h4 text-foreground mb-8">Top Performing Pieces</h2>
            <div className="space-y-6">
              {posts.slice(0, 4).map((post, i) => (
                <div key={post.id} className="flex items-center gap-6 group">
                  <div className="h-12 w-12 rounded border border-border/40 bg-card/20 flex items-center justify-center font-mono text-xs text-muted-foreground group-hover:border-primary/30 transition-all shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-sm text-foreground group-hover:text-primary transition-colors truncate">{post.title || "Untitled"}</h3>
                    <div className="w-full h-1 bg-border/20 rounded-full mt-2 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((post.views || 0) / (metrics.totalViews || 1) * 100, 100)}%` }}
                        className="h-full bg-primary/40"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-4 font-mono text-[9px] text-muted-foreground shrink-0 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><Eye className="h-3 w-3" /> {post.views || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="mb-6">
          <h2 className="font-display text-h3 text-foreground mb-2">Editorial Inventory</h2>
          <p className="font-body text-sm text-muted-foreground mb-8">Manage and refine your pieces of literature.</p>
        </div>

        {posts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="border border-border p-12 lg:p-24 bg-card/20 text-center transition-colors duration-500 flex flex-col items-center justify-center max-w-3xl mx-auto"
          >
            <div className="h-px w-12 bg-primary/40 mb-8" />
            <h2 className="font-display text-h2 text-foreground mb-4">An Empty Page</h2>
            <p className="font-body text-body-lg text-muted-foreground leading-relaxed max-w-lg mb-10">
              The cursor blinks. The page is blank. This is where intention begins. Start writing your first piece.
            </p>
            <Link
              to="/write"
              className="inline-block border border-primary bg-primary px-10 py-4 font-mono text-[10px] uppercase tracking-[0.25em] text-primary-foreground transition-all duration-500 hover:bg-transparent hover:text-primary"
            >
              Enter Editor
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">
            {posts.map((post, index) => {
              // Determine styling based on index to create a bento effect
              let containerClass = "p-8 border border-border bg-card/10 backdrop-blur-sm transition-all duration-500 hover:border-primary/40 group flex flex-col justify-between";
              
              // First post large (2x2)
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
                  <div className="flex flex-col gap-4 mb-8">
                    <div className="flex items-center gap-3">
                      <span className={`font-mono text-[10px] uppercase tracking-widest ${post.status === "published" ? "text-teal" : "text-muted-foreground"}`}>
                        {post.status}
                      </span>
                      <div className="h-px w-4 bg-border" />
                      <span className="font-mono text-[9px] text-muted-foreground/60 uppercase tracking-widest">
                        {new Date(post.updated_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      {post.is_ai_generated && (
                        <>
                          <div className="h-px w-4 bg-border hidden sm:block" />
                          <span className="font-mono text-[9px] uppercase tracking-widest text-primary/60 hidden sm:block">AI Draft</span>
                        </>
                      )}
                    </div>

                    <Link to={`/write/${post.id}`} className="block mt-2">
                      <h2 className={`${index === 0 ? 'text-h2' : 'text-h3'} font-display text-foreground transition-colors duration-500 group-hover:text-primary leading-tight tracking-tight`}>
                        {post.title || "Untitled Draft"}
                      </h2>
                    </Link>
                  </div>

                  <div className="mt-auto pt-6 border-t border-border/50 flex justify-between items-center">
                    <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                      {post.views || 0} views
                    </span>
                    <div className="flex items-center gap-4">
                      <Link
                        to={`/write/${post.id}`}
                        className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground transition-all duration-300 hover:text-foreground hover:tracking-[0.15em]"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground transition-all duration-300 hover:text-destructive hover:tracking-[0.15em]"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
