import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";
import { LogOut, Eye, Users, TrendingUp, ShoppingCart, Loader2 } from "lucide-react";
import logo from "@/assets/nscustoms-logo.png";

interface DailyStats {
  date: string;
  views: number;
  sessions: number;
}

interface TopPage {
  path: string;
  views: number;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [topPages, setTopPages] = useState<TopPage[]>([]);
  const [totalViews, setTotalViews] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);
  const [todayViews, setTodayViews] = useState(0);
  const [liveVisitors, setLiveVisitors] = useState(0);

  useEffect(() => {
    checkAuth();
    fetchStats();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/admin/login");
      return;
    }

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin");

    if (!roles || roles.length === 0) {
      await supabase.auth.signOut();
      navigate("/admin/login");
    }
  };

  const fetchStats = async () => {
    setLoading(true);

    // Get all page views from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: views } = await supabase
      .from("page_views")
      .select("*")
      .gte("created_at", thirtyDaysAgo.toISOString())
      .order("created_at", { ascending: true });

    if (!views) {
      setLoading(false);
      return;
    }

    // Total views
    setTotalViews(views.length);

    // Unique sessions
    const uniqueSessions = new Set(views.map((v) => v.session_id)).size;
    setTotalSessions(uniqueSessions);

    // Today's views
    const today = new Date().toISOString().split("T")[0];
    const todayData = views.filter((v) => v.created_at.startsWith(today));
    setTodayViews(todayData.length);

    // Live visitors (last 5 minutes)
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const recentSessions = new Set(
      views.filter((v) => v.created_at >= fiveMinAgo).map((v) => v.session_id)
    ).size;
    setLiveVisitors(recentSessions);

    // Daily aggregation
    const dailyMap: Record<string, { views: number; sessions: Set<string> }> = {};
    views.forEach((v) => {
      const date = v.created_at.split("T")[0];
      if (!dailyMap[date]) dailyMap[date] = { views: 0, sessions: new Set() };
      dailyMap[date].views++;
      if (v.session_id) dailyMap[date].sessions.add(v.session_id);
    });

    const daily = Object.entries(dailyMap)
      .map(([date, data]) => ({
        date: new Date(date).toLocaleDateString("sv-SE", { month: "short", day: "numeric" }),
        views: data.views,
        sessions: data.sessions.size,
      }))
      .slice(-14); // Last 14 days

    setDailyStats(daily);

    // Top pages
    const pageMap: Record<string, number> = {};
    views.forEach((v) => {
      pageMap[v.path] = (pageMap[v.path] || 0) + 1;
    });
    const top = Object.entries(pageMap)
      .map(([path, count]) => ({ path, views: count }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);
    setTopPages(top);

    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border glass-strong sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="NSC" className="h-8" />
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Admin</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" /> Logga ut
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={Eye} label="Sidvisningar (30d)" value={totalViews} />
          <StatCard icon={Users} label="Unika besökare" value={totalSessions} />
          <StatCard icon={TrendingUp} label="Idag" value={todayViews} />
          <StatCard
            icon={ShoppingCart}
            label="Live just nu"
            value={liveVisitors}
            highlight
          />
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass rounded-xl p-6 space-y-4">
            <h3 className="font-display text-lg font-semibold">Sidvisningar per dag</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 20%)" />
                  <XAxis dataKey="date" tick={{ fill: "hsl(215 15% 55%)", fontSize: 12 }} />
                  <YAxis tick={{ fill: "hsl(215 15% 55%)", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(220 15% 12%)",
                      border: "1px solid hsl(220 15% 20%)",
                      borderRadius: 8,
                      color: "hsl(210 20% 95%)",
                    }}
                  />
                  <Bar dataKey="views" fill="hsl(200 80% 60%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass rounded-xl p-6 space-y-4">
            <h3 className="font-display text-lg font-semibold">Unika besökare per dag</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 20%)" />
                  <XAxis dataKey="date" tick={{ fill: "hsl(215 15% 55%)", fontSize: 12 }} />
                  <YAxis tick={{ fill: "hsl(215 15% 55%)", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(220 15% 12%)",
                      border: "1px solid hsl(220 15% 20%)",
                      borderRadius: 8,
                      color: "hsl(210 20% 95%)",
                    }}
                  />
                  <Line type="monotone" dataKey="sessions" stroke="hsl(200 80% 60%)" strokeWidth={2} dot={{ fill: "hsl(200 80% 60%)" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top pages */}
        <div className="glass rounded-xl p-6 space-y-4">
          <h3 className="font-display text-lg font-semibold">Populäraste sidorna</h3>
          <div className="space-y-2">
            {topPages.length === 0 ? (
              <p className="text-sm text-muted-foreground">Ingen data ännu.</p>
            ) : (
              topPages.map((page) => (
                <div key={page.path} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-sm font-mono text-muted-foreground">{page.path}</span>
                  <span className="text-sm font-semibold">{page.views} visningar</span>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

function StatCard({ icon: Icon, label, value, highlight }: { icon: React.ElementType; label: string; value: number; highlight?: boolean }) {
  return (
    <div className={`glass rounded-xl p-5 space-y-2 ${highlight ? "border border-accent/30 shadow-[0_0_20px_hsl(var(--accent)/0.1)]" : ""}`}>
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span className="text-xs uppercase tracking-wider">{label}</span>
      </div>
      <p className={`text-3xl font-display font-bold ${highlight ? "gradient-text" : ""}`}>{value}</p>
    </div>
  );
}

export default AdminDashboard;
