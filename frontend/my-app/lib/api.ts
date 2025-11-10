// ============================================
// RIFT REWIND - API CLIENT
// ============================================

import {
  GetStatsResponse,
  GetTimelineStatsResponse,
  GenerateRecapResponse,
  ProcessTimelinesResponse,
} from "./types";

const BASE_URL = "https://league-insights-ai.up.railway.app/";

// ============================================
// Helper: Fetch with error handling
// ============================================

async function fetchAPI<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`);
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }
  
  return response.json();
}

// ============================================
// 1. Get Stats
// ============================================

export async function getStats(
  gameName: string,
  tagLine: string,
  region: string = "americas"
): Promise<GetStatsResponse> {
  const endpoint = `/get-stats?gameName=${encodeURIComponent(gameName)}&tagLine=${encodeURIComponent(tagLine)}&region=${region}`;
  return fetchAPI<GetStatsResponse>(endpoint);
}

// ============================================
// 2. Process Timelines
// ============================================

export async function processTimelines(
  gameName: string,
  tagLine: string,
  region: string = "americas"
): Promise<ProcessTimelinesResponse> {
  const endpoint = `/process-timelines?gameName=${encodeURIComponent(gameName)}&tagLine=${encodeURIComponent(tagLine)}&region=${region}`;
  return fetchAPI<ProcessTimelinesResponse>(endpoint);
}

// ============================================
// 3. Get Timeline Stats
// ============================================

export async function getTimelineStats(
  gameName: string,
  tagLine: string,
  region: string = "americas"
): Promise<GetTimelineStatsResponse> {
  const endpoint = `/get-timeline-stats?gameName=${encodeURIComponent(gameName)}&tagLine=${encodeURIComponent(tagLine)}&region=${region}`;
  return fetchAPI<GetTimelineStatsResponse>(endpoint);
}

// ============================================
// 4. Generate Recap (POST request)
// ============================================

export async function generateRecap(
  gameName: string,
  tagLine: string,
  region: string = "americas"
): Promise<GenerateRecapResponse> {
  const response = await fetch(`${BASE_URL}/generate-recap`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ gameName, tagLine, region }),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }
  
  return response.json();
}

// ============================================
// Full Pipeline (for landing page)
// ============================================

export async function fetchAllData(
  gameName: string,
  tagLine: string,
  region: string = "americas",
  onProgress?: (step: string) => void
) {
  try {
    // Step 1: Get Stats
    onProgress?.("Fetching player stats...");
    const stats = await getStats(gameName, tagLine, region);
    
    // Step 2: Process Timelines
    onProgress?.("Processing match timelines...");
    const processResult = await processTimelines(gameName, tagLine, region);
    
    // Even if skipped=808, treat as success
    console.log("Timeline processing result:", processResult);
    
    // Step 3: Get Timeline Stats
    onProgress?.("Fetching timeline analytics...");
    const timeline = await getTimelineStats(gameName, tagLine, region);
    
    onProgress?.("Complete!");
    
    return {
      stats,
      timeline,
      processResult,
    };
  } catch (error) {
    console.error("API Pipeline Error:", error);
    throw error;
  }
}
