"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GetStatsResponse } from "@/lib/types";
import { 
  Trophy, Target, TrendingUp, Sword, Eye, Zap 
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import {
  fadeInUp,
  fadeInDown,
  staggerContainer,
  staggerContainerFast,
  staggerItem,
  cardEntrance,
  chartAnimation,
  hoverScale
} from "@/lib/animations";

const COLORS = {
  primary: "#f59e0b",
  secondary: "#3b82f6",
  success: "#10b981",
  danger: "#ef4444",
  purple: "#a855f7",
  cyan: "#06b6d4",
};

export default function StatsPage() {
  const router = useRouter();
  const [stats, setStats] = useState<GetStatsResponse | null>(null);

  useEffect(() => {
    const data = sessionStorage.getItem("statsData");
    if (!data) {
      router.push("/");
      return;
    }
    setStats(JSON.parse(data));
  }, [router]);

  if (!stats) {
    return (
      <>
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-slate-400">Loading stats...</p>
        </div>
      </>
    );
  }

  // Calculate KDA
  const kda = stats.core_averages.deaths > 0
    ? ((stats.core_averages.kills + stats.core_averages.assists) / stats.core_averages.deaths).toFixed(2)
    : (stats.core_averages.kills + stats.core_averages.assists).toFixed(2);

  // Prepare monthly data
  const monthlyData = Object.entries(stats.monthly_stats || {}).map(([month, data]) => ({
    month,
    ...data
  })).sort((a, b) => a.month.localeCompare(b.month));

  return (
    <>
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <motion.div 
          className="text-center space-y-2"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <motion.h1 
            className="text-4xl font-bold text-yellow-400"
            variants={fadeInDown}
          >
            {stats.profile.gameName}#{stats.profile.tagLine}
          </motion.h1>
          <motion.p 
            className="text-slate-400"
            variants={fadeInUp}
          >
            {stats.profile.total_matches} games • {stats.profile.total_wins}W {stats.profile.total_losses}L • {stats.profile.win_rate}% WR
          </motion.p>
        </motion.div>

        {/* Core Stats Grid */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          initial="initial"
          animate="animate"
          variants={staggerContainerFast}
        >
          <StatCard
            icon={<Sword className="h-5 w-5" />}
            label="KDA"
            value={kda}
            subtext={`${stats.core_averages.kills.toFixed(1)} / ${stats.core_averages.deaths.toFixed(1)} / ${stats.core_averages.assists.toFixed(1)}`}
            color="text-yellow-400"
          />
          <StatCard
            icon={<Target className="h-5 w-5" />}
            label="CS/min"
            value={stats.core_averages.cs_per_min.toFixed(1)}
            subtext="Farming"
            color="text-blue-400"
          />
          <StatCard
            icon={<Zap className="h-5 w-5" />}
            label="Damage"
            value={`${stats.impact_stats.damage_share.toFixed(1)}%`}
            subtext="Team Share"
            color="text-red-400"
          />
          <StatCard
            icon={<Eye className="h-5 w-5" />}
            label="KP"
            value={`${stats.impact_stats.kill_participation.toFixed(1)}%`}
            subtext="Participation"
            color="text-purple-400"
          />
        </motion.div>

        {/* Impact Stats */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              Impact Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">{stats.impact_stats.damage_share.toFixed(1)}%</p>
                <p className="text-sm text-slate-400">Damage Share</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-400">{stats.impact_stats.gold_share.toFixed(1)}%</p>
                <p className="text-sm text-slate-400">Gold Share</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-400">{stats.impact_stats.kill_participation.toFixed(1)}%</p>
                <p className="text-sm text-slate-400">Kill Participation</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-400">{stats.impact_stats.vision_share.toFixed(1)}%</p>
                <p className="text-sm text-slate-400">Vision Share</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Role Distribution */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle>Role Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={Object.entries(stats.role_distribution).map(([role, count]) => ({
                      name: role || "UNKNOWN",
                      value: count,
                    }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {Object.keys(stats.role_distribution).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index % Object.values(COLORS).length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Most Played Champion */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle>Most Played Champion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-2">
                <h3 className="text-3xl font-bold text-yellow-400">
                  {stats.most_played_champion}
                </h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Extreme Games */}
        {stats.extreme_games && (
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-400" />
                Extreme Games
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <ExtremeGameCard
                  title="Highest Kills"
                  champion={stats.extreme_games.highest_kill_game?.champion}
                  role={stats.extreme_games.highest_kill_game?.role}
                  value={stats.extreme_games.highest_kill_game?.kills}
                  label="kills"
                />
                <ExtremeGameCard
                  title="Most Deaths"
                  champion={stats.extreme_games.highest_death_game?.champion}
                  role={stats.extreme_games.highest_death_game?.role}
                  value={stats.extreme_games.highest_death_game?.deaths}
                  label="deaths"
                  isNegative
                />
                <ExtremeGameCard
                  title="Best KDA"
                  champion={stats.extreme_games.best_kda_game?.champion}
                  role={stats.extreme_games.best_kda_game?.role}
                  value={stats.extreme_games.best_kda_game?.kda}
                  label="KDA"
                />
                <ExtremeGameCard
                  title="Worst KDA"
                  champion={stats.extreme_games.worst_kda_game?.champion}
                  role={stats.extreme_games.worst_kda_game?.role}
                  value={stats.extreme_games.worst_kda_game?.kda}
                  label="KDA"
                  isNegative
                />
                <ExtremeGameCard
                  title="Longest Game"
                  champion={stats.extreme_games.longest_game?.champion}
                  role={stats.extreme_games.longest_game?.role}
                  value={stats.extreme_games.longest_game?.duration}
                  label="seconds"
                />
                <ExtremeGameCard
                  title="Fastest Game"
                  champion={stats.extreme_games.fastest_game?.champion}
                  role={stats.extreme_games.fastest_game?.role}
                  value={stats.extreme_games.fastest_game?.duration}
                  label="seconds"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Monthly Trends */}
        {monthlyData.length > 0 && (
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle>Monthly Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                    labelStyle={{ color: '#94a3b8' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="avg_kills" stroke={COLORS.success} name="Kills" />
                  <Line type="monotone" dataKey="avg_deaths" stroke={COLORS.danger} name="Deaths" />
                  <Line type="monotone" dataKey="avg_assists" stroke={COLORS.secondary} name="Assists" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </main>
    </>
  );
}

// Helper Components
function StatCard({ icon, label, value, subtext, color }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
  color: string;
}) {
  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="bg-slate-900/50 border-slate-800 cursor-pointer h-full">
        <CardContent className="p-4 text-center space-y-2">
          <motion.div 
            className={`mx-auto ${color}`}
            whileHover={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5 }}
          >
            {icon}
          </motion.div>
          <p className="text-xs text-slate-400">{label}</p>
          <motion.p 
            className={`text-2xl font-bold ${color}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {value}
          </motion.p>
          <p className="text-xs text-slate-500">{subtext}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ExtremeGameCard({ 
  title, 
  champion,
  role,
  value,
  label,
  isNegative = false 
}: { 
  title: string; 
  champion?: string;
  role?: string;
  value?: number;
  label: string;
  isNegative?: boolean;
}) {
  const color = isNegative ? "text-red-400" : "text-green-400";
  const displayValue = label === "seconds" 
    ? `${Math.floor((value || 0) / 60)}m ${(value || 0) % 60}s`
    : label === "KDA"
    ? (value || 0).toFixed(2)
    : value || 0;
  
  return (
    <motion.div 
      className="p-4 bg-slate-800/50 rounded-lg space-y-2 cursor-pointer"
      variants={staggerItem}
      whileHover={{ 
        scale: 1.05, 
        y: -5,
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)"
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <h4 className="font-semibold text-slate-300">{title}</h4>
      <motion.p 
        className="text-lg font-bold text-yellow-400"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        {champion || 'Unknown'}
      </motion.p>
      <div className="space-y-1 text-sm">
        <p className={color}>
          {label === "seconds" ? "Duration: " : label === "KDA" ? "KDA: " : `${label}: `}
          {displayValue}
        </p>
        <p className="text-slate-400">
          Role: {role || 'Unknown'}
        </p>
      </div>
    </motion.div>
  );
}
