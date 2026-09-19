// ============================================
// RIFT REWIND - API CLIENT
// ============================================

import {
  GetStatsResponse,
  GetTimelineStatsResponse,
  GenerateRecapResponse,
  ProcessTimelinesResponse,
} from "./types";

// Configured per environment; the trailing slash is stripped so callers can
// always write `${BASE_URL}/path` without producing a `//` in the URL.
const BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "https://league-insights-ai.up.railway.app"
).replace(/\/+$/, "");

// ============================================
// Helper: Fetch with error handling
// ============================================

async function fetchAPI<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(await describeError(response));
  }

  return response.json();
}

/**
 * Surface the backend's own error message instead of a raw status dump.
 * The API returns `{ "error": "..." }`, so an expired key or an unknown Riot ID
 * can be shown to the user verbatim rather than as "API Error: 502 - {...}".
 */
async function describeError(response: Response): Promise<string> {
  const body = await response.text();
  try {
    const parsed = JSON.parse(body);
    if (parsed?.error) return parsed.error;
  } catch {
    // Not JSON -- fall through to the raw text.
  }
  return `Request failed (${response.status}): ${body.slice(0, 200)}`;
}

/**
 * Build a query string for the player-scoped endpoints.
 *
 * `region` is deliberately optional and omitted when absent: the backend
 * resolves the correct Riot routing cluster itself (via Riot's region endpoint,
 * the tagLine, then a probe across all four clusters). Sending a hardcoded
 * "americas" would override that detection and strand every non-Americas
 * player on the wrong cluster, which returns an empty match list rather than
 * an error. Pass it only when the user has explicitly chosen a region.
 */
function playerQuery(gameName: string, tagLine: string, region?: string): string {
  const params = new URLSearchParams({ gameName, tagLine });
  if (region) params.set("region", region);
  return params.toString();
}

// ============================================
// 1. Get Stats
// ============================================

export async function getStats(
  gameName: string,
  tagLine: string,
  region?: string
): Promise<GetStatsResponse> {
  return fetchAPI<GetStatsResponse>(`/get-stats?${playerQuery(gameName, tagLine, region)}`);
}

// ============================================
// 2. Process Timelines
// ============================================

export async function processTimelines(
  gameName: string,
  tagLine: string,
  region?: string
): Promise<ProcessTimelinesResponse> {
  return fetchAPI<ProcessTimelinesResponse>(`/process-timelines?${playerQuery(gameName, tagLine, region)}`);
}

// ============================================
// 3. Get Timeline Stats
// ============================================

export async function getTimelineStats(
  gameName: string,
  tagLine: string,
  region?: string
): Promise<GetTimelineStatsResponse> {
  return fetchAPI<GetTimelineStatsResponse>(`/get-timeline-stats?${playerQuery(gameName, tagLine, region)}`);
}

// ============================================
// 4. Generate Recap (POST request)
// ============================================

export async function generateRecap(
  gameName: string,
  tagLine: string,
  region?: string
): Promise<GenerateRecapResponse> {
  const response = await fetch(`${BASE_URL}/generate-recap`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(region ? { gameName, tagLine, region } : { gameName, tagLine }),
  });
  
  if (!response.ok) {
    throw new Error(await describeError(response));
  }

  return response.json();
}

// ============================================
// Full Pipeline (for landing page)
// ============================================

export async function fetchAllData(
  gameName: string,
  tagLine: string,
  region?: string,
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
