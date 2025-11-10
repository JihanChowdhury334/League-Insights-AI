"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Search, Loader2, Trophy, TrendingUp, Clock, Sparkles } from "lucide-react";
import { fetchAllData } from "@/lib/api";

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
          <div className="space-y-4">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              Rift Rewind
            </h1>
            <p className="text-2xl text-slate-300 font-medium">
              Your Season, Your Story
            </p>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Dive into your League of Legends season with AI-powered insights, 
              stunning visualizations, and a personalized wrapped-style recap.
            </p>
          </div>

          {/* Search Card */}
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
                    className="flex-1 h-12 text-lg bg-slate-950/50 border-slate-700 focus:border-yellow-500"
                  />
                  <Button
                    onClick={handleSearch}
                    disabled={isLoading}
                    size="lg"
                    className="h-12 px-8 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-semibold"
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
                </div>

                {/* Progress Text */}
                {progress && (
                  <p className="text-sm text-yellow-400 animate-pulse">
                    {progress}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-8">
            <Card className="bg-slate-900/30 border-slate-800 backdrop-blur-sm hover:bg-slate-900/50 transition-all">
              <CardContent className="p-6 text-center space-y-2">
                <Trophy className="h-8 w-8 mx-auto text-yellow-500" />
                <h3 className="font-semibold text-slate-200">Stats</h3>
                <p className="text-sm text-slate-400">
                  Core averages, extremes, and monthly trends
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/30 border-slate-800 backdrop-blur-sm hover:bg-slate-900/50 transition-all">
              <CardContent className="p-6 text-center space-y-2">
                <TrendingUp className="h-8 w-8 mx-auto text-blue-500" />
                <h3 className="font-semibold text-slate-200">Timeline</h3>
                <p className="text-sm text-slate-400">
                  Identity, trends, and comeback patterns
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/30 border-slate-800 backdrop-blur-sm hover:bg-slate-900/50 transition-all">
              <CardContent className="p-6 text-center space-y-2">
                <Clock className="h-8 w-8 mx-auto text-purple-500" />
                <h3 className="font-semibold text-slate-200">Heatmap</h3>
                <p className="text-sm text-slate-400">
                  Kill positions on Summoner's Rift
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/30 border-slate-800 backdrop-blur-sm hover:bg-slate-900/50 transition-all">
              <CardContent className="p-6 text-center space-y-2">
                <Sparkles className="h-8 w-8 mx-auto text-pink-500" />
                <h3 className="font-semibold text-slate-200">Recap</h3>
                <p className="text-sm text-slate-400">
                  AI-powered wrapped-style summary
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
