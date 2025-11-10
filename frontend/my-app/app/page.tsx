"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Search, Loader2, Trophy, TrendingUp, Clock, Sparkles } from "lucide-react";
import { fetchAllData } from "@/lib/api";
import { 
  fadeInUp, 
  fadeInDown, 
  staggerContainer, 
  staggerItem, 
  scaleFadeIn,
  buttonHover,
  hoverScale
} from "@/lib/animations";

export default function Home() {
  const router = useRouter();
  const [riotId, setRiotId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState("");

  const handleSearch = async () => {
    // Parse Riot ID (e.g., "EMP#2005")
    const parts = riotId.trim().split("#");
    if (parts.length !== 2) {
      toast.error("Invalid format! Use: GameName#TAG");
      return;
    }

    const [gameName, tagLine] = parts;
    if (!gameName || !tagLine) {
      toast.error("Both game name and tag are required!");
      return;
    }

    setIsLoading(true);
    setProgress("Starting...");

    try {
      // Call API pipeline in order: 1→2→3
      const result = await fetchAllData(
        gameName,
        tagLine,
        "americas",
        (step) => {
          setProgress(step);
          toast.info(step);
        }
      );

      // Store data in sessionStorage for other pages
      sessionStorage.setItem("statsData", JSON.stringify(result.stats));
      sessionStorage.setItem("timelineData", JSON.stringify(result.timeline));
      sessionStorage.setItem("playerInfo", JSON.stringify({ gameName, tagLine }));

      toast.success("Data loaded successfully!");
      
      // Redirect to stats page
      router.push("/stats");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to fetch data");
    } finally {
      setIsLoading(false);
      setProgress("");
    }
  };

  return (
    <>
      <Navigation />
      
      <main className="container mx-auto px-4 py-20">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Title */}
          <motion.div 
            className="space-y-4"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.h1 
              className="text-6xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent"
              variants={fadeInDown}
            >
              Rift Rewind
            </motion.h1>
            <motion.p 
              className="text-2xl text-slate-300 font-medium"
              variants={fadeInUp}
            >
              Your Season, Your Story
            </motion.p>
            <motion.p 
              className="text-slate-400 max-w-2xl mx-auto"
              variants={fadeInUp}
            >
              Dive into your League of Legends season with AI-powered insights, 
              stunning visualizations, and a personalized wrapped-style recap.
            </motion.p>
          </motion.div>

          {/* Search Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6, 
              delay: 0.4,
              ease: [0.6, 0.05, 0.01, 0.9] 
            }}
          >
            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-md">
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Input
                      type="text"
                      placeholder="Enter Riot ID (e.g., EMP#2005)"
                      value={riotId}
                      onChange={(e) => setRiotId(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSearch()}
                      disabled={isLoading}
                      className="flex-1 h-12 text-lg bg-slate-950/50 border-slate-700 focus:border-yellow-500 transition-all"
                    />
                    <motion.div {...buttonHover}>
                      <Button
                        onClick={handleSearch}
                        disabled={isLoading}
                        size="lg"
                        className="h-12 px-8 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-semibold w-full sm:w-auto"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          <>
                            <Search className="mr-2 h-5 w-5" />
                            Search
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </div>

                  {/* Progress Text */}
                  {progress && (
                    <motion.p 
                      className="text-sm text-yellow-400"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      {progress}
                    </motion.p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Features Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-8"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <FeatureCard
              icon={<Trophy className="h-8 w-8 mx-auto text-yellow-500" />}
              title="Stats"
              description="Core averages, extremes, and monthly trends"
            />

            <FeatureCard
              icon={<TrendingUp className="h-8 w-8 mx-auto text-blue-500" />}
              title="Timeline"
              description="Identity, trends, and comeback patterns"
            />

            <FeatureCard
              icon={<Clock className="h-8 w-8 mx-auto text-purple-500" />}
              title="Heatmap"
              description="Kill positions on Summoner's Rift"
            />

            <FeatureCard
              icon={<Sparkles className="h-8 w-8 mx-auto text-pink-500" />}
              title="Recap"
              description="AI-powered wrapped-style summary"
            />
          </motion.div>
        </div>
      </main>
    </>
  );
}

// Feature Card Component with animations
function FeatureCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) {
  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ 
        scale: 1.05,
        y: -5,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="bg-slate-900/30 border-slate-800 backdrop-blur-sm hover:bg-slate-900/50 transition-all h-full cursor-pointer">
        <CardContent className="p-6 text-center space-y-2">
          <motion.div
            whileHover={{ 
              rotate: [0, -10, 10, -10, 0],
              transition: { duration: 0.5 }
            }}
          >
            {icon}
          </motion.div>
          <h3 className="font-semibold text-slate-200">{title}</h3>
          <p className="text-sm text-slate-400">
            {description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
