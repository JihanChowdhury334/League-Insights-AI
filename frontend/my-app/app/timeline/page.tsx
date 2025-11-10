"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GetTimelineStatsResponse } from "@/lib/types";
import { 
  Target, TrendingUp, TrendingDown, Clock, 
  Zap, Shield, Award, MapPin
} from "lucide-react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip
} from "recharts";
import {
  fadeInUp,
  fadeInDown,
  staggerContainer,
  staggerContainerFast,
  staggerItem,
  cardEntrance,
  chartAnimation,
  hoverScale,
  buttonHover
} from "@/lib/animations";

const COLORS = {
  primary: "#f59e0b",
  secondary: "#3b82f6",
  success: "#10b981",
  danger: "#ef4444",
  purple: "#a855f7",
  cyan: "#06b6d4",
};

export default function TimelinePage() {
  const router = useRouter();
  const [timeline, setTimeline] = useState<GetTimelineStatsResponse | null>(null);
  const [playerInfo, setPlayerInfo] = useState<{ gameName: string; tagLine: string } | null>(null);

  useEffect(() => {
    const data = sessionStorage.getItem("timelineData");
    const info = sessionStorage.getItem("playerInfo");
    if (!data) {
      router.push("/");
      return;
    }
    setTimeline(JSON.parse(data));
    if (info) setPlayerInfo(JSON.parse(info));
  }, [router]);

  if (!timeline) {
    return (
      <>
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-slate-400">Loading timeline...</p>
        </div>
      </>
    );
  }

  // Map playstyle scores to 0-100 scale
  const identityData = [
    { subject: "Early Game", value: timeline.average_insights.early_dominance > 0 ? Math.min(timeline.average_insights.early_dominance / 5, 100) : 50, fullMark: 100 },
    { subject: "Roaming", value: Math.min(timeline.average_insights.roam_score * 10, 100), fullMark: 100 },
    { subject: "Consistency", value: timeline.average_insights.consistency_score, fullMark: 100 },
    { subject: "Risk", value: Math.min(Math.abs(timeline.average_insights.biggest_spike) / 10, 100), fullMark: 100 },
  ];

  const objectiveData = [
    { name: "Dragon", value: timeline.heatmap.objectives.dragon },
    { name: "Baron", value: timeline.heatmap.objectives.baron },
    { name: "Herald", value: timeline.heatmap.objectives.herald },
    { name: "Tower", value: timeline.heatmap.objectives.tower },
    { name: "Inhibitor", value: timeline.heatmap.objectives.inhibitor },
  ];

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
            className="text-4xl font-bold text-purple-400"
            variants={fadeInDown}
          >
            Timeline Analytics
          </motion.h1>
          {playerInfo && (
            <motion.p 
              className="text-slate-400"
              variants={fadeInUp}
            >
              {playerInfo.gameName}#{playerInfo.tagLine}
            </motion.p>
          )}
          <motion.p 
            className="text-slate-500 text-sm"
            variants={fadeInUp}
          >
            {timeline.total_matches} matches analyzed
          </motion.p>
        </motion.div>

        {/* Identity & Style */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Radar Chart */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-400" />
                Identity & Playstyle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={identityData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" stroke="#94a3b8" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#94a3b8" />
                  <Radar 
                    name="Score" 
                    dataKey="value" 
                    stroke={COLORS.purple} 
                    fill={COLORS.purple} 
                    fillOpacity={0.6} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Style Breakdown */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle>Playstyle Identity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Badge variant="outline" className="p-3 bg-yellow-500/10 text-yellow-400 border-yellow-500/30">
                  <Zap className="h-4 w-4 mr-2" />
                  {timeline.playstyle_identity.early_game}
                </Badge>
                <Badge variant="outline" className="p-3 bg-blue-500/10 text-blue-400 border-blue-500/30">
                  <MapPin className="h-4 w-4 mr-2" />
                  {timeline.playstyle_identity.roaming}
                </Badge>
                <Badge variant="outline" className="p-3 bg-green-500/10 text-green-400 border-green-500/30">
                  <Shield className="h-4 w-4 mr-2" />
                  {timeline.playstyle_identity.consistency}
                </Badge>
                <Badge variant="outline" className="p-3 bg-red-500/10 text-red-400 border-red-500/30">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  {timeline.playstyle_identity.risk_profile || "Balanced"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trends */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              Average Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                <p className="text-2xl font-bold text-yellow-400">
                  {timeline.average_insights.early_dominance.toFixed(0)}g
                </p>
                <p className="text-sm text-slate-400">Early Dominance</p>
              </div>
              <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                <p className="text-2xl font-bold text-purple-400">
                  {timeline.average_insights.midgame_swing.toFixed(0)}g
                </p>
                <p className="text-sm text-slate-400">Midgame Swing</p>
              </div>
              <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                <p className="text-2xl font-bold text-green-400">
                  +{timeline.average_insights.biggest_spike.toFixed(0)}g
                </p>
                <p className="text-sm text-slate-400">Biggest Spike</p>
              </div>
              <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                <p className="text-2xl font-bold text-red-400">
                  {timeline.average_insights.biggest_throw.toFixed(0)}g
                </p>
                <p className="text-sm text-slate-400">Biggest Throw</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Level Timings */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-400" />
              Level Timings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                <p className="text-sm text-slate-400 mb-2">Level 6</p>
                <p className="text-3xl font-bold text-blue-400">
                  {Math.floor(timeline.average_insights.avg_level6_time / 60)}:{(Math.floor(timeline.average_insights.avg_level6_time) % 60).toString().padStart(2, '0')}
                </p>
              </div>
              <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                <p className="text-sm text-slate-400 mb-2">Level 11</p>
                <p className="text-3xl font-bold text-purple-400">
                  {Math.floor(timeline.average_insights.avg_level11_time / 60)}:{(Math.floor(timeline.average_insights.avg_level11_time) % 60).toString().padStart(2, '0')}
                </p>
              </div>
              <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                <p className="text-sm text-slate-400 mb-2">Level 16</p>
                <p className="text-3xl font-bold text-pink-400">
                  {Math.floor(timeline.average_insights.avg_level16_time / 60)}:{(Math.floor(timeline.average_insights.avg_level16_time) % 60).toString().padStart(2, '0')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comeback Pattern */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-green-400" />
              Comeback Patterns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <PatternCard
                label="Comeback Wins"
                value={timeline.comeback_pattern.comeback_wins}
                color="text-green-400"
              />
              <PatternCard
                label="Dominant Wins"
                value={timeline.comeback_pattern.dominant_wins}
                color="text-blue-400"
              />
              <PatternCard
                label="Neutral Games"
                value={timeline.comeback_pattern.neutral_games}
                color="text-slate-400"
              />
              <PatternCard
                label="Fell Behind"
                value={timeline.comeback_pattern.fell_behind_losses}
                color="text-orange-400"
              />
              <PatternCard
                label="Throws"
                value={timeline.comeback_pattern.throws}
                color="text-red-400"
              />
            </div>
          </CardContent>
        </Card>

        {/* Objective Participation */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle>Objective Participation</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={objectiveData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {objectiveData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index % Object.values(COLORS).length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Heatmap */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-red-400" />
              Kill Heatmap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <KillHeatmap killPositions={timeline.heatmap.kill_positions} />
          </CardContent>
        </Card>
      </main>
    </>
  );
}

// Helper Components
function PatternCard({ label, value, color }: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <motion.div 
      className="text-center p-4 bg-slate-800/50 rounded-lg cursor-pointer"
      variants={staggerItem}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.p 
        className={`text-3xl font-bold ${color}`}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {value}
      </motion.p>
      <p className="text-sm text-slate-400 mt-2">{label}</p>
    </motion.div>
  );
}

// Kill Heatmap Component
function KillHeatmap({ killPositions }: { killPositions: Array<{ x: number; y: number }> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [intensity, setIntensity] = useState(50);
  const [showRaw, setShowRaw] = useState(false);

  useEffect(() => {
    if (!canvasRef.current || killPositions.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Load Rift map image
    const img = new Image();
    img.src = "/riftmap.jpeg";
    
    img.onload = () => {
      // Clear and draw background
      canvas.width = 800;
      canvas.height = 800;
      ctx.drawImage(img, 0, 0, 800, 800);

      // Draw kill points
      ctx.globalCompositeOperation = "lighter";

      killPositions.forEach((kill) => {
        // Transform Riot coordinates to canvas
        const x = (kill.x / 15000) * 800;
        const y = 800 - (kill.y / 15000) * 800;

        if (showRaw) {
          // Raw points mode
          ctx.fillStyle = "rgba(255, 0, 0, 0.6)";
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Heatmap mode with gaussian blur
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, intensity);
          gradient.addColorStop(0, `rgba(255, 0, 0, ${0.8 * (intensity / 100)})`);
          gradient.addColorStop(0.5, `rgba(255, 100, 0, ${0.4 * (intensity / 100)})`);
          gradient.addColorStop(1, "rgba(255, 200, 0, 0)");

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(x, y, intensity, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      ctx.globalCompositeOperation = "source-over";
    };
  }, [killPositions, intensity, showRaw]);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          <span className="text-sm text-slate-400">Intensity:</span>
          <input
            type="range"
            min="10"
            max="100"
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            className="flex-1"
          />
          <span className="text-sm text-slate-300 w-12">{intensity}</span>
        </div>
        <Button
          variant={showRaw ? "default" : "outline"}
          size="sm"
          onClick={() => setShowRaw(!showRaw)}
        >
          {showRaw ? "Heatmap" : "Raw Points"}
        </Button>
      </div>

      {/* Canvas */}
      <div className="relative w-full aspect-square bg-slate-950 rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
        />
      </div>

      <p className="text-sm text-slate-400 text-center">
        {killPositions.length} kill positions tracked
      </p>
    </div>
  );
}
